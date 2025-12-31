import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_AI_KEY } from "./constants";

console.log("Gemini AI Key:", GEMINI_AI_KEY);

export const genAI = new GoogleGenerativeAI(GEMINI_AI_KEY);
