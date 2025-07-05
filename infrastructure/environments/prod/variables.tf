variable "region" {
  description = "AWS region for the deployment"
  type        = string
  default     = "eu-central-1"
}

variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "moviemator"
}

# Network
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "List of CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "List of CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

# RDS
variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "moviemator_db"
}

variable "db_username" {
  description = "The master username for the database"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "The master password for the database"
  type        = string
  sensitive   = true
}

variable "rds_port" {
  description = "The port of the RDS instance"
  type        = number
  default     = 5432
}

variable "db_instance_class" {
  description = "The instance type for the RDS database"
  type        = string
  default     = "db.t3.small"
}

variable "db_allocated_storage" {
  description = "The allocated storage in GB for the database"
  type        = number
  default     = 30
}

variable "db_skip_final_snapshot" {
  description = "Whether to skip the final snapshot when deleting the DB instance"
  type        = bool
  default     = false
}

variable "db_multi_az" {
  description = "Specifies if the DB instance is a Multi-AZ deployment"
  type        = bool
  default     = true
}

# EC2
variable "ec2_instance_type" {
  description = "The instance type for the EC2 instance"
  type        = string
  default     = "t2.micro"
}

variable "admin_public_ip_cidr" {
  description = "The public IP address in CIDR format for SSH access"
  type        = string
}

variable "ssh_public_key" {
  description = "The public key string for the SSH key pair"
  type        = string
}

# ASG
variable "asg_min_size_dev" {
  description = "Minimum size of the Auto Scaling Group for development."
  type        = number
  default     = 1
}

variable "asg_max_size_dev" {
  description = "Maximum size of the Auto Scaling Group for development."
  type        = number
  default     = 1
}

variable "asg_desired_capacity_dev" {
  description = "Desired capacity of the Auto Scaling Group for development."
  type        = number
  default     = 1
}

variable "asg_min_size_prod" {
  description = "Minimum size of the Auto Scaling Group for production."
  type        = number
  default     = 1
}

variable "asg_max_size_prod" {
  description = "Maximum size of the Auto Scaling Group for production."
  type        = number
  default     = 4
}

variable "asg_desired_capacity_prod" {
  description = "Desired capacity of the Auto Scaling Group for production."
  type        = number
  default     = 1
}

variable "asg_target_cpu_utilization" {
  description = "Target CPU utilization percentage for ASG scaling policies."
  type        = number
  default     = 50
}

# ECR Variables
variable "ecr_repository_name" {
  description = "Name of the ECR repository for the Spring Boot application"
  type        = string
  default     = "moviemator-spring-boot-app"
}

# R53
variable "domain_name" {
  description = "Custom domain name for Route 53 and ACM."
  type        = string
  default     = "moviemator.org"
}

# SSM
variable "codestar_connection_arn" {
  description = "ARN of the Codestar connection (created outside of Terraform)"
  type        = string
}

# CodePipeline
variable "github_repo_owner" {
  description = "The owner (username or organization) of the GitHub repository"
  type        = string
}

variable "github_repo_name" {
  description = "The name of the GitHub repository"
  type        = string
}

variable "github_branch" {
  description = "The branch in the GitHub repository to monitor for changes"
  type        = string
  default     = "main"
}

variable "github_oauth_token" {
  description = "GitHub Personal Access Token (PAT) for CodePipeline. Must have 'repo' and 'admin:repo_hook' scopes."
  type        = string
  sensitive   = true
}
