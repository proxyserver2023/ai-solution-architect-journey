import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function storeKnowledgeTool(server: McpServer) {
  server.tool(
    'store-knowledge',
    { topic: z.string(), content: z.string() },
    async ({ topic, content }) => {
      try {
        const response = await fetch('http://localhost:8080/knowledge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic, content }),
        });

        if (!response.ok) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to store knowledge, received response status: ${response.statusText}`,
              },
            ],
          };
        }

        return {
          content: [{ type: 'text', text: `Stored: ${topic} - ${content}` }],
        };
      } catch (error) {
        if (error instanceof Error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to store knowledge, received error: ${error.message}`,
              },
            ],
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `Failed to store knowledge, received error: ${error}`,
            },
          ],
        };
      }
    }
  );
}
