import express from "express";
import { searchMovies, getMovieById, getGenres } from "../controllers/movieController.js";

const router = express.Router();

router.get("/search", searchMovies);
router.get("/meta/genres", getGenres);
router.get("/:id", getMovieById);

export default router;
