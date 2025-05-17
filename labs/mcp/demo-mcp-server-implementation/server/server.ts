import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './create-server.js';
import { storeKnowledgeTool } from './lib/tools/store-knowledge.js';
import { knowledgeForTopicResource } from './lib/resources/knowledge-for-topic.js';


const server = createServer()

storeKnowledgeTool(server);
knowledgeForTopicResource(server);

const transport = new StdioServerTransport();
await server.connect(transport);





