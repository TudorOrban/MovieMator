variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "private_subnet_ids" {
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

variable "ec2_instance_type" {
  description = "The instance type for the EC2 instance"
  type        = string
  default     = "t3.micro"
}

variable "admin_public_ip_cidr" {
  description = "The Public IP address in CIDR format for SSH access"
  type        = string
  default     = null
}

variable "ssh_public_key" {
  description = "The public key string for the SSH key pair"
  type        = string
}

variable "region" {
  description = "AWS region for the deployment"
  type        = string
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository where the backend Docker image is"
  type        = string
}

variable "alb_security_group_id" {
  description = "The ID of the ALB's security group"
  type        = string
}

variable "alb_dns_name" {
  description = "The DNS name of the ALB for backend API calls"
  type        = string
}

variable "alb_target_group_arn" {
  description = "The ARN of the Application Load Balancer target group."
  type        = string
}

variable "frontend_cloudfront_domain_name" {
  description = "The CloudFront domain name for the Angular frontend"
  type        = string
}

variable "bastion_security_group_id" {
  description = "The ID of the Bastion Host's security group to allow SSH from."
  type        = string
  default     = null
}

# Cognito
variable "cognito_jwk_set_uri_ssm_param_name" {
  description = "SSM param name for Cognito JWK Set URI"
  type        = string
}
variable "cognito_principal_claim_name_ssm_param_name" {
  description = "SSM param name for Cognito Principal Claim Name"
  type        = string
}
variable "cognito_authorities_claim_name_ssm_param_name" {
  description = "SSM param name for Cognito Authorities Claim Name"
  type        = string
}
variable "cognito_authorities_prefix_ssm_param_name" {
  description = "SSM param name for Cognito Authorities Prefix"
  type        = string
}

# Autoscaling
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
  default     = 70
}

# --- SSM Parameter Names (for User Data retrieval) ---
variable "rds_datasource_url_ssm_param_name" {
  description = "SSM parameter name for RDS data source URL."
  type        = string
}

variable "rds_username_ssm_param_name" {
  description = "SSM parameter name for RDS username."
  type        = string
}

variable "rds_password_ssm_param_name" {
  description = "SSM parameter name for RDS password."
  type        = string
}

variable "allowed_cors_origins_ssm_param_name" {
  description = "SSM parameter name for allowed CORS origins."
  type        = string
}

variable "cognito_issuer_uri_ssm_param_name" {
  description = "SSM parameter name for Cognito issuer URI."
  type        = string
}
