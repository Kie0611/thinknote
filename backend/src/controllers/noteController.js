import Note from "../models/Note.js";

export const getNotes = async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user._id;

  try {
    const notes = await Note.find({
      folderId,
      user: userId
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNoteById = async (req, res) => {
  const { folderId, noteId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({
      _id: noteId,
      folderId,
      user: userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNote = async (req, res) => {
  const { folderId } = req.params;
  const { title, content, tags } = req.body;
  const userId = req.user._id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newNote = new Note({
      title,
      content,
      tags,
      folderId,
      user: userId
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNote = async (req, res) => {
  const { folderId, noteId } = req.params;
  const { title, content, tags } = req.body;
  const userId = req.user._id;

  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        folderId,
        user: userId
      },
      {
        title,
        content,
        tags
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  const { folderId, noteId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findOneAndDelete({
      _id: noteId,
      folderId,
      user: userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};