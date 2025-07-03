variable "region" {
    description = "AWS region for the deployment"
    type = string
    default = "eu-central-1"
}

variable "env" {
    description = "Environment name (e.g., dev, prod)"
    type = string
    default = "dev"
}

variable "project_name" {
    description = "Name of the project"
    type = string
    default = "moviemator"
}

variable "vpc_cidr" {
    description = "CIDR block for the VPC"
    type = string
    default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
    description = "List of CIDR blocks for public subnets"
    type = list(string)
    default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
    description = "List of CIDR blocks for private subnets"
    type = list(string)
    default = ["10.0.101.0/24", "10.0.102.0/24"]
}