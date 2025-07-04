#!/bin/bash
# This script starts the new Docker container for the backend application.
# It's called by CodeDeploy in the AfterInstall hook.

echo "Starting new Docker container..."

IMAGE_DEFINITION_FILE="/tmp/codedeploy-artifacts/imageDefinitions.json"

if [ ! -f "$IMAGE_DEFINITION_FILE" ]; then
  echo "Error: imageDefinitions.json not found at $IMAGE_DEFINITION_FILE"
  exit 1
fi

IMAGE_URI=$(jq -r '.[0].imageUri' $IMAGE_DEFINITION_FILE)

if [ -z "$IMAGE_URI" ]; then
  echo "Error: Could not extract imageUri from $IMAGE_DEFINITION_FILE"
  exit 1
fi

echo "Pulling Docker image: $IMAGE_URI"
docker pull $IMAGE_URI

echo "Running Docker container: $IMAGE_URI"
docker run -d --restart=always -p 8080:8080 --name moviemator-spring-boot-app \
    -e SPRING_PROFILES_ACTIVE="docker-prod" \
    $IMAGE_URI

echo "Docker container started."