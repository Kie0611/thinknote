import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../lib/env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export const generateSummary = async (content) => {
  try {
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

export const generateFlashcards = async (content) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  Generate up to 5 flashcards from the following text.
  Return ONLY a valid JSON array. Each item must have "question" and "answer".
  Do NOT include any extra text, bullets, or explanations.

  Text:
  ${content}
  `;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  // extract JSON array
  const match = rawText.match(/\[.*\]/s); // matches everything between the first [ and the last ] including newlines
  if (!match) {
    console.error("AI raw response (not JSON):", rawText);
    throw new Error("AI did not return valid flashcards JSON");
  }

  const flashcards = JSON.parse(match[0]);
  return flashcards;
};

export const askQuestionAboutNote = async (content, history, question) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  You are an AI study assistant.

  The student has written the following note:

  ${content}

  Previous conversation history between the student and the AI:
  ${history}

  The student asks:
  ${question}

  Answer the question using the note as the main context. 
  You may expand, explain, or clarify the topic to help the student understand better.
  Keep the answer clear and educational.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};