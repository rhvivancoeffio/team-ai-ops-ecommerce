import { Message } from '../types';
import { EventEmitter } from 'events';

/**
 * Message Bus for inter-agent communication
 */
export class MessageBus extends EventEmitter {
  private messages: Message[] = [];
  private subscribers: Map<string, Set<string>> = new Map();

  /**
   * Send a message to a specific agent
   */
  async send(message: Message): Promise<void> {
    this.messages.push(message);
    this.emit('message', message);
    this.emit(`message:${message.to}`, message);
  }

  /**
   * Broadcast a message to all subscribers of a topic
   */
  async broadcast(topic: string, message: Message): Promise<void> {
    const subscribers = this.subscribers.get(topic) || new Set();
    for (const subscriberId of subscribers) {
      const broadcastMessage = {
        ...message,
        to: subscriberId
      };
      await this.send(broadcastMessage);
    }
  }

  /**
   * Subscribe an agent to a topic
   */
  subscribe(topic: string, agentId: string): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(agentId);
  }

  /**
   * Unsubscribe an agent from a topic
   */
  unsubscribe(topic: string, agentId: string): void {
    const subscribers = this.subscribers.get(topic);
    if (subscribers) {
      subscribers.delete(agentId);
    }
  }

  /**
   * Get message history
   */
  getMessages(filter?: { from?: string; to?: string; type?: string }): Message[] {
    if (!filter) {
      return [...this.messages];
    }

    return this.messages.filter(msg => {
      if (filter.from && msg.from !== filter.from) return false;
      if (filter.to && msg.to !== filter.to) return false;
      if (filter.type && msg.type !== filter.type) return false;
      return true;
    });
  }

  /**
   * Clear message history
   */
  clearHistory(): void {
    this.messages = [];
  }
}
