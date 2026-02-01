# AI Teams Platform for E-commerce Operations

A powerful platform to create and run AI teams that automate daily operational processes such as customer support, order management, and logistics.

## Features

### 🤖 AI-Powered Agents
- **Customer Support Agent**: Handles support tickets, analyzes sentiment, and generates appropriate responses
- **Order Management Agent**: Processes orders, validates inventory, and manages order lifecycle
- **Logistics Agent**: Coordinates shipping, optimizes delivery routes, and tracks shipments

### 🎯 Core Capabilities
- Multi-agent orchestration and coordination
- Inter-agent communication via message bus
- Task routing and processing
- Event-driven architecture
- RESTful API interface
- TypeScript for type safety

## Installation

```bash
npm install
```

## Quick Start

### 1. Build the project
```bash
npm run build
```

### 2. Run the platform
```bash
npm start
```

The platform will:
- Create an e-commerce operations team with 3 AI agents
- Start an API server on port 3000
- Display available endpoints

### 3. Development mode
```bash
npm run dev
```

## API Usage

### Create an E-commerce Team

```bash
curl -X POST http://localhost:3000/api/teams/ecommerce \
  -H "Content-Type: application/json" \
  -d '{"teamId": "my-ecommerce-team"}'
```

### Submit a Customer Support Task

```bash
curl -X POST http://localhost:3000/api/teams/my-ecommerce-team/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "customer-support",
    "data": {
      "ticketId": "TICKET-001",
      "customerId": "CUST-001",
      "message": "I love your product! It works great!",
      "priority": "normal"
    }
  }'
```

### Submit an Order Management Task

```bash
curl -X POST http://localhost:3000/api/teams/my-ecommerce-team/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "order-management",
    "data": {
      "orderId": "ORDER-001",
      "customerId": "CUST-001",
      "items": [
        {"productId": "PROD-001", "quantity": 2, "price": 50}
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
      }
    }
  }'
```

### Submit a Logistics Task

```bash
curl -X POST http://localhost:3000/api/teams/my-ecommerce-team/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "logistics",
    "data": {
      "orderId": "ORDER-001",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
      },
      "items": [
        {"productId": "PROD-001", "quantity": 2}
      ],
      "priority": "normal"
    }
  }'
```

### Get Task Status

```bash
curl http://localhost:3000/api/teams/my-ecommerce-team/tasks/TASK_ID
```

## Programmatic Usage

```typescript
import { Platform } from './src';

async function example() {
  // Create platform
  const platform = new Platform();

  // Create e-commerce team
  const team = await platform.createEcommerceTeam('my-team');
  await team.start();

  // Submit a task
  const task = {
    id: 'task-1',
    type: 'customer-support',
    status: 'pending',
    data: {
      ticketId: 'TICKET-001',
      customerId: 'CUST-001',
      message: 'Need help with my order',
      priority: 'high'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const taskId = await team.submitTask(task);

  // Wait for completion and get result
  setTimeout(() => {
    const result = team.getTask(taskId);
    console.log(result);
  }, 1000);
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/teams` | Create a custom team |
| POST | `/api/teams/ecommerce` | Create an e-commerce team |
| GET | `/api/teams` | List all teams |
| GET | `/api/teams/:teamId` | Get team details |
| POST | `/api/teams/:teamId/tasks` | Submit a task |
| GET | `/api/teams/:teamId/tasks/:taskId` | Get task status |
| GET | `/api/teams/:teamId/tasks` | List all tasks |

## Architecture

```
┌─────────────────────────────────────────────┐
│           Platform Manager                   │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼──────┐
│  Team          │    │  Message       │
│  Orchestrator  │◄───┤  Bus           │
└───────┬────────┘    └────────────────┘
        │
    ┌───┴────┬────────┬──────────┐
    │        │        │          │
┌───▼───┐ ┌─▼───┐ ┌──▼─────┐   │
│Support│ │Order│ │Logistics│   │
│Agent  │ │Agent│ │Agent    │   │
└───────┘ └─────┘ └─────────┘   │
```

## Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode:
```bash
npm run test:watch
```

## Agent Capabilities

### Customer Support Agent
- Sentiment analysis (positive, negative, neutral)
- Automatic ticket categorization
- Response generation based on sentiment
- Escalation recommendations
- Multi-category support (refund, shipping, product quality, etc.)

### Order Management Agent
- Order validation
- Inventory checking
- Order status tracking
- Automated order processing
- Stock management

### Logistics Agent
- Shipment coordination
- Route optimization
- Carrier selection
- Delivery tracking
- Real-time status updates

## Configuration

Teams can be customized with different agent configurations:

```typescript
const customTeamConfig = {
  id: 'custom-team',
  name: 'Custom Operations Team',
  description: 'My custom team configuration',
  agents: [
    {
      id: 'agent-1',
      name: 'Support Agent',
      type: 'customer-support',
      capabilities: [...],
      enabled: true,
      settings: {
        // custom settings
      }
    }
  ]
};

const team = await platform.createTeam(customTeamConfig);
```

## License

ISC
