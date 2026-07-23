import express from "express";
import { registerUser, loginUser, logoutUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { requireDB } from "../middleware/requireDB.js";

const router = express.Router();

router.post("/register", requireDB, registerUser);
router.post("/login", requireDB, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/profile", requireDB, protect, getProfile);

export default router;
