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

PROJECT_NAME="moviemator"
ENV="dev"

echo "Installing AWS CLI v2..."
sudo yum install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
cd /tmp
unzip awscliv2.zip
sudo ./aws/install --update
rm -rf awscliv2.zip aws/
cd - > /dev/null

echo "Retrieving environment variables from SSM Parameter Store for ${PROJECT_NAME}/${ENV}..."

DB_URL=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/rds_datasource_url" --with-decryption --query Parameter.Value --output text)
DB_USERNAME=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/rds_username" --with-decryption --query Parameter.Value --output text)
DB_PASSWORD=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/rds_password" --with-decryption --query Parameter.Value --output text)

ALLOWED_CORS_ORIGINS=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/ALLOWED_CORS_ORIGINS" --query Parameter.Value --output text)

if [ -z "$DB_URL" ] || [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$ALLOWED_CORS_ORIGINS" ]; then
    echo "Error: One or more critical environment variables could not be retrieved from SSM Parameter Store."
    exit 1
fi

echo "Running Docker container: $IMAGE_URI"
docker run -d --restart=always -p 8080:8080 --name moviemator-spring-boot-app \
    -e SPRING_PROFILES_ACTIVE="docker-prod" \
    -e SPRING_DATASOURCE_URL="$DB_URL" \
    -e SPRING_DATASOURCE_USERNAME="$DB_USERNAME" \
    -e SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD" \
    -e ALLOWED_CORS_ORIGINS="$ALLOWED_CORS_ORIGINS" \
    $IMAGE_URI

echo "Docker container started."