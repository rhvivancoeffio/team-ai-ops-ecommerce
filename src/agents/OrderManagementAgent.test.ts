import { OrderManagementAgent } from '../agents/OrderManagementAgent';
import { AgentConfig, Task } from '../types';

describe('OrderManagementAgent', () => {
  let agent: OrderManagementAgent;
  let config: AgentConfig;

  beforeEach(() => {
    config = {
      id: 'orders-1',
      name: 'Orders Agent',
      type: 'order-management',
      capabilities: [],
      enabled: true
    };
    agent = new OrderManagementAgent(config);
  });

  test('should process valid order', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-1',
      type: 'order-management',
      status: 'pending',
      data: {
        orderId: 'ORDER-001',
        customerId: 'CUST-001',
        items: [
          { productId: 'PROD-001', quantity: 2, price: 50 }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result.status).toBe('confirmed');
    expect(result.result.orderDetails.totalAmount).toBe(100);
  });

  test('should reject order with insufficient inventory', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-2',
      type: 'order-management',
      status: 'pending',
      data: {
        orderId: 'ORDER-002',
        customerId: 'CUST-002',
        items: [
          { productId: 'PROD-001', quantity: 200, price: 50 }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result.status).toBe('rejected');
    expect(result.result.reason).toContain('Insufficient inventory');
  });

  test('should check inventory status', async () => {
    await agent.start();

    const task: Task = {
      id: 'task-3',
      type: 'check-inventory',
      status: 'pending',
      data: {
        productIds: ['PROD-001', 'PROD-002']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await agent.processTask(task);

    expect(result.status).toBe('completed');
    expect(result.result['PROD-001'].available).toBeGreaterThan(0);
    expect(result.result['PROD-002'].available).toBeGreaterThan(0);
  });
});
