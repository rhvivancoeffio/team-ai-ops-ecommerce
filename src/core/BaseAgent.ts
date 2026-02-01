import { Task, Message, AgentConfig } from '../types';

/**
 * Base Agent class that all AI agents extend
 */
export abstract class BaseAgent {
  protected config: AgentConfig;
  protected isRunning: boolean = false;
  protected taskQueue: Task[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /**
   * Get agent ID
   */
  getId(): string {
    return this.config.id;
  }

  /**
   * Get agent name
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Get agent type
   */
  getType(): string {
    return this.config.type;
  }

  /**
   * Check if agent is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled !== false;
  }

  /**
   * Start the agent
   */
  async start(): Promise<void> {
    if (!this.isEnabled()) {
      throw new Error(`Agent ${this.getName()} is disabled`);
    }
    this.isRunning = true;
    await this.onStart();
  }

  /**
   * Stop the agent
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    await this.onStop();
  }

  /**
   * Process a task
   */
  async processTask(task: Task): Promise<Task> {
    if (!this.isRunning) {
      throw new Error(`Agent ${this.getName()} is not running`);
    }

    task.status = 'processing';
    task.assignedTo = this.getId();
    task.updatedAt = new Date();

    try {
      const result = await this.executeTask(task);
      task.status = 'completed';
      task.result = result;
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);
    }

    task.updatedAt = new Date();
    return task;
  }

  /**
   * Handle incoming messages
   */
  async handleMessage(message: Message): Promise<void> {
    await this.onMessage(message);
  }

  /**
   * Hook for agent start
   */
  protected async onStart(): Promise<void> {
    // Override in subclasses
  }

  /**
   * Hook for agent stop
   */
  protected async onStop(): Promise<void> {
    // Override in subclasses
  }

  /**
   * Hook for message handling
   */
  protected async onMessage(message: Message): Promise<void> {
    // Override in subclasses
  }

  /**
   * Execute a specific task - must be implemented by subclasses
   */
  protected abstract executeTask(task: Task): Promise<any>;
}
