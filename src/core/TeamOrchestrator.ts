import { BaseAgent } from './BaseAgent';
import { MessageBus } from './MessageBus';
import { TeamConfig, Task, Message } from '../types';
import { EventEmitter } from 'events';

/**
 * Team Orchestrator - manages a team of AI agents
 */
export class TeamOrchestrator extends EventEmitter {
  private config: TeamConfig;
  private agents: Map<string, BaseAgent> = new Map();
  private messageBus: MessageBus;
  private tasks: Map<string, Task> = new Map();
  private isRunning: boolean = false;

  constructor(config: TeamConfig, messageBus: MessageBus) {
    super();
    this.config = config;
    this.messageBus = messageBus;
  }

  /**
   * Register an agent with the team
   */
  registerAgent(agent: BaseAgent): void {
    const agentId = agent.getId();
    this.agents.set(agentId, agent);
    
    // Subscribe to messages for this agent
    this.messageBus.on(`message:${agentId}`, async (message: Message) => {
      await agent.handleMessage(message);
    });
  }

  /**
   * Start the team
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    
    // Start all agents
    for (const agent of this.agents.values()) {
      if (agent.isEnabled()) {
        await agent.start();
      }
    }

    this.emit('team:started', { teamId: this.config.id });
  }

  /**
   * Stop the team
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    // Stop all agents
    for (const agent of this.agents.values()) {
      await agent.stop();
    }

    this.isRunning = false;
    this.emit('team:stopped', { teamId: this.config.id });
  }

  /**
   * Submit a task to the team
   */
  async submitTask(task: Task): Promise<string> {
    this.tasks.set(task.id, task);
    this.emit('task:submitted', task);

    // Find suitable agent based on task type
    const agent = this.findAgentForTask(task);
    
    if (!agent) {
      task.status = 'failed';
      task.error = 'No suitable agent found for task';
      this.emit('task:failed', task);
      return task.id;
    }

    // Process task asynchronously
    setImmediate(async () => {
      try {
        const result = await agent.processTask(task);
        this.tasks.set(task.id, result);
        this.emit('task:completed', result);
      } catch (error) {
        task.status = 'failed';
        task.error = error instanceof Error ? error.message : String(error);
        this.emit('task:failed', task);
      }
    });

    return task.id;
  }

  /**
   * Get task status
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get team configuration
   */
  getConfig(): TeamConfig {
    return this.config;
  }

  /**
   * Get all registered agents
   */
  getAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Send a message between agents
   */
  async sendMessage(message: Message): Promise<void> {
    await this.messageBus.send(message);
  }

  /**
   * Find the most suitable agent for a task
   */
  private findAgentForTask(task: Task): BaseAgent | null {
    // Simple strategy: find first agent with matching type
    for (const agent of this.agents.values()) {
      if (agent.isEnabled() && agent.getType() === task.type) {
        return agent;
      }
    }
    return null;
  }
}
