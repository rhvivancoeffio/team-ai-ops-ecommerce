#!/bin/bash

# Example: Coordinate shipping

API_URL="http://localhost:3000"
TEAM_ID="ecommerce-ops"

echo "Coordinating shipping..."

RESPONSE=$(curl -s -X POST "$API_URL/api/teams/$TEAM_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "logistics",
    "data": {
      "orderId": "ORDER-'$(date +%s)'",
      "shippingAddress": {
        "street": "789 Pine Street",
        "city": "Seattle",
        "state": "WA",
        "zipCode": "98101"
      },
      "items": [
        {"productId": "PROD-003", "quantity": 3}
      ],
      "priority": "normal"
    }
  }')

TASK_ID=$(echo $RESPONSE | grep -o '"taskId":"[^"]*"' | cut -d'"' -f4)

echo "Shipping task submitted: $TASK_ID"
echo ""
echo "Waiting for processing..."
sleep 2

echo ""
echo "Shipping details:"
curl -s "$API_URL/api/teams/$TEAM_ID/tasks/$TASK_ID" | python3 -m json.tool
