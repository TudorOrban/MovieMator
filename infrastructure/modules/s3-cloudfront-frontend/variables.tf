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
    description = "The DNS name of the ALB for backend API calls"
    type = string
}

/*
variable "custom_domain_name" {
    description = "Custom domain name for the CloudFront distribution"
    type = string
    default = null
}
*/
