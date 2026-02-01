/**
 * Complete workflow example demonstrating all three AI agents working together
 */
import { Platform, Task } from '../src';

async function completeWorkflowExample() {
  console.log('🚀 Starting Complete E-commerce Workflow Example\n');

  // 1. Create platform and team
  const platform = new Platform();
  const team = await platform.createEcommerceTeam('demo-team');
  await team.start();

  console.log('✅ Team created with agents:');
  team.getAgents().forEach((agent) => {
    console.log(`   - ${agent.getName()}`);
  });
  console.log('');

  // 2. Process an order
  console.log('📦 Step 1: Processing new order...');
  const orderTask: Task = {
    id: `order-${Date.now()}`,
    type: 'order-management',
    status: 'pending',
    data: {
      orderId: `ORDER-${Date.now()}`,
      customerId: 'CUST-DEMO-001',
      items: [
        { productId: 'PROD-001', quantity: 2, price: 99.99 },
        { productId: 'PROD-002', quantity: 1, price: 149.99 }
      ],
      shippingAddress: {
        street: '123 Demo Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102'
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await team.submitTask(orderTask);
  await sleep(500); // Wait for processing

  const orderResult = team.getTask(orderTask.id);
  if (orderResult?.status === 'completed') {
    console.log('✅ Order processed successfully!');
    console.log(`   Order ID: ${orderResult.result.orderId}`);
    console.log(`   Status: ${orderResult.result.status}`);
    console.log(`   Total: $${orderResult.result.orderDetails.totalAmount}`);
    console.log('');
  }

  // 3. Coordinate shipping
  console.log('🚚 Step 2: Coordinating shipping...');
  const shippingTask: Task = {
    id: `shipping-${Date.now()}`,
    type: 'logistics',
    status: 'pending',
    data: {
      orderId: orderResult?.result.orderId,
      shippingAddress: orderTask.data.shippingAddress,
      items: orderTask.data.items,
      priority: 'high'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await team.submitTask(shippingTask);
  await sleep(500); // Wait for processing

  const shippingResult = team.getTask(shippingTask.id);
  if (shippingResult?.status === 'completed') {
    console.log('✅ Shipping coordinated successfully!');
    console.log(`   Shipment ID: ${shippingResult.result.shipmentId}`);
    console.log(`   Tracking Number: ${shippingResult.result.trackingNumber}`);
    console.log(`   Carrier: ${shippingResult.result.carrier}`);
    console.log(`   Est. Delivery: ${new Date(shippingResult.result.estimatedDelivery).toLocaleDateString()}`);
    console.log('');
  }

  // 4. Handle customer inquiry
  console.log('💬 Step 3: Handling customer inquiry...');
  const supportTask: Task = {
    id: `support-${Date.now()}`,
    type: 'customer-support',
    status: 'pending',
    data: {
      ticketId: `TICKET-${Date.now()}`,
      customerId: 'CUST-DEMO-001',
      message: 'When will my order arrive? I am excited to receive it!',
      priority: 'normal'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await team.submitTask(supportTask);
  await sleep(500); // Wait for processing

  const supportResult = team.getTask(supportTask.id);
  if (supportResult?.status === 'completed') {
    console.log('✅ Customer inquiry handled!');
    console.log(`   Sentiment: ${supportResult.result.sentiment}`);
    console.log(`   Confidence: ${(supportResult.result.confidence * 100).toFixed(0)}%`);
    console.log(`   Category: ${supportResult.result.category}`);
    console.log(`   Escalate: ${supportResult.result.escalate ? 'Yes' : 'No'}`);
    console.log('   Suggested Response:');
    console.log(`   "${supportResult.result.suggestedResponse}"`);
    console.log('');
  }

  // Summary
  console.log('✨ Workflow Complete!\n');
  console.log('Summary:');
  console.log(`   - Order processed and confirmed`);
  console.log(`   - Shipping coordinated with tracking`);
  console.log(`   - Customer inquiry automatically handled`);
  console.log('');
  console.log('All three AI agents worked together seamlessly! 🎉');

  // Cleanup
  await team.stop();
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the example
if (require.main === module) {
  completeWorkflowExample()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export default completeWorkflowExample;
