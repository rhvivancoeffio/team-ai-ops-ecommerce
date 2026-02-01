#!/bin/bash

# Example: Submit a customer support ticket

API_URL="http://localhost:3000"
TEAM_ID="ecommerce-ops"

echo "Submitting customer support ticket..."

RESPONSE=$(curl -s -X POST "$API_URL/api/teams/$TEAM_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "customer-support",
    "data": {
      "ticketId": "TICKET-'$(date +%s)'",
      "customerId": "CUST-001",
      "message": "I need help with my recent order. The shipping is delayed.",
      "priority": "high"
    }
  }')

TASK_ID=$(echo $RESPONSE | grep -o '"taskId":"[^"]*"' | cut -d'"' -f4)

echo "Task submitted: $TASK_ID"
echo ""
echo "Waiting for processing..."
sleep 2

echo ""
echo "Task result:"
curl -s "$API_URL/api/teams/$TEAM_ID/tasks/$TASK_ID" | python3 -m json.tool
