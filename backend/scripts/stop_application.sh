#!/bin/bash
# This script stops the currently running Docker container for the backend application.
# It's called by CodeDeploy in the BeforeInstall hook.

echo "Installing jq for JSON parsing..."
sudo yum install -y jq

echo "Stopping existing Docker container (if any)..."

CONTAINER_ID=$(docker ps -aq --filter "name=moviemator-spring-boot-app")

if [ -n "$CONTAINER_ID" ]; then
  echo "Found container ID: $CONTAINER_ID"
  docker stop $CONTAINER_ID
  docker rm $CONTAINER_ID
  echo "Container stopped and removed."
else
  echo "No existing moviemator-spring-boot-app container found."
fi