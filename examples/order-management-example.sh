#!/bin/bash

# Example: Process an order

API_URL="http://localhost:3000"
TEAM_ID="ecommerce-ops"

echo "Processing order..."

RESPONSE=$(curl -s -X POST "$API_URL/api/teams/$TEAM_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "order-management",
    "data": {
      "orderId": "ORDER-'$(date +%s)'",
      "customerId": "CUST-123",
      "items": [
        {"productId": "PROD-001", "quantity": 1, "price": 99.99},
        {"productId": "PROD-002", "quantity": 2, "price": 49.99}
      ],
      "shippingAddress": {
        "street": "456 Oak Avenue",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94102"
      }
    }
  }')

TASK_ID=$(echo $RESPONSE | grep -o '"taskId":"[^"]*"' | cut -d'"' -f4)

echo "Order submitted: $TASK_ID"
echo ""
echo "Waiting for processing..."
sleep 2

echo ""
echo "Order result:"
curl -s "$API_URL/api/teams/$TEAM_ID/tasks/$TASK_ID" | python3 -m json.tool
