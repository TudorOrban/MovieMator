variable "project_name" {
    description = "The name of the project, used for resource naming."
    type = string
}

variable "env" {
    description = "The deployment environment (e.g., 'dev', 'prod')."
    type = string
}

variable "region" {
    description = "The AWS region where resources will be deployed."
    type = string
}

variable "domain_name" {
    description = "The root domain name for the application."
    type = string
}

variable "frontend_cloudfront_domain_name" {
    description = "The domain name of the CloudFront distribution for the frontend."
    type = string
}