/**
 * generate-profiles.js
 * ---
 * Reads test.users.json, and for every citizen user generates a CitizenProfile
 * document, and for every verifier user generates a VerifierProfile document.
 * Outputs two JSON files (MongoDB extended-JSON format) ready for mongoimport.
 *
 * Usage:  node scripts/generate-profiles.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ── helpers ─────────────────────────────────────────────────────────────
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function objectId() {
  return crypto.randomBytes(12).toString("hex");
}
function now() {
  return { $date: new Date().toISOString() };
}
function phoneNumber() {
  return `+91${randInt(70000, 99999)}${randInt(10000, 99999)}`;
}

// ── realistic Indian data pools ─────────────────────────────────────────
const districts = [
  "Mumbai", "Pune", "Nagpur", "Thane", "Nashik",
  "Ahmedabad", "Surat", "Vadodara", "Rajkot",
  "Jaipur", "Udaipur", "Jodhpur",
  "Lucknow", "Varanasi", "Kanpur", "Allahabad",
  "Patna", "Gaya",
  "Bengaluru", "Mysuru", "Hubli",
  "Chennai", "Coimbatore", "Madurai",
  "Hyderabad", "Visakhapatnam", "Warangal",
  "Kolkata", "Howrah", "Siliguri",
  "Bhopal", "Indore",
  "Dehradun", "Haridwar",
  "Kochi", "Thiruvananthapuram",
];

const addresses = [
  "H.No. 42, Sector 15, Near Govt. School",
  "Flat 301, Shanti Apartments, MG Road",
  "Village Rampur, Block Sadar, Post Office Rampur",
  "12/A, Gandhi Nagar, Near Bus Stand",
  "Plot 78, Phase II, Industrial Area",
  "H.No. 5, Lane 3, Old City",
  "Flat 102, Sunrise Tower, Ring Road",
  "73, Subhash Colony, Civil Lines",
  "Ward No. 12, Nagar Palika Area",
  "J-45, Vikas Puri, Near Metro Station",
  "House 88, Teachers Colony, University Road",
  "B-22, Rajendra Nagar, Behind Hospital",
  "Gali No. 7, Mohalla Qazi, Old Town",
  "A-Block, DDA Flats, Vasant Kunj",
  "C/O Ram Prasad, Village Khandwa, Tehsil Harda",
];

const departments = [
  "Social Welfare Department",
  "Rural Development Department",
  "Health & Family Welfare",
  "Ministry of Agriculture",
  "Ministry of Housing & Urban Affairs",
  "Women & Child Development",
  "Ministry of Education",
  "Ministry of Finance - DBT Cell",
  "Tribal Affairs Department",
  "District Administration Office",
];

const regions = [
  "North India Zone", "South India Zone", "East India Zone",
  "West India Zone", "Central India Zone", "Northeast India Zone",
  "Maharashtra Region", "Gujarat Region", "Rajasthan Region",
  "Karnataka Region", "Tamil Nadu Region", "Kerala Region",
  "Uttar Pradesh Region", "Bihar Region", "West Bengal Region",
];

const designations = [
  "Block Development Officer",
  "District Welfare Officer",
  "Senior Verification Officer",
  "Assistant Commissioner (Verification)",
  "Taluka Verification Inspector",
  "Deputy Director (Citizen Services)",
  "Field Verification Officer",
  "Regional Verification Coordinator",
  "Scheme Verification Analyst",
  "Junior Verification Assistant",
];

// ── read users ──────────────────────────────────────────────────────────
const usersPath = path.join(__dirname, "test.users.json");
const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

const citizens = users.filter((u) => u.role === "citizen");
const verifiers = users.filter((u) => u.role === "verifier");

console.log(`Found ${citizens.length} citizen(s) and ${verifiers.length} verifier(s)`);

// ── generate citizen profiles ───────────────────────────────────────────
const citizenProfiles = citizens.map((user) => {
  const userId = user._id.$oid;
  const income = pick([
    0, 5000, 8000, 12000, 15000, 18000, 22000, 25000,
    30000, 35000, 45000, 60000, 80000, 100000, 150000,
  ]);
  const employment_status = pick([
    "employed", "unemployed", "informal", "self_employed", "retired",
  ]);
  const family_size = randInt(1, 8);
  const education_level = pick([
    "primary", "secondary", "graduate", "postgraduate", "none",
  ]);
  const health_condition = Math.random() > 0.65;
  const housing_type = pick(["temporary", "permanent", "rented", "homeless"]);
  const disaster_risk = pick(["low", "medium", "high"]);
  const district = pick(districts);
  const address = `${pick(addresses)}, ${district}`;
  const phone = phoneNumber();
  const documents = [];
  if (Math.random() > 0.3) documents.push("aadhaar_card.pdf");
  if (Math.random() > 0.4) documents.push("income_certificate.pdf");
  if (Math.random() > 0.5) documents.push("ration_card.pdf");
  if (Math.random() > 0.6) documents.push("bank_passbook.pdf");
  if (Math.random() > 0.7) documents.push("domicile_certificate.pdf");

  // Compute a simple vulnerability score based on factors
  let vulnScore = 0;
  if (income < 15000) vulnScore += 25;
  else if (income < 30000) vulnScore += 15;
  else if (income < 60000) vulnScore += 5;
  if (employment_status === "unemployed") vulnScore += 20;
  else if (employment_status === "informal") vulnScore += 10;
  if (family_size > 5) vulnScore += 10;
  else if (family_size > 3) vulnScore += 5;
  if (education_level === "none") vulnScore += 15;
  else if (education_level === "primary") vulnScore += 10;
  if (health_condition) vulnScore += 10;
  if (housing_type === "homeless") vulnScore += 15;
  else if (housing_type === "temporary") vulnScore += 10;
  if (disaster_risk === "high") vulnScore += 10;
  else if (disaster_risk === "medium") vulnScore += 5;
  vulnScore = Math.min(vulnScore, 100);

  const verificationStatus = pick(["pending", "verified", "rejected"]);

  // If this user already has a profile ObjectId in test.users.json, reuse it
  const profileId = user.profile ? user.profile.$oid : objectId();

  return {
    _id: { $oid: profileId },
    userId: { $oid: userId },
    income,
    employment_status,
    family_size,
    education_level,
    health_condition,
    housing_type,
    disaster_risk,
    address,
    district,
    phoneNumber: phone,
    documents,
    vulnerabilityScore: vulnScore,
    verificationStatus,
    createdAt: user.createdAt,
    updatedAt: now(),
    __v: 0,
  };
});

// ── generate verifier profiles ──────────────────────────────────────────
// Collect all citizen user IDs so we can assign some as "verifiedCitizens"
const citizenOids = citizens.map((c) => c._id.$oid);

const verifierProfiles = verifiers.map((user, idx) => {
  const userId = user._id.$oid;
  const department = departments[idx % departments.length];
  const region = pick(regions);
  const designation = designations[idx % designations.length];
  const isActive = Math.random() > 0.15; // 85 % active

  // Assign 0-5 random citizens that this verifier has "verified"
  const numVerified = randInt(0, 5);
  const shuffled = [...citizenOids].sort(() => Math.random() - 0.5);
  const verifiedCitizens = shuffled.slice(0, numVerified).map((id) => ({
    $oid: id,
  }));

  const profileId = user.profile ? user.profile.$oid : objectId();

  return {
    _id: { $oid: profileId },
    userId: { $oid: userId },
    department,
    region,
    designation,
    isActive,
    verifiedCitizens,
    createdAt: user.createdAt,
    updatedAt: now(),
    __v: 0,
  };
});

// ── write output files ──────────────────────────────────────────────────
const citizenOutPath = path.join(__dirname, "test.citizenprofiles.json");
const verifierOutPath = path.join(__dirname, "test.verifierprofiles.json");

fs.writeFileSync(citizenOutPath, JSON.stringify(citizenProfiles, null, 2), "utf-8");
fs.writeFileSync(verifierOutPath, JSON.stringify(verifierProfiles, null, 2), "utf-8");

console.log(`\n✅ Generated ${citizenProfiles.length} citizen profiles  → ${citizenOutPath}`);
console.log(`✅ Generated ${verifierProfiles.length} verifier profiles → ${verifierOutPath}`);
console.log("\nYou can import these into MongoDB with:");
console.log(`  mongoimport --uri <MONGODB_URI> --collection citizenprofiles --jsonArray --file scripts/test.citizenprofiles.json`);
console.log(`  mongoimport --uri <MONGODB_URI> --collection verifierprofiles --jsonArray --file scripts/test.verifierprofiles.json`);
