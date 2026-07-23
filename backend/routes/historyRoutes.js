import express from "express";
import { getHistory, addHistory, clearHistory } from "../controllers/historyController.js";
import { protect } from "../middleware/auth.js";
import { requireDB } from "../middleware/requireDB.js";

const router = express.Router();

router.use(requireDB, protect);
router.get("/", getHistory);
router.post("/", addHistory);
router.delete("/", clearHistory);

export default router;
