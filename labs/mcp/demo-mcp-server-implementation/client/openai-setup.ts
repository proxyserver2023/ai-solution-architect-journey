import OpenAI from 'openai';
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export function setupOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required.');
  }
  return new OpenAI({ apiKey });
}

