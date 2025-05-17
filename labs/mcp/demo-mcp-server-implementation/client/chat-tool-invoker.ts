import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import type { FunctionTool } from "openai/resources/responses/responses.mjs";

export class ToolInvoker {
  constructor(
    private client: Client,
    private tools: { resources: FunctionTool[]; tools: FunctionTool[] }
  ) { }

  isTool(name: string) {
    return this.tools.tools.some((tool) => tool.name === name);
  }

  isResource(name: string) {
    return this.tools.resources.some((tool) => tool.name === name);
  }

  async callToolOrResource(toolName: string, args: string) {
    if (this.isTool(toolName)) {
      const { content } = await this.client.callTool({
        name: toolName,
        arguments: JSON.parse(args),
      });
      return Array.isArray(content) && content.length > 0
        ? 'Result received from function call: ' + content[0].text
        : 'No response from the tool.';
    } else if (this.isResource(toolName)) {
      const { contents } = await this.client.readResource({
        uri: 'knowledge://' + toolName,
      });
      return 'Result received from reading resource: ' + contents[0]!.text;
    }
    return 'Tool not found.';
  }
}
