import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_AI_KEY } from "./constants";

// Fallback for local development (npm start)
const localGenAI = GEMINI_AI_KEY ? new GoogleGenerativeAI(GEMINI_AI_KEY) : null;

export const fetchGemini = async (prompt) => {
  // 1. Production: Try hitting the secure Netlify Serverless Function first
  try {
    const res = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.text;
    }
  } catch (err) {
    // If fetch fails (like on local npm start where .netlify doesn't exist), silently fall back
  }

  // 2. Local fallback using built-in React env var
  if (localGenAI) {
    console.warn("Using local Gemini wrapper. This is intended for localhost dev only.");
    const model = localGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  throw new Error("Gemini API is not configured");
};
