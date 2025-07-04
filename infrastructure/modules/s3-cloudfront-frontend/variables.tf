variable "project_name" {
    description = "The name of the project"
    type = string
}

variable "env" {
    description = "The environment name (e.g., 'dev', 'prod')"
    type = string
}

variable "region" {
    description = "AWS region for the S3 bucket"
    type = string
}

variable "alb_dns_name" {
    description = "The DNS name of the Application Load Balancer for API requests."
    type = string
}

variable "cloudfront_certificate_arn" {
    description = "The ARN of the ACM certificate for the CloudFront distribution (must be in us-east-1)."
    type = string
}

variable "domain_name" {
    description = "The custom domain name to associate with the CloudFront distribution."
    type = string
}