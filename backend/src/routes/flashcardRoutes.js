import express from "express";
import { getFlashcardsByNote } from "../controllers/flashcardController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/note/:noteId", protectRoute, getFlashcardsByNote);

export default router;