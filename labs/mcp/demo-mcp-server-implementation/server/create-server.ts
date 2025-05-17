import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';



export function createServer() {
  const server = new McpServer({
    name: 'Demo',
    version: '1.0.0',
  });

  return server;
}
