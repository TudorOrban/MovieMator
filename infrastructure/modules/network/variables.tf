variable "vpc_cidr" {
    description = "The CIDR block for the VPC"
    type = string
}

variable "public_subnet_cidrs" {
    description = "A list of CIDR blocks for the public subnets"
    type = list(string)
}

variable "private_subnet_cidrs" {
    description = "A list of CIDR blocks for the private subnets"
    type = list(string)
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