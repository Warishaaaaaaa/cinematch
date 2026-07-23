import "dotenv/config";
import mongoose from "mongoose";

async function testConnection() {
  try {
    console.log("========================================");
    console.log("Testing MongoDB Connection...");
    console.log("========================================");

    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is undefined. Check your .env file.");
    }

    console.log("MONGO_URI loaded successfully.");
    console.log("Attempting to connect...\n");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("\n========================================");
    console.log("🎉 SUCCESS!");
    console.log("MongoDB Connected Successfully!");
    console.log(`Host     : ${conn.connection.host}`);
    console.log(`Database : ${conn.connection.name}`);
    console.log("========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log("\n========================================");
    console.log("❌ CONNECTION FAILED");
    console.log("========================================");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
