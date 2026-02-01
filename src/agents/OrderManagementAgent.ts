import { BaseAgent } from '../core/BaseAgent';
import { Task, AgentConfig } from '../types';

/**
 * Order Management Agent - handles order processing and validation
 */
export class OrderManagementAgent extends BaseAgent {
  private orders: Map<string, any> = new Map();
  private inventory: Map<string, number> = new Map();

  constructor(config: AgentConfig) {
    super(config);
    // Initialize with some sample inventory
    this.initializeInventory();
  }

  protected async executeTask(task: Task): Promise<any> {
    const { type, data } = task;

    switch (type) {
      case 'order-management':
        return await this.processOrder(data);
      case 'validate-order':
        return await this.validateOrder(data);
      case 'update-order-status':
        return await this.updateOrderStatus(data);
      case 'check-inventory':
        return await this.checkInventory(data);
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  /**
   * Process a new order
   */
  private async processOrder(data: any): Promise<any> {
    const { orderId, customerId, items, shippingAddress } = data;

    // Validate order
    const validation = await this.validateOrder(data);
    if (!validation.valid) {
      return {
        orderId,
        status: 'rejected',
        reason: validation.reason,
        timestamp: new Date()
      };
    }

    // Reserve inventory
    for (const item of items) {
      const currentStock = this.inventory.get(item.productId) || 0;
      this.inventory.set(item.productId, currentStock - item.quantity);
    }

    // Create order record
    const order = {
      orderId,
      customerId,
      items,
      shippingAddress,
      status: 'confirmed',
      totalAmount: this.calculateTotal(items),
      createdAt: new Date(),
      estimatedDelivery: this.calculateEstimatedDelivery()
    };

    this.orders.set(orderId, order);

    return {
      orderId,
      status: 'confirmed',
      orderDetails: order,
      timestamp: new Date()
    };
  }

  /**
   * Validate an order
   */
  private async validateOrder(data: any): Promise<any> {
    const { items, shippingAddress } = data;

    // Validate items exist and are in stock
    for (const item of items) {
      const stock = this.inventory.get(item.productId) || 0;
      if (stock < item.quantity) {
        return {
          valid: false,
          reason: `Insufficient inventory for product ${item.productId}. Available: ${stock}, Requested: ${item.quantity}`
        };
      }
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
      return {
        valid: false,
        reason: 'Invalid shipping address'
      };
    }

    // Validate order total
    const total = this.calculateTotal(items);
    if (total <= 0) {
      return {
        valid: false,
        reason: 'Invalid order total'
      };
    }

    return {
      valid: true,
      inventoryAvailable: true,
      estimatedTotal: total
    };
  }

  /**
   * Update order status
   */
  private async updateOrderStatus(data: any): Promise<any> {
    const { orderId, status } = data;

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.status = status;
    order.updatedAt = new Date();

    this.orders.set(orderId, order);

    return {
      orderId,
      status,
      updatedAt: order.updatedAt
    };
  }

  /**
   * Check inventory for products
   */
  private async checkInventory(data: any): Promise<any> {
    const { productIds } = data;

    const inventoryStatus: any = {};
    for (const productId of productIds) {
      inventoryStatus[productId] = {
        available: this.inventory.get(productId) || 0,
        inStock: (this.inventory.get(productId) || 0) > 0
      };
    }

    return inventoryStatus;
  }

  /**
   * Calculate order total
   */
  private calculateTotal(items: any[]): number {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  /**
   * Calculate estimated delivery date
   */
  private calculateEstimatedDelivery(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
    return deliveryDate;
  }

  /**
   * Initialize sample inventory
   */
  private initializeInventory(): void {
    this.inventory.set('PROD-001', 100);
    this.inventory.set('PROD-002', 50);
    this.inventory.set('PROD-003', 75);
    this.inventory.set('PROD-004', 200);
    this.inventory.set('PROD-005', 30);
  }

  /**
   * Get all orders
   */
  getAllOrders(): any[] {
    return Array.from(this.orders.values());
  }

  /**
   * Get inventory status
   */
  getInventoryStatus(): Map<string, number> {
    return new Map(this.inventory);
  }
}
