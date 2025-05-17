import rl from 'node:readline/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { setupOpenAI } from './openai-setup.js';
import { ChatHistoryManager } from './chat-history-manager.js';
import { ToolInvoker } from './chat-tool-invoker.js';
import { ChatResponder } from './chat-responder.js';
import { setupMcpTools } from './mcp-tools.js';

async function main() {
  try {
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['../../server/dist/server.js']
    });


    const client = new Client({
      name: 'mcp-client',
      version: '1.0.0'
    });

    await client.connect(transport);

    const model = setupOpenAI();
    const tools = await setupMcpTools(client);
    const ui = rl.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const historyManager = new ChatHistoryManager();
    const toolInvoker = new ToolInvoker(client, tools);
    const responder = new ChatResponder(model, toolInvoker, historyManager, ui);
    while (true) {
      await responder.handleChat();
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }


  // const responder = new ChatResponder(model, tools, ui);
  // while (true) {
  //   await chatHandler.handleChat();
  // }
  // } catch (error) {
  //   console.error('Fatal error:', error);
  //   process.exit(1);
  // }

}

main()
