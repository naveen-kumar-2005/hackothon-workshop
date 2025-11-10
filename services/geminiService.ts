
import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = "You are an AI assistant designed for public sector organizations. Your goal is to provide accurate, unbiased, and helpful information on topics related to governance, public policy, civic engagement, and administrative procedures. Please be formal, professional, and cite sources when possible. Avoid expressing personal opinions or political biases.";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function startChat(): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
}
