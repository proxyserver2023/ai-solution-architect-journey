import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { FunctionTool } from 'openai/resources/responses/responses.mjs';


export async function setupMcpTools(client: Client) {
  const mcpResources = await client.listResources();
  const resources: FunctionTool[] = mcpResources.resources.map((res) => ({
    type: 'function',
    description: res.description,
    strict: true,
    name: res.name,
    parameters: {
      type: 'object',
      properties: { topic: { type: 'string' } },
      required: ['topic'],
      additionalProperties: false,
    },
  }));

  const mcpTools = await client.listTools();
  const tools: FunctionTool[] = mcpTools.tools.map((tool) => ({
    type: 'function',
    description: tool.description,
    strict: true,
    name: tool.name,
    parameters: {
      type: 'object',
      properties: { topic: { type: 'string' }, content: { type: 'string' } },
      required: ['topic', 'content'],
      additionalProperties: false,
    },
  }));

  return {
    resources,
    tools,
  }
}
