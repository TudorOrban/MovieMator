variable "repository_name" {
    description = "The name of the ECR repository"
    type = string
}

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