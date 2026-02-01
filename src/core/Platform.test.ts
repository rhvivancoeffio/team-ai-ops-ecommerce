import { Platform } from '../core/Platform';
import { Task } from '../types';

describe('Platform Integration', () => {
  let platform: Platform;

  beforeEach(() => {
    platform = new Platform();
  });

  test('should create ecommerce team', async () => {
    const team = await platform.createEcommerceTeam('test-team');
    
    expect(team).toBeDefined();
    expect(team.getConfig().id).toBe('test-team');
    expect(team.getAgents().length).toBe(3);
  });

  test('should process customer support task', async () => {
    const team = await platform.createEcommerceTeam('test-team');
    await team.start();

    const task: Task = {
      id: 'task-1',
      type: 'customer-support',
      status: 'pending',
      data: {
        ticketId: 'TICKET-001',
        customerId: 'CUST-001',
        message: 'I love this product!',
        priority: 'normal'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const taskId = await team.submitTask(task);
    
    expect(taskId).toBe('task-1');

    // Wait for task to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const completedTask = team.getTask(taskId);
    expect(completedTask?.status).toBe('completed');
  });

  test('should process order management task', async () => {
    const team = await platform.createEcommerceTeam('test-team');
    await team.start();

    const task: Task = {
      id: 'task-2',
      type: 'order-management',
      status: 'pending',
      data: {
        orderId: 'ORDER-001',
        customerId: 'CUST-001',
        items: [
          { productId: 'PROD-001', quantity: 1, price: 50 }
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

    const taskId = await team.submitTask(task);
    
    expect(taskId).toBe('task-2');

    // Wait for task to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const completedTask = team.getTask(taskId);
    expect(completedTask?.status).toBe('completed');
  });

  test('should process logistics task', async () => {
    const team = await platform.createEcommerceTeam('test-team');
    await team.start();

    const task: Task = {
      id: 'task-3',
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
          { productId: 'PROD-001', quantity: 1 }
        ],
        priority: 'normal'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const taskId = await team.submitTask(task);
    
    expect(taskId).toBe('task-3');

    // Wait for task to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const completedTask = team.getTask(taskId);
    expect(completedTask?.status).toBe('completed');
  });
});
