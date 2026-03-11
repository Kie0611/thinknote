import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true
  },

  question: {
    type: String,
    required: true
  },

  answer: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;