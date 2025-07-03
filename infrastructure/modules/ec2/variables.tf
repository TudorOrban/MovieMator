variable "vpc_id" {
    description = "The ID of the VPC"
    type = string
}

variable "public_subnet_ids" {
    description = "A list of IDs of the public subnets"
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

variable "ec2_instance_type" {
    description = "The instance type for the EC2 instance"
    type = string
}

variable "my_public_ip_cidr" {
    description = "Your public IP address in CIDR format for SSH access"
    type = string
}

variable "ssh_public_key" {
    description = "The public key string for your SSH key pair"
    type = string
}

variable "rds_endpoint" {
    description = "The connection endpoint of the RDS instance"
    type = string
}

variable "rds_port" {
    description = "The port of the RDS instance"
    type = number
}

variable "db_name" {
    description = "The name of the database"
    type = string
}

variable "db_username" {
    description = "The master username for the database"
    type = string
}

variable "db_password" {
    description = "The master password for the database"
    type = string
    sensitive = true
}

variable "region" {
    description = "AWS region for the deployment"
    type = string
}

variable "ecr_repository_url" {
    description = "URL of the ECR repository where the backend Docker image is"
    type = string   
}

variable "alb_security_group_id" {
    description = "The ID of the ALB's security group"
    type = string
}

variable "alb_dns_name" {
    description = "The DNS name of the ALB for backend API calls"
    type = string
}

variable "frontend_cloudfront_domain_name" {
    description = "The CloudFront domain name for the Angular frontend"
    type = string
}