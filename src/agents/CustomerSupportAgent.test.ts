import { CustomerSupportAgent } from '../agents/CustomerSupportAgent';
import { AgentConfig, Task } from '../types';

describe('CustomerSupportAgent', () => {
  let agent: CustomerSupportAgent;
  let config: AgentConfig;

  beforeEach(() => {
    config = {
      id: 'support-1',
      name: 'Support Agent',
      type: 'customer-support',
      capabilities: [],
      enabled: true
    };
    agent = new CustomerSupportAgent(config);
  });

  test('should handle support ticket with positive sentiment', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-1',
      type: 'customer-support',
      status: 'pending',
      data: {
        ticketId: 'TICKET-001',
        customerId: 'CUST-001',
        message: 'I love your product! It is amazing and works great!',
        priority: 'normal'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result.sentiment).toBe('positive');
    expect(result.result.escalate).toBe(false);
  });

  test('should handle support ticket with negative sentiment', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-2',
      type: 'customer-support',
      status: 'pending',
      data: {
        ticketId: 'TICKET-002',
        customerId: 'CUST-002',
        message: 'This is terrible! I hate this awful product and it is horrible and disappointing!',
        priority: 'normal'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result.sentiment).toBe('negative');
    expect(result.result.escalate).toBe(true);
  });

  test('should categorize tickets correctly', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-3',
      type: 'customer-support',
      status: 'pending',
      data: {
        ticketId: 'TICKET-003',
        customerId: 'CUST-003',
        message: 'I need a refund for my recent purchase',
        priority: 'normal'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result.category).toBe('refund-return');
  });
});
