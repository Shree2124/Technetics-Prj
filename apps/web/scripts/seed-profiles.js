/**
 * seed-profiles.js
 * ---
 * Seeds the generated CitizenProfile and VerifierProfile data into MongoDB.
 * Also updates each User document to link their profile ObjectId.
 *
 * Usage:  node scripts/seed-profiles.js
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// ── Load env from .env.local ────────────────────────────────────────────
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const idx = trimmed.indexOf("=");
  if (idx === -1) return;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ── Helper: convert extended-JSON $oid to plain string ──────────────────
function resolveOid(val) {
  if (val && val.$oid) return val.$oid;
  return val;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!\n");

  const db = mongoose.connection.db;

  // ── Drop stale indexes that may conflict ──────────────────────────────
  // Previous schema versions may have created a unique index on "user" instead of "userId"
  try {
    const cpIndexes = await db.collection("citizenprofiles").indexes();
    for (const idx of cpIndexes) {
      if (idx.key && idx.key.user !== undefined && idx.name !== "_id_") {
        console.log(`🗑  Dropping stale index "${idx.name}" on citizenprofiles`);
        await db.collection("citizenprofiles").dropIndex(idx.name);
      }
    }
  } catch (e) {
    // collection might not exist yet, that's fine
  }

  try {
    const vpIndexes = await db.collection("verifierprofiles").indexes();
    for (const idx of vpIndexes) {
      if (idx.key && idx.key.user !== undefined && idx.name !== "_id_") {
        console.log(`🗑  Dropping stale index "${idx.name}" on verifierprofiles`);
        await db.collection("verifierprofiles").dropIndex(idx.name);
      }
    }
  } catch (e) {
    // collection might not exist yet, that's fine
  }

  // ── Read generated JSON files ─────────────────────────────────────────
  const citizenData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "test.citizenprofiles.json"), "utf-8")
  );
  const verifierData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "test.verifierprofiles.json"), "utf-8")
  );

  // ── Seed Citizen Profiles (raw collection operations) ─────────────────
  console.log(`\n📥 Seeding ${citizenData.length} citizen profiles...`);
  let citizenOk = 0;

  for (const raw of citizenData) {
    const userId = resolveOid(raw.userId);
    const docId = resolveOid(raw._id);

    const doc = {
      _id: new mongoose.Types.ObjectId(docId),
      userId: new mongoose.Types.ObjectId(userId),
      income: raw.income,
      employment_status: raw.employment_status,
      family_size: raw.family_size,
      education_level: raw.education_level,
      health_condition: raw.health_condition,
      housing_type: raw.housing_type,
      disaster_risk: raw.disaster_risk,
      address: raw.address,
      district: raw.district,
      phoneNumber: raw.phoneNumber,
      documents: raw.documents,
      vulnerabilityScore: raw.vulnerabilityScore,
      verificationStatus: raw.verificationStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.collection("citizenprofiles").updateOne(
        { userId: doc.userId },
        { $set: doc },
        { upsert: true }
      );
      // Link profile to user
      await db.collection("users").updateOne(
        { _id: doc.userId },
        { $set: { profile: doc._id } }
      );
      citizenOk++;
    } catch (err) {
      console.warn(`  ⚠ citizen ${userId}: ${err.message}`);
    }
  }
  console.log(`  ✅ ${citizenOk}/${citizenData.length} citizen profiles seeded`);

  // ── Seed Verifier Profiles (raw collection operations) ────────────────
  console.log(`\n📥 Seeding ${verifierData.length} verifier profiles...`);
  let verifierOk = 0;

  for (const raw of verifierData) {
    const userId = resolveOid(raw.userId);
    const docId = resolveOid(raw._id);

    const doc = {
      _id: new mongoose.Types.ObjectId(docId),
      userId: new mongoose.Types.ObjectId(userId),
      department: raw.department,
      region: raw.region,
      designation: raw.designation,
      isActive: raw.isActive,
      verifiedCitizens: (raw.verifiedCitizens || []).map((c) =>
        new mongoose.Types.ObjectId(resolveOid(c))
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.collection("verifierprofiles").updateOne(
        { userId: doc.userId },
        { $set: doc },
        { upsert: true }
      );
      // Link profile to user
      await db.collection("users").updateOne(
        { _id: doc.userId },
        { $set: { profile: doc._id } }
      );
      verifierOk++;
    } catch (err) {
      console.warn(`  ⚠ verifier ${userId}: ${err.message}`);
    }
  }
  console.log(`  ✅ ${verifierOk}/${verifierData.length} verifier profiles seeded`);

  console.log("\n🎉 Seeding complete!");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
