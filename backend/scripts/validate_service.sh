#!/bin/bash
# This script validates the health of the newly deployed application.
# It's called by CodeDeploy in the ApplicationStart hook.

echo "Validating service health..."

HEALTH_CHECK_URL="http://localhost:8080/actuator/health" 

MAX_RETRIES=10
RETRY_DELAY=15 

for i in $(seq 1 $MAX_RETRIES); do
  echo "Attempt $i/$MAX_RETRIES: Checking health at $HEALTH_CHECK_URL..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)

  if [ "$HTTP_CODE" -eq 200 ]; then
    echo "Health check succeeded! HTTP Status: $HTTP_CODE"
    exit 0
  else
    echo "Health check failed. HTTP Status: $HTTP_CODE. Retrying in $RETRY_DELAY seconds..."
    sleep $RETRY_DELAY
  fi
done

echo "Health check failed after $MAX_RETRIES attempts. Deployment will roll back."
exit 1 

http://dev-moviemator-alb-1854803683.eu-central-1.…s/cognito-id/8438e418-b0c1-70b4-5931-1b579002e82e
dev-moviemator-alb-1854803683.eu-central-1.elb.amazonaws.com