import { LogisticsAgent } from '../agents/LogisticsAgent';
import { AgentConfig, Task } from '../types';

describe('LogisticsAgent', () => {
  let agent: LogisticsAgent;
  let config: AgentConfig;

  beforeEach(() => {
    config = {
      id: 'logistics-1',
      name: 'Logistics Agent',
      type: 'logistics',
      capabilities: [],
      enabled: true
    };
    agent = new LogisticsAgent(config);
  });

  test('should coordinate shipping', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-1',
      type: 'logistics',
      status: 'pending',
      data: {
        orderId: 'ORDER-001',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        items: [
          { productId: 'PROD-001', quantity: 2 }
        ],
        priority: 'normal'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result.shipmentId).toBeDefined();
    expect(result.result.trackingNumber).toBeDefined();
    expect(result.result.carrier).toBeDefined();
  });

  test('should optimize route', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-2',
      type: 'optimize-route',
      status: 'pending',
      data: {
        origin: 'Warehouse-001',
        destination: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        priority: 'high'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result.routeId).toBeDefined();
    expect(result.result.optimizedRoute).toBeDefined();
    expect(result.result.distance).toBeGreaterThan(0);
  });

  test('should use faster delivery for urgent priority', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-3',
      type: 'optimize-route',
      status: 'pending',
      data: {
        origin: 'Warehouse-001',
        destination: {
          city: 'New York'
        },
        priority: 'urgent'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    const estimatedDelivery = new Date(result.result.estimatedDelivery);
    const today = new Date();
    const daysDiff = Math.ceil((estimatedDelivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    expect(daysDiff).toBeLessThanOrEqual(2);
  });
});
