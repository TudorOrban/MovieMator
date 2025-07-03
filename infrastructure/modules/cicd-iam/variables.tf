variable "env" {
    description = "The environment name (e.g., 'dev', 'prod')"
    type = string
}

variable "project_name" {
    description = "The name of the project"
    type = string
}

variable "region" {
    description = "AWS region for the deployment"
    type = string
}

variable "ecr_repository_arn" {
    description = "ARN of the ECR repository for the backend Docker image"
    type = string
}

variable "frontend_s3_bucket_arn" {
    description = "ARN of the S3 bucket hosting the frontend"
    type = string
}

variable "cloudfront_distribution_arn" {
    description = "ARN of the CloudFront distribution for the frontend"
    type = string
}

variable "github_token_secret_arn" {
    description = "ARN of the Secrets Manager secret storing the GitHub personal access token"
    type = string
    default = ""
}