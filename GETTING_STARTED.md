# Getting Started with AI Teams Platform

This guide will help you get started with the AI Teams Platform for E-commerce Operations.

## Prerequisites

- Node.js 14+ installed
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/rhvivancoeffio/team-ai-ops-ecommerce.git
cd team-ai-ops-ecommerce
```

2. Install dependencies
```bash
npm install
```

3. Build the project
```bash
npm run build
```

## Quick Start

### Option 1: Run the Platform with API Server

```bash
npm start
```

This will:
- Create an e-commerce operations team
- Start an API server on port 3000
- Display all available endpoints

### Option 2: Run in Development Mode

```bash
npm run dev
```

### Option 3: Run the Complete Workflow Example

```bash
npx ts-node examples/complete-workflow.ts
```

This demonstrates all three agents working together in a complete e-commerce workflow.

## Using the API

### 1. Check Platform Health

```bash
curl http://localhost:3000/health
```

### 2. List All Teams

```bash
curl http://localhost:3000/api/teams
```

### 3. Create a New E-commerce Team

```bash
curl -X POST http://localhost:3000/api/teams/ecommerce \
  -H "Content-Type: application/json" \
  -d '{"teamId": "my-team"}'
```

### 4. Submit a Customer Support Task

```bash
curl -X POST http://localhost:3000/api/teams/ecommerce-ops/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "customer-support",
    "data": {
      "ticketId": "TICKET-001",
      "customerId": "CUST-001",
      "message": "I need help with my order",
      "priority": "high"
    }
  }'
```

### 5. Get Task Status

```bash
curl http://localhost:3000/api/teams/ecommerce-ops/tasks/TASK_ID
```

## Using Shell Scripts

We provide example shell scripts in the `examples/` directory:

```bash
# Run customer support example
./examples/customer-support-example.sh

# Run order management example
./examples/order-management-example.sh

# Run logistics example
./examples/logistics-example.sh
```

## Programmatic Usage

You can also use the platform programmatically in your Node.js/TypeScript projects:

```typescript
import { Platform, Task } from 'team-ai-ops-ecommerce';

async function example() {
  // Create platform
  const platform = new Platform();

  // Create and start a team
  const team = await platform.createEcommerceTeam('my-team');
  await team.start();

  // Submit a task
  const task: Task = {
    id: 'task-1',
    type: 'customer-support',
    status: 'pending',
    data: {
      ticketId: 'TICKET-001',
      customerId: 'CUST-001',
      message: 'Need assistance',
      priority: 'normal'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const taskId = await team.submitTask(task);

  // Wait and get result
  setTimeout(() => {
    const result = team.getTask(taskId);
    console.log(result);
  }, 1000);
}
```

## Understanding the Agents

### Customer Support Agent
Handles customer inquiries with:
- Sentiment analysis (positive, negative, neutral)
- Automatic categorization
- Response generation
- Escalation recommendations

### Order Management Agent
Processes orders with:
- Order validation
- Inventory checking
- Status tracking
- Automated processing

### Logistics Agent
Manages shipping with:
- Carrier selection
- Route optimization
- Shipment tracking
- Delivery coordination

## Testing

Run all tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## Next Steps

1. Review the [README.md](../README.md) for detailed documentation
2. Explore the code in `src/` directory
3. Try modifying agent behaviors for your specific needs
4. Create custom teams with different agent configurations

## Support

For issues or questions, please open an issue on GitHub.
