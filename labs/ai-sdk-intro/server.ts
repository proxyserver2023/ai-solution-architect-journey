import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  try {
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY is required in the .env file");
    }
    const article = `Large language models (LLMs) can generate text in response to a prompt, which can contain instructions and information to process. For example, you can ask a model to come up with a recipe, draft an email, or summarize a document.

The AI SDK Core provides two functions to generate text and stream it from LLMs:

generateText: Generates text for a given prompt and model.
streamText: Streams text from a given prompt and model.
Advanced LLM features such as tool calling and structured data generation are built on top of text generation.`;

    const { text } = await generateText({
      model: xai("grok-3-beta"),
      system:
        'You are a professional writer. ' +
        'You write simple, clear, and concise content.',
      prompt: `Summarize the following article in 3-5 sentences: ${article}`,
    });
    console.log("Response:", text);
  } catch (error) {
    console.error("Error:", error);
  }
}

main()
