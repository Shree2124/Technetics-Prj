const axios = require("axios");

// Base URL
const BASE_URL = "http://localhost:3000";

// Helper function to delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple data arrays with Indian names - using unique emails with timestamp
const timestamp = Date.now();
const citizens = [
  {
    name: "Rajesh Kumar",
    email: `rajesh${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Priya Sharma",
    email: `priya${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Amit Patel",
    email: `amit${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Sneha Reddy",
    email: `sneha${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Vijay Singh",
    email: `vijay${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Anjali Gupta",
    email: `anjali${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Rahul Verma",
    email: `rahul${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Kavita Joshi",
    email: `kavita${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Sanjay Mishra",
    email: `sanjay${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
  {
    name: "Meena Agarwal",
    email: `meena${timestamp}@test.com`,
    password: "password123",
    role: "citizen",
  },
];

const verifiers = [
  {
    name: "Ramesh Nair",
    email: `ramesh${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Deepa Iyer",
    email: `deepa${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Ashok Pillai",
    email: `ashok${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Lakshmi Rao",
    email: `lakshmi${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Prakash Menon",
    email: `prakash${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Sunita Desai",
    email: `sunita${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Vikram Shah",
    email: `vikram${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Pooja Mehta",
    email: `pooja${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Anand Bhat",
    email: `anand${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
  {
    name: "Rekha Malhotra",
    email: `rekha${timestamp}@test.com`,
    password: "password123",
    role: "verifier",
  },
];

async function registerUser(userData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        // Allow redirects to handle cookies
        maxRedirects: 5,
        withCredentials: true,
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

async function seed() {
  console.log("Starting seed via API calls...");

  // Register citizens
  console.log("Registering 10 citizens...");
  let citizenSuccess = 0;
  for (const citizen of citizens) {
    const result = await registerUser(citizen);
    if (result.success) {
      citizenSuccess++;
      console.log(`✅ Registered citizen: ${citizen.name}`);
    } else {
      console.log(`❌ Failed to register ${citizen.name}: ${result.error}`);
    }
    // Add delay between requests
    await delay(100);
  }

  // Register verifiers
  console.log("\nRegistering 10 verifiers...");
  let verifierSuccess = 0;
  for (const verifier of verifiers) {
    const result = await registerUser(verifier);
    if (result.success) {
      verifierSuccess++;
      console.log(`✅ Registered verifier: ${verifier.name}`);
    } else {
      console.log(`❌ Failed to register ${verifier.name}: ${result.error}`);
    }
    // Add delay between requests
    await delay(100);
  }

  console.log(`\n✅ Seed completed!`);
  console.log(`Citizens registered: ${citizenSuccess}/10`);
  console.log(`Verifiers registered: ${verifierSuccess}/10`);
  console.log(`\nDefault password for all users: password123`);

  console.log("\nLogin credentials:");
  console.log(
    `Citizens: rajesh${timestamp}@test.com to meena${timestamp}@test.com`,
  );
  console.log(
    `Verifiers: ramesh${timestamp}@test.com to rekha${timestamp}@test.com`,
  );
}

seed().catch(console.error);
