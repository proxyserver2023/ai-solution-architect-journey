import OpenAI from 'openai';
import rl from 'node:readline/promises';
import { ChatHistoryManager } from './chat-history-manager.js';
import { ToolInvoker } from './chat-tool-invoker.js';

export class ChatResponder {
  private aiGreetingText = 'How can I help you today?';

  constructor(
    private model: OpenAI,
    private toolInvoker: ToolInvoker,
    private historyManager: ChatHistoryManager,
    private ui: rl.Interface
  ) { }

  private async handleToolCall(response: { name: string; arguments: string }) {
    const toolResponse = await this.toolInvoker.callToolOrResource(
      response.name,
      response.arguments
    );
    this.historyManager.addMessage('user', toolResponse);
  }

  async processResponse(response: any) {
    if (response.type === 'function_call') {
      await this.handleToolCall(response);
    } else if (response.type === 'reasoning') {
      this.historyManager.addMessage('assistant', response.summary.join('\n'));
    } else if (
      response.type === 'message' &&
      (response.content[0]?.type === 'output_text' ||
        response.content[0]?.type === 'refusal')
    ) {
      this.historyManager.addMessage(
        'assistant',
        response.content[0].type === 'output_text'
          ? response.content[0].text
          : response.content[0].refusal
      );
    }
    this.ui.write(this.historyManager.getLastMessage() + '\n');
  }

  async handleChat() {
    if (this.historyManager.getHistory().length > 0) {
      const { output_text } = await this.model.responses.create({
        model: 'gpt-4o-mini',
        instructions:
          'Based on the provided history, derive a friendly answer or summary (if any of that is needed) or follow-up question.',
        input: this.historyManager.getRecent(3),
      });
      this.aiGreetingText = output_text;
    }

    const prompt = await this.ui.question(this.aiGreetingText + '\n');
    this.historyManager.addMessage('user', prompt);

    const result = await this.model.responses.create({
      model: 'gpt-4o-mini',
      instructions:
        'You are a helpful, friendly assistant. You can use knowledge-related tools to find information on specific topics or store new knowledge.',
      input: this.historyManager.getHistory(),
      tools: [
        ...this.toolInvoker['tools'].tools,
        ...this.toolInvoker['tools'].resources,
      ],
    });

    if (result.output.length === 0) {
      console.log('No response from the assistant.');
      return;
    }

    await this.processResponse(result.output[0]);
  }
}
