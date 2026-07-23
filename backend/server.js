import "dotenv/config"; // must be the very first import — loads .env before any other module reads process.env

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import recommendRoutes from "./routes/recommendRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Only connect to MongoDB if a URI is actually configured. This lets the
// server boot in demo mode (recommendations + TMDb search still work)
// even before a database is wired up.
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn("MONGO_URI not set — auth, favorites, and history routes will fail until it is configured.");
}

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "CineMatch API is running", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CineMatch API listening on port ${PORT}`);
});
