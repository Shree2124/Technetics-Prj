const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Import actual models
const User = require("../src/models/User").default;
const CitizenProfile = require("../src/models/CitizenProfile").default;
const VerifierProfile = require("../src/models/VerifierProfile").default;

async function updateProfiles() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Read the users JSON file
    const usersFilePath = path.join(__dirname, "test.users.json");
    const usersData = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(usersData);

    console.log(`Found ${users.length} users in JSON file`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // Find the user in database
        const dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          console.log(`❌ User not found in DB: ${user.email}`);
          skippedCount++;
          continue;
        }

        if (dbUser.profile) {
          console.log(`✅ ${user.name} - Already has profile`);
          skippedCount++;
          continue;
        }

        // Create profile based on role
        if (dbUser.role === "citizen") {
          const profile = await CitizenProfile.create({
            userId: dbUser._id,
            income: 50000,
            employment_status: "unemployed",
            family_size: 4,
            education_level: "primary",
            health_condition: false,
            housing_type: "temporary",
            disaster_risk: "medium",
            address: "Default Address",
            district: "Default District",
            verificationStatus: "pending",
          });

          dbUser.profile = profile._id;
          await dbUser.save();
          console.log(`✅ Created citizen profile for ${user.name}`);
          updatedCount++;
        } else if (dbUser.role === "verifier") {
          const profile = await VerifierProfile.create({
            userId: dbUser._id,
            department: "Social Welfare",
            region: "Central",
            designation: "Officer",
            isActive: true,
            verifiedCitizens: [],
          });

          dbUser.profile = profile._id;
          await dbUser.save();
          console.log(`✅ Created verifier profile for ${user.name}`);
          updatedCount++;
        }
      } catch (error) {
        console.log(`❌ Error updating ${user.email}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n✅ Update completed!`);
    console.log(`Users updated: ${updatedCount}`);
    console.log(`Users skipped (already had profiles): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total users processed: ${users.length}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateProfiles().catch(console.error);
