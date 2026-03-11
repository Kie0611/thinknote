import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { arcjetProtection } from '../middleware/arcjetMiddleware.js';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes
} from '../controllers/noteController.js'

const router = express.Router();

// router.use(arcjetProtection);
router.use(protectRoute);

router.get("/folder/:folderId", getNotes);
router.get("/folder/:folderId/:noteId", getNoteById);

router.post("/folder/:folderId", createNote);
router.put("/folder/:folderId/:noteId", updateNote);
router.delete("/folder/:folderId/:noteId", deleteNote);

router.get("/search", protectRoute, searchNotes);

export default router