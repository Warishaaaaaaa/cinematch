import asyncHandler from "express-async-handler";
import { tmdbService } from "../services/tmdbService.js";

// @desc    Search movies by title
// @route   GET /api/movies/search?q=
// @access  Public
export const searchMovies = asyncHandler(async (req, res) => {
  const { q, page } = req.query;

  if (!q || !q.trim()) {
    res.status(400);
    throw new Error("Please provide a search query (?q=)");
  }

  const results = await tmdbService.search(q.trim(), Number(page) || 1);
  res.json({ success: true, count: results.length, results });
});

// @desc    Get full movie details by TMDb id
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = asyncHandler(async (req, res) => {
  const movie = await tmdbService.getById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  res.json({ success: true, movie });
});

// @desc    Get the list of TMDb genres (used by the questionnaire UI)
// @route   GET /api/movies/meta/genres
// @access  Public
export const getGenres = asyncHandler(async (req, res) => {
  const genres = await tmdbService.getGenreList();
  res.json({ success: true, genres });
});
