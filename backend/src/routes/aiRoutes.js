import express from "express";
import { 
  summarizeNote,
  generateFlashcardsFromNote,
  askNoteQuestion,
  getChatHistory,
} from "../controllers/aiController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/summarize", protectRoute, summarizeNote);
router.post("/flashcards", protectRoute, generateFlashcardsFromNote);
router.post("/chat", protectRoute, askNoteQuestion);
router.get("/chat/:noteId", protectRoute, getChatHistory);

export default router;