variable "env" {
  description = "The environment name (e.g., 'dev', 'prod')"
  type        = string
}

variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "region" {
  description = "AWS region for the deployment"
  type        = string
}

variable "codebuild_backend_role_arn" {
  description = "ARN of the IAM role for CodeBuild (backend)"
  type        = string
}

variable "codebuild_frontend_role_arn" {
  description = "ARN of the IAM role for CodeBuild (frontend)"
  type        = string
}

variable "ecr_repository_url" {
  description = "Full URI of the ECR repository for the backend Docker image"
  type        = string
}

variable "domain_name" {
  description = "Domain name of the Application Load Balancer"
  type        = string
}

variable "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  type        = string
}

variable "frontend_s3_bucket_name" {
  description = "Name of the S3 bucket hosting the frontend"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool."
  type        = string
}

variable "cognito_user_pool_client_id" {
  description = "The ID of the Cognito User Pool App Client."
  type        = string
}

variable "tmdb_api_key" {
  description = "The API key for TMDB's service"
  type        = string
}
