import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["../server/server.ts"]
  });


  const client = new Client(
    {
      name: "example-client",
      version: "1.0.0"
    }
  );

  await client.connect(transport);

  const mcpTools = await client.listTools();
  console.log(mcpTools);

  const result = await client.callTool({
    name: "store-knowledge",
    arguments: {
      topic: "test3",
      content: "test3"
    }
  });
  console.log(result);

  const resources2 = await client.listResources();
  console.log(resources2);


  const resource3 = await client.readResource({ uri: "knowledge://test" });
  console.log(resource3);

  // const prompts = await client.listPrompts();
  // console.log(prompts);

  // const tools = await client.listTools();
  // console.log(tools);

}

main()
