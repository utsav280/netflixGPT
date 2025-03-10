import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_AI_KEY } from "./constants";

export const genAI = new GoogleGenerativeAI(GEMINI_AI_KEY);
