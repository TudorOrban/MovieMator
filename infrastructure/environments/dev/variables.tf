variable "region" {
  description = "AWS region for the deployment"
  type        = string
  default     = "eu-central-1"
}

variable "env" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
  default     = "dev"
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
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "The allocated storage in GB for the database"
  type        = number
  default     = 20
}

variable "db_skip_final_snapshot" {
  description = "Whether to skip the final snapshot when deleting the DB instance"
  type        = bool
  default     = true
}

variable "db_multi_az" {
  description = "Specifies if the DB instance is a Multi-AZ deployment"
  type        = bool
  default     = false
}

# EC2
variable "ec2_instance_type" {
  description = "The instance type for the EC2 instance"
  type        = string
  default     = "t2.micro"
}

variable "my_public_ip_cidr" {
  description = "The public IP address in CIDR format for SSH access"
  type        = string
  default     = "94.53.42.151/32"
}

variable "ssh_public_key" {
  description = "The public key string for the SSH key pair"
  type        = string
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

variable "route53_zone_id" {
  description = "The ID of the Route 53 Hosted Zone."
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
