import asyncHandler from "express-async-handler";
import Favorite from "../models/Favorite.js";

// @desc    Get all favorites for the logged-in user
// @route   GET /api/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).sort({ savedAt: -1 });
  res.json({ success: true, count: favorites.length, favorites });
});

// @desc    Add a movie to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = asyncHandler(async (req, res) => {
  const { movieId, title, poster, rating, genre, year } = req.body;

  if (!movieId || !title) {
    res.status(400);
    throw new Error("movieId and title are required");
  }

  const existing = await Favorite.findOne({ userId: req.user._id, movieId });
  if (existing) {
    res.status(200).json({ success: true, favorite: existing, message: "Already in favorites" });
    return;
  }

  const favorite = await Favorite.create({
    userId: req.user._id,
    movieId,
    title,
    poster,
    rating,
    genre,
    year,
  });

  res.status(201).json({ success: true, favorite });
});

// @desc    Remove a movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
export const removeFavorite = asyncHandler(async (req, res) => {
  const result = await Favorite.findOneAndDelete({
    userId: req.user._id,
    movieId: req.params.movieId,
  });

  if (!result) {
    res.status(404);
    throw new Error("Favorite not found");
  }

  res.json({ success: true, message: "Removed from favorites" });
});
