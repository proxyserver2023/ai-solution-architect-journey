import { generateText } from "ai";
import { xai } from "@ai-sdk/xai";

const { text } = await generateText({
  model: xai("grok-3-beta"),
  prompt: "Write a TypeScript function that adds two numbers.",
});
