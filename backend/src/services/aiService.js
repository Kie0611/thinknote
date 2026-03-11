import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../lib/env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export const generateSummary = async (content) => {
  try {
    // Use a supported model from your account
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Summarize this note in a short paragraph:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error; 
  }
};