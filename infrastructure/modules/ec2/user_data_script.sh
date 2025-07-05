#!/bin/bash
sudo yum update -y

# Install Docker
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo systemctl enable docker

# Install AWS CLI v2
sudo yum install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
cd /tmp
unzip awscliv2.zip
sudo ./aws/install --update
rm -rf awscliv2.zip aws/
cd - > /dev/null

# Install CodeDeploy agent
echo "Installing CodeDeploy agent..."
sudo yum install -y ruby
cd /home/ec2-user
wget https://aws-codedeploy-${var.region}.s3.${var.region}.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent start
sudo systemctl enable codedeploy-agent
echo "CodeDeploy agent installed and started."

# Install jq
sudo yum install -y jq

# Pull Docker image
aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin $(echo ${ecr_repository_url} | cut -d/ -f1)

ECR_REPO_URI="${ecr_repository_url}"

docker pull $ECR_REPO_URI:latest

# Get params from SSM
DB_DATASOURCE_URL=$(aws ssm get-parameter --name "${rds_datasource_url_ssm_param_name}" --query Parameter.Value --output text --with-decryption)
DB_USERNAME=$(aws ssm get-parameter --name "${rds_username_ssm_param_name}" --query Parameter.Value --output text --with-decryption)
DB_PASSWORD=$(aws ssm get-parameter --name "${rds_password_ssm_param_name}" --with-decryption --query Parameter.Value --output text)

ALLOWED_CORS_ORIGINS=$(aws ssm get-parameter --name "${allowed_cors_origins_ssm_param_name}" --query Parameter.Value --output text)
COGNITO_ISSUER_URI=$(aws ssm get-parameter --name "${cognito_issuer_uri_ssm_param_name}" --query Parameter.Value --output text)

ALB_DNS_NAME="${alb_dns_name}"
FRONTEND_CLOUDFRONT_DOMAIN_NAME="${frontend_cloudfront_domain_name}"

SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI=$(aws ssm get-parameter --name "${cognito_jwk_set_uri_ssm_param_name}" --query "Parameter.Value" --output text)
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_PRINCIPAL_CLAIM_NAME=$(aws ssm get-parameter --name "${cognito_principal_claim_name_ssm_param_name}" --query "Parameter.Value" --output text)
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_CLAIM_NAME=$(aws ssm get-parameter --name "${cognito_authorities_claim_name_ssm_param_name}" --query "Parameter.Value" --output text)
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_PREFIX=$(aws ssm get-parameter --name "${cognito_authorities_prefix_ssm_param_name}" --query "Parameter.Value" --output text)

# Run
docker run -d --restart=always -p 8080:8080 --name moviemator-spring-boot-app \
    -e SPRING_DATASOURCE_URL="$DB_DATASOURCE_URL" \
    -e SPRING_DATASOURCE_USERNAME="$DB_USERNAME" \
    -e SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD" \
    -e SPRING_PROFILES_ACTIVE="docker-prod" \
    -e BACKEND_API_URL="http://$ALB_DNS_NAME/api/v1" \
    -e FRONTEND_API_URL="https://$FRONTEND_CLOUDFRONT_DOMAIN_NAME" \
    -e ALLOWED_CORS_ORIGINS="$ALLOWED_CORS_ORIGINS" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI="$COGNITO_ISSUER_URI" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI="$SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_PRINCIPAL_CLAIM_NAME="$SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_PRINCIPAL_CLAIM_NAME" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_CLAIM_NAME="$SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_CLAIM_NAME" \
    -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_PREFIX="$SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWT_AUTHENTICATION_CONVERTER_AUTHORITIES_PREFIX" \
    $ECR_REPO_URI:latest