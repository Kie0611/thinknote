import express from "express";
import { summarizeNote, generateFlashcardsFromNote } from "../controllers/aiController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/summarize", protectRoute, summarizeNote);
router.post("/flashcards", protectRoute, generateFlashcardsFromNote);

export default router;