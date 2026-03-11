import Flashcard from "../models/Flashcard.js";

export const getFlashcardsByNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const flashcards = await Flashcard.find({
      noteId,
      user: userId
    }).sort({ createdAt: 1 });

    if (!flashcards || flashcards.length === 0) {
      return res.status(200).json({ message: "No flashcards found for this note", flashcards: [] });
    }

    res.status(200).json({ flashcards });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};