import express from "express";
import { summarizeNote } from "../controllers/aiController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/summarize", protectRoute, summarizeNote);

router.get("/test", (req, res) => {
  res.json({ message: "AI route works" });
});

export default router;