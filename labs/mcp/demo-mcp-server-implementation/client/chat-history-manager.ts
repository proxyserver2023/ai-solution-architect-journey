export class ChatHistoryManager {
  private history: { role: 'user' | 'assistant', content: string }[] = [];

  addMessage(role: 'user' | 'assistant', content: string) { this.history.push({ role, content }); }
  getHistory() { return this.history; }
  getRecent(n: number) { return this.history.slice(-n); }
  getLastMessage() { return this.history.slice(-1)[0]?.content || ''; }
}
