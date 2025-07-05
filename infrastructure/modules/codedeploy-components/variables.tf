variable "env" {
  description = "The environment name (e.g., 'dev', 'prod')"
  type        = string
}

variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "codedeploy_role_arn" {
  description = "ARN of the IAM role for CodeDeploy"
  type        = string
}

variable "alb_target_group_name" {
  description = "Name of the ALB target group for backend instances"
  type        = string
  default     = null
}

variable "asg_name" {
  description = "Name of the Auto Scaling Group where the application instances run"
  type        = string
}
