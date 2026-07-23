import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas using Mongoose.
 *
 * In production, a failed DB connection exits the process so a process
 * manager (PM2, Render, etc.) can restart it. In development, we instead
 * log a clear warning and let the server keep running — this way you can
 * still use search, the quiz, and recommendations (which don't need the
 * database) while you sort out your MONGO_URI / network issue.
 */
const connectDB = async () => {
  try {
    // Fail fast instead of hanging: without these options, a bad/unreachable
    // URI leaves every query buffering silently for ~10s (Mongoose's default),
    // which is what made signup/login/search feel like they "hang" or return
    // a blank response instead of a clear error.
    mongoose.set("bufferCommands", false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.warn(
        "Continuing without a database connection (development mode). " +
          "Auth, favorites, and history routes will fail until MONGO_URI is fixed.",
      );
    }
  }
};

export default connectDB;
