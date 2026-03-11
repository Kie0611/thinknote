import Note from "../models/Note.js";
import Flashcard from "../models/Flashcard.js";
import { generateSummary } from "../services/aiService.js";
import { generateFlashcards } from "../services/aiService.js";

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

export const generateFlashcardsFromNote = async (req, res) => {
  const { noteId } = req.body;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({
      _id: noteId,
      user: userId
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    const flashcards = await generateFlashcards(note.content);

    if (!flashcards || flashcards.length === 0) {
      return res.status(200).json({ message: "No flashcards could be generated for this note", flashcards: [] });
    }

    //Save flashcards in DB
    const flashcardDocs = await Flashcard.insertMany(
      flashcards.map(f => ({ ...f, noteId, user: userId }))
    );

    res.status(200).json({ flashcards: flashcardDocs });

  } catch (error) {
    console.error("AI Flashcard Error:", error);
    res.status(500).json({ message: "AI flashcard generation failed", error: error.message });
  }
};