import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import dbConnect and models
import dbConnect from "../src/lib/db";
import User from "../src/models/User";
import CitizenProfile from "../src/models/CitizenProfile";
import VerifierProfile from "../src/models/VerifierProfile";
import mongoose from "mongoose";

async function updateProfiles() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    // Read the users JSON file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
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
        console.log(
          `❌ Error updating ${user.email}: ${(error as Error).message}`,
        );
        errorCount++;
      }
    }

    console.log(`\n✅ Update completed!`);
    console.log(`Users updated: ${updatedCount}`);
    console.log(`Users skipped (already had profiles): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total users processed: ${users.length}`);
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
  } finally {
    await mongoose.disconnect();
  }
}

updateProfiles().catch(console.error);
