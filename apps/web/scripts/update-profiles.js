const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Base URL
const BASE_URL = "http://localhost:3000";

// Helper function to delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Read the users JSON file
const usersFilePath = path.join(__dirname, "test.users.json");

async function updateProfiles() {
  try {
    console.log("Reading users from JSON file...");
    const usersData = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(usersData);

    console.log(`Found ${users.length} users in JSON file`);

    // First, call the update profiles API to create missing profiles
    console.log("Updating all users without profiles...");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/update-profiles`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          maxRedirects: 5,
          withCredentials: true,
        },
      );

      console.log(`✅ ${response.data.message}`);
      console.log(
        `Total users processed: ${response.data.totalUsersProcessed}`,
      );
      console.log(`Users updated: ${response.data.updatedCount}`);

      if (response.data.errors) {
        console.log(`Errors encountered: ${response.data.errors.length}`);
        response.data.errors.forEach((err) => {
          console.log(`  - ${err.email}: ${err.error}`);
        });
      }
    } catch (error) {
      console.log(
        "❌ Failed to call update profiles API:",
        error.response?.data?.message || error.message,
      );
    }

    // Now check specific users from the JSON
    console.log("\nChecking specific users from JSON file...");
    let usersWithoutProfile = 0;
    let usersWithProfile = 0;

    for (const user of users) {
      if (!user.profile) {
        usersWithoutProfile++;
        console.log(`❌ ${user.name} (${user.email}) - No profile`);
      } else {
        usersWithProfile++;
        console.log(`✅ ${user.name} (${user.email}) - Has profile`);
      }
      await delay(50);
    }

    console.log(`\nSummary:`);
    console.log(`Users without profiles: ${usersWithoutProfile}`);
    console.log(`Users with profiles: ${usersWithProfile}`);
    console.log(`Total users: ${users.length}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

updateProfiles().catch(console.error);
