import mongoose from "mongoose";
import { envs } from "..";

export async function connectMongo(): Promise<void> {
  const { DB_URL } = envs;
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectMongo(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Failed to disconnect from MongoDB:", error);
    throw error;
  }
}
