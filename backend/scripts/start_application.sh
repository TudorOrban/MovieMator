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

ECR_REGISTRY_URI=$(echo "$IMAGE_URI" | cut -d'/' -f1)

echo "Logging in to ECR registry: $ECR_REGISTRY_URI..."
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin "$ECR_REGISTRY_URI"
echo "ECR login successful."

echo "Removing local Docker image to force fresh pull: $IMAGE_URI"
docker rmi "$IMAGE_URI" || true

echo "Pulling Docker image: $IMAGE_URI"
docker pull $IMAGE_URI

echo "Retrieving PROJECT_NAME and ENV from EC2 instance tags..."

PROJECT_NAME=$(aws ec2 describe-tags \
  --filters "Name=resource-id,Values=$INSTANCE_ID" "Name=key,Values=Project" \
  --region "$AWS_REGION" \
  --query 'Tags[0].Value' --output text)

ENV=$(aws ec2 describe-tags \
  --filters "Name=resource-id,Values=$INSTANCE_ID" "Name=key,Values=Environment" \
  --region "$AWS_REGION" \
  --query 'Tags[0].Value' --output text)

echo "Retrieving environment variables from SSM Parameter Store for ${PROJECT_NAME}/${ENV}..."

DB_URL=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/rds_datasource_url" --with-decryption --query Parameter.Value --output text)
DB_USERNAME=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/rds_username" --with-decryption --query Parameter.Value --output text)
DB_PASSWORD=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/rds_password" --with-decryption --query Parameter.Value --output text)

ALLOWED_CORS_ORIGINS=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/ALLOWED_CORS_ORIGINS" --query Parameter.Value --output text)

COGNITO_ISSUER_URI=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/spring/security/oauth2/resourceserver/jwt/issuer-uri" --query "Parameter.Value" --output text)
COGNITO_JWK_SET_URI=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/spring/security/oauth2/resourceserver/jwt/jwk-set-uri" --query "Parameter.Value" --output text)
COGNITO_PRINCIPAL_CLAIM_NAME=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/spring/security/oauth2/resourceserver/jwt/jwt-authentication-converter/principal-claim-name" --query "Parameter.Value" --output text)
COGNITO_AUTHORITIES_CLAIM_NAME=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/spring/security/oauth2/resourceserver/jwt/jwt-authentication-converter/authorities-claim-name" --query "Parameter.Value" --output text)
COGNITO_AUTHORITIES_PREFIX=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENV}/spring/security/oauth2/resourceserver/jwt/jwt-authentication-converter/authorities-prefix" --query "Parameter.Value" --output text)

if [ -z "$DB_URL" ] || [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$ALLOWED_CORS_ORIGINS" ] ||
   [ -z "$COGNITO_PRINCIPAL_CLAIM_NAME" ] || [ -z "$COGNITO_AUTHORITIES_CLAIM_NAME" ] || [ -z "$COGNITO_AUTHORITIES_PREFIX" ]; then
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
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI="${COGNITO_ISSUER_URI}" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI="${COGNITO_JWK_SET_URI}" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_PRINCIPAL_CLAIM_NAME="${COGNITO_PRINCIPAL_CLAIM_NAME}" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_CLAIM_NAME="${COGNITO_AUTHORITIES_CLAIM_NAME}" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_PREFIX="${COGNITO_AUTHORITIES_PREFIX}" \
    $IMAGE_URI

echo "Docker container started."