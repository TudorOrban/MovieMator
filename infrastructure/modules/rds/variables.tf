variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR block of the VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of IDs of the private subnets for the DB Subnet Group"
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

variable "db_name" {
  description = "The name of the database"
  type        = string
}

variable "db_username" {
  description = "The master username for the database"
  type        = string
}

variable "db_password" {
  description = "The master password for the database"
  type        = string
  sensitive   = true
}

variable "app_server_security_group_id" {
  description = "The ID of the security group for application servers (e.g., EC2) that need to connect to RDS."
  type        = string
}

variable "admin_public_ip_cidr" {
  description = "Public IP CIDR for administrative access to RDS (only for dev environments). Set to null for prod."
  type        = string
  default     = null
}

variable "rds_port" {
  description = "The port of the RDS instance"
  type        = number
  default     = 5432
}

variable "db_instance_class" {
  description = "The instance type for the RDS database"
  type        = string
}

variable "db_allocated_storage" {
  description = "The allocated storage in GB for the database"
  type        = number
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

variable "region" {
  description = "AWS region for the deployment"
  type        = string
}

variable "bastion_security_group_id" {
  description = "The ID of the Bastion's security group"
  type        = string
}
