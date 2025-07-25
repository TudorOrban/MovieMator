variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "A list of IDs of the public subnets"
  type        = list(string)
}

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

variable "alb_certificate_arn" {
  description = "The ARN of the load Balancer certificate"
  type        = string
}
