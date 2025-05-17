import { ResourceTemplate, McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function knowledgeForTopicResource(server: McpServer) {
  server.resource(
    'knowledge-for-topic',
    new ResourceTemplate('knowledge://{topic}', {
      list: async () => {
        try {
          const response = await fetch('http://localhost:8080/knowledge');

          if (!response.ok) {
            return { resources: [] };
          }

          const data = (await response.json()) as string[];

          return {
            resources: data.map((topic) => ({
              uri: `knowledge://${topic}`,
              description:
                'A stored piece of knowledge - specifically, stored knowledge about topic: ' +
                topic,
              name: topic,
            })),
          };
        } catch (error) {
          return { resources: [] };
        }
      },
    }),
    async (uri, { topic }) => {
      try {
        const response = await fetch(
          `http://localhost:8080/knowledge?topic=${topic}`
        );

        if (!response.ok) {
          return {
            contents: [
              {
                uri: uri.href,
                text: `Failed to retrieve knowledge for topic: ${topic}, received response status: ${response.statusText}`,
              },
            ],
          };
        }

        const data = await response.json();

        return {
          contents: [
            {
              uri: uri.href,
              text: `Knowledge for topic: ${topic} - ${data.content}`,
            },
          ],
        };
      } catch (error) {
        if (error instanceof Error) {
          return {
            contents: [
              {
                uri: uri.href,
                text: `Failed to retrieve knowledge for topic: ${topic}, received error: ${error.message}`,
              },
            ],
          };
        }
        return {
          contents: [
            {
              uri: uri.href,
              text: `Failed to retrieve knowledge for topic: ${topic}, received error: ${error}`,
            },
          ],
        };
      }
    }
  );
}
