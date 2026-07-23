import express from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";
import { requireDB } from "../middleware/requireDB.js";

const router = express.Router();

router.use(requireDB, protect);
router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:movieId", removeFavorite);

export default router;
