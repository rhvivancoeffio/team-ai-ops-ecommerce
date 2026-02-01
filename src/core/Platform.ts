import { TeamOrchestrator } from './TeamOrchestrator';
import { MessageBus } from './MessageBus';
import { CustomerSupportAgent } from '../agents/CustomerSupportAgent';
import { OrderManagementAgent } from '../agents/OrderManagementAgent';
import { LogisticsAgent } from '../agents/LogisticsAgent';
import { TeamConfig, Task, AgentConfig } from '../types';
import { EventEmitter } from 'events';

/**
 * Platform Manager - main entry point for the AI Teams platform
 */
export class Platform extends EventEmitter {
  private teams: Map<string, TeamOrchestrator> = new Map();
  private messageBus: MessageBus;

  constructor() {
    super();
    this.messageBus = new MessageBus();
  }

  /**
   * Create a new AI team
   */
  async createTeam(config: TeamConfig): Promise<TeamOrchestrator> {
    const team = new TeamOrchestrator(config, this.messageBus);

    // Register agents based on configuration
    for (const agentConfig of config.agents) {
      const agent = this.createAgent(agentConfig);
      team.registerAgent(agent);
    }

    this.teams.set(config.id, team);
    this.emit('team:created', { teamId: config.id });

    return team;
  }

  /**
   * Create a pre-configured ecommerce operations team
   */
  async createEcommerceTeam(teamId: string = 'ecommerce-ops'): Promise<TeamOrchestrator> {
    const config: TeamConfig = {
      id: teamId,
      name: 'E-commerce Operations Team',
      description: 'AI team for automating customer support, order management, and logistics',
      agents: [
        {
          id: `${teamId}-support`,
          name: 'Customer Support Agent',
          type: 'customer-support',
          capabilities: [
            { name: 'handle-support-ticket', description: 'Process customer support tickets' },
            { name: 'sentiment-analysis', description: 'Analyze customer sentiment' },
            { name: 'generate-response', description: 'Generate appropriate responses' }
          ],
          enabled: true
        },
        {
          id: `${teamId}-orders`,
          name: 'Order Management Agent',
          type: 'order-management',
          capabilities: [
            { name: 'process-order', description: 'Process new orders' },
            { name: 'validate-order', description: 'Validate order details' },
            { name: 'check-inventory', description: 'Check inventory availability' }
          ],
          enabled: true
        },
        {
          id: `${teamId}-logistics`,
          name: 'Logistics Agent',
          type: 'logistics',
          capabilities: [
            { name: 'coordinate-shipping', description: 'Coordinate shipping and delivery' },
            { name: 'optimize-route', description: 'Optimize delivery routes' },
            { name: 'track-shipment', description: 'Track shipment status' }
          ],
          enabled: true
        }
      ]
    };

    return this.createTeam(config);
  }

  /**
   * Get a team by ID
   */
  getTeam(teamId: string): TeamOrchestrator | undefined {
    return this.teams.get(teamId);
  }

  /**
   * Get all teams
   */
  getAllTeams(): TeamOrchestrator[] {
    return Array.from(this.teams.values());
  }

  /**
   * Remove a team
   */
  async removeTeam(teamId: string): Promise<void> {
    const team = this.teams.get(teamId);
    if (team) {
      await team.stop();
      this.teams.delete(teamId);
      this.emit('team:removed', { teamId });
    }
  }

  /**
   * Submit a task to a specific team
   */
  async submitTask(teamId: string, task: Task): Promise<string> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    return team.submitTask(task);
  }

  /**
   * Get message bus
   */
  getMessageBus(): MessageBus {
    return this.messageBus;
  }

  /**
   * Create an agent based on configuration
   */
  private createAgent(config: AgentConfig): any {
    switch (config.type) {
      case 'customer-support':
        return new CustomerSupportAgent(config);
      case 'order-management':
        return new OrderManagementAgent(config);
      case 'logistics':
        return new LogisticsAgent(config);
      default:
        throw new Error(`Unknown agent type: ${config.type}`);
    }
  }
}
