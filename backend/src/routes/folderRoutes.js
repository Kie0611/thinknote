import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { arcjetProtection } from '../middleware/arcjetMiddleware.js';
import { 
  getFolder,
  getFolderById,
  createFolder,
  deleteFolder }
from '../controllers/folderController.js';

const router = express.Router();

// router.use(arcjetProtection)
router.use(protectRoute)

router.get("/", getFolder);
router.get("/:id", getFolderById);
router.post("/", createFolder);
router.delete("/:id", deleteFolder);

export default router;