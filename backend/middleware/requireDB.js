import mongoose from "mongoose";

/**
 * Guards routes that need MongoDB (auth, favorites, history). If the
 * database isn't connected (readyState !== 1), we short-circuit with a
 * clear, immediate 503 instead of letting the request hang or throw a
 * confusing low-level driver error. This is what previously made signup
 * and login look "broken" with no explanation — configure MONGO_URI in
 * backend/.env with a real MongoDB Atlas (or local) connection string to
 * resolve it.
 */
export const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        "Database is not connected. Set a valid MONGO_URI in backend/.env (see README for MongoDB Atlas setup) and restart the server.",
    });
  }
  next();
};
