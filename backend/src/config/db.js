import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};
