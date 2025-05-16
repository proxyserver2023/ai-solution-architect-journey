import { generateText, tool } from "ai";
import { xai } from "@ai-sdk/xai";
import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const tools = {
  calculate_area_of_circle: tool({
    description: "Calculate the area of a circle given its radius",
    parameters: z.object({
      radius: z.number().describe('The radius of the circle in meters'),
    }),
    execute: async ({ radius }) => ({
      radius,
      area: Math.PI * Math.pow(radius, 2)
    })
  })
}


function handleToolCall(toolCall: any) {
  switch (toolCall.toolName) {
    case "calculate_area_of_circle":
      const radius = toolCall.args.radius;
      const area = Math.PI * Math.pow(radius, 2);
      return {
        result: `The area of a circle with radius ${radius} meters is ${area.toFixed(2)} square meters.`
      };
    default:
      throw new Error(`Unknown tool: ${toolCall.ToolName}`);
  }
}

async function main() {
  const myModel = xai("grok-3-beta");
  try {
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY is required in the .env file");
    }

    const { text, toolCalls } = await generateText({
      model: myModel,
      prompt: "What is the area of a circle with radius 5 meters?",
      tools
    });
    console.log("Initial Response:", text);

    if (toolCalls && toolCalls.length > 0) {
      console.log("\nTool calls detected:");
      for (const toolCall of toolCalls) {

        console.log(`Tool Name: ${toolCall.toolName}`);
        console.log(`Arguments:`, toolCall.args);

        // Handle the tool call
        const result = handleToolCall(toolCall);
        console.log("Tool result:", result);

        // Use the tool result to generate a final response
        const { text: finalResponse } = await generateText({
          model: myModel,
          prompt: `I need to know the area of a circle with radius 5 meters.
          You called the tool and received this result: ${JSON.stringify(result)}.
          Please provide a final answer based on this result.`
        });

        console.log("\nFinal response:", finalResponse);
      }
    } else {
      console.log("No tool calls made.");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
