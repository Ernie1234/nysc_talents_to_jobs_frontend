// lib/google-ai-model.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if API key exists
const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "Gemini API key is missing. Please check your environment variables."
  );
  throw new Error("Gemini API key is not configured");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const AIChatSession = model.startChat({
  generationConfig,
  history: [],
});
