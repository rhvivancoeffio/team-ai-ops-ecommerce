import { BaseAgent } from '../core/BaseAgent';
import { Task, AgentConfig } from '../types';

/**
 * Logistics Agent - handles shipping coordination and delivery tracking
 */
export class LogisticsAgent extends BaseAgent {
  private shipments: Map<string, any> = new Map();
  private routes: Map<string, any> = new Map();

  constructor(config: AgentConfig) {
    super(config);
  }

  protected async executeTask(task: Task): Promise<any> {
    const { type, data } = task;

    switch (type) {
      case 'logistics':
        return await this.coordinateShipping(data);
      case 'optimize-route':
        return await this.optimizeRoute(data);
      case 'track-shipment':
        return await this.trackShipment(data);
      case 'update-delivery':
        return await this.updateDelivery(data);
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  /**
   * Coordinate shipping for an order
   */
  private async coordinateShipping(data: any): Promise<any> {
    const { orderId, shippingAddress, items, priority } = data;

    // Select carrier based on priority and destination
    const carrier = this.selectCarrier(shippingAddress, priority);

    // Optimize route
    const route = await this.optimizeRoute({
      origin: 'Warehouse-001',
      destination: shippingAddress,
      priority
    });

    // Create shipment
    const shipmentId = `SHIP-${Date.now()}`;
    const shipment = {
      shipmentId,
      orderId,
      carrier: carrier.name,
      trackingNumber: this.generateTrackingNumber(),
      origin: 'Warehouse-001',
      destination: shippingAddress,
      status: 'pending',
      items,
      route: route.optimizedRoute,
      estimatedDelivery: route.estimatedDelivery,
      createdAt: new Date()
    };

    this.shipments.set(shipmentId, shipment);

    return {
      shipmentId,
      trackingNumber: shipment.trackingNumber,
      carrier: carrier.name,
      estimatedDelivery: route.estimatedDelivery,
      status: 'pending'
    };
  }

  /**
   * Optimize delivery route
   */
  private async optimizeRoute(data: any): Promise<any> {
    const { origin, destination, priority } = data;

    // Simple route optimization (in production, use real routing API)
    const distance = this.calculateDistance(origin, destination);
    const routeId = `ROUTE-${Date.now()}`;

    const route = {
      routeId,
      origin,
      destination,
      distance,
      stops: this.generateStops(origin, destination),
      priority
    };

    // Calculate estimated delivery based on distance and priority
    const deliveryDate = new Date();
    const daysToAdd = priority === 'urgent' ? 1 : priority === 'high' ? 2 : 5;
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

    this.routes.set(routeId, route);

    return {
      routeId,
      optimizedRoute: route.stops,
      distance,
      estimatedDelivery: deliveryDate,
      priority
    };
  }

  /**
   * Track a shipment
   */
  private async trackShipment(data: any): Promise<any> {
    const { shipmentId, trackingNumber } = data;

    let shipment;
    if (shipmentId) {
      shipment = this.shipments.get(shipmentId);
    } else if (trackingNumber) {
      // Find by tracking number
      shipment = Array.from(this.shipments.values()).find(
        s => s.trackingNumber === trackingNumber
      );
    }

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    return {
      shipmentId: shipment.shipmentId,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      currentLocation: this.getCurrentLocation(shipment),
      estimatedDelivery: shipment.estimatedDelivery,
      history: this.getShipmentHistory(shipment)
    };
  }

  /**
   * Update delivery status
   */
  private async updateDelivery(data: any): Promise<any> {
    const { shipmentId, status, location } = data;

    const shipment = this.shipments.get(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found`);
    }

    shipment.status = status;
    shipment.currentLocation = location;
    shipment.updatedAt = new Date();

    this.shipments.set(shipmentId, shipment);

    return {
      shipmentId,
      status,
      location,
      updatedAt: shipment.updatedAt
    };
  }

  /**
   * Select appropriate carrier
   */
  private selectCarrier(destination: any, priority?: string): any {
    const carriers = [
      { name: 'FastShip Express', speed: 'fast', cost: 'high' },
      { name: 'Standard Delivery', speed: 'medium', cost: 'medium' },
      { name: 'Economy Shipping', speed: 'slow', cost: 'low' }
    ];

    if (priority === 'urgent' || priority === 'high') {
      return carriers[0];
    } else if (priority === 'low') {
      return carriers[2];
    }

    return carriers[1];
  }

  /**
   * Calculate distance (simplified)
   */
  private calculateDistance(origin: string, destination: any): number {
    // Simplified distance calculation
    return Math.floor(Math.random() * 500) + 50; // 50-550 km
  }

  /**
   * Generate tracking number
   */
  private generateTrackingNumber(): string {
    const prefix = 'TRK';
    const random = Math.random().toString(36).substring(2, 15).toUpperCase();
    return `${prefix}-${random}`;
  }

  /**
   * Generate route stops
   */
  private generateStops(origin: string, destination: any): any[] {
    return [
      { location: origin, type: 'origin', timestamp: new Date() },
      { location: 'Distribution Center', type: 'waypoint', timestamp: new Date() },
      { location: destination.city, type: 'destination', timestamp: new Date() }
    ];
  }

  /**
   * Get current location of shipment
   */
  private getCurrentLocation(shipment: any): string {
    if (shipment.status === 'pending') {
      return shipment.origin;
    } else if (shipment.status === 'delivered') {
      return shipment.destination.city;
    }
    return 'In transit';
  }

  /**
   * Get shipment history
   */
  private getShipmentHistory(shipment: any): any[] {
    return [
      {
        status: 'created',
        location: shipment.origin,
        timestamp: shipment.createdAt
      },
      {
        status: shipment.status,
        location: this.getCurrentLocation(shipment),
        timestamp: new Date()
      }
    ];
  }

  /**
   * Get all shipments
   */
  getAllShipments(): any[] {
    return Array.from(this.shipments.values());
  }
}
