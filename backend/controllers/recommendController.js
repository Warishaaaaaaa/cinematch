import asyncHandler from "express-async-handler";
import { generateRecommendations } from "../services/recommendationEngine.js";
import User from "../models/User.js";

// @desc    Generate movie recommendations from questionnaire answers
// @route   POST /api/recommend
// @access  Public (saves preferences only if authenticated)
export const getRecommendations = asyncHandler(async (req, res) => {
  const { mood, genres, language, runtime, releasePeriod, favoriteActor } = req.body;

  if (!mood) {
    res.status(400);
    throw new Error("Mood is required to generate recommendations");
  }

  const answers = {
    mood,
    genres: genres || [],
    language: language || "",
    runtime: runtime || "",
    releasePeriod: releasePeriod || "",
    favoriteActor: favoriteActor || "",
  };

  const recommendations = await generateRecommendations(answers);

  // Persist preferences for logged-in users so future visits can be personalized
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { preferences: answers });
  }

  res.json({ success: true, answers, count: recommendations.length, recommendations });
});
