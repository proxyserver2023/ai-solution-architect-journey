import { z } from 'zod';
import { generateText, tool } from 'ai';
import { xai } from "@ai-sdk/xai"

const myModel = xai("grok-3-beta");

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  try {
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY is required in the .env file");
    }

    const result = await generateText({
      model: myModel,
      tools: {
        weather: tool({
          description: 'Get the weather in a location',
          parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => ({
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }),
        }),
      },
      prompt: 'What is the weather in San Francisco?',
    });
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main()

