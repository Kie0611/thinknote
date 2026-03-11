import Note from "../models/Note.js";
import { generateSummary } from "../services/aiService.js";

export const summarizeNote = async (req, res) => {
  console.log(req.body);
  console.log(req.user);

  const { noteId } = req.body;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({
      _id: noteId,
      user: userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const summary = await generateSummary(note.content);

    note.summary = summary;
    await note.save();

    res.status(200).json({
      summary
    });

  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ message: "AI summary failed", error: error.message });
  }
};