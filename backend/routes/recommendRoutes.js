import express from "express";
import { getRecommendations } from "../controllers/recommendController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalAuth, getRecommendations);

export default router;
