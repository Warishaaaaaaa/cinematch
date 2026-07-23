import asyncHandler from "express-async-handler";
import History from "../models/History.js";

// @desc    Get watch history for the logged-in user
// @route   GET /api/history
// @access  Private
export const getHistory = asyncHandler(async (req, res) => {
  const history = await History.find({ userId: req.user._id }).sort({ viewedAt: -1 });
  res.json({ success: true, count: history.length, history });
});

// @desc    Log a movie view to history (upserts the timestamp if already viewed)
// @route   POST /api/history
// @access  Private
export const addHistory = asyncHandler(async (req, res) => {
  const { movieId, title, poster } = req.body;

  if (!movieId || !title) {
    res.status(400);
    throw new Error("movieId and title are required");
  }

  const entry = await History.findOneAndUpdate(
    { userId: req.user._id, movieId },
    { title, poster, viewedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, entry });
});

// @desc    Clear all watch history for the logged-in user
// @route   DELETE /api/history
// @access  Private
export const clearHistory = asyncHandler(async (req, res) => {
  await History.deleteMany({ userId: req.user._id });
  res.json({ success: true, message: "Watch history cleared" });
});
