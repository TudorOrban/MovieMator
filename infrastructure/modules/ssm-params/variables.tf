variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "env" {
  description = "Deployment environment (e.g., dev, prod)."
  type        = string
}

variable "github_oauth_token" {
  description = "GitHub Personal Access Token (PAT) for CodePipeline (to be stored in SSM)."
  type        = string
  sensitive   = true
}

variable "codestar_connection_arn" {
  description = "The ARN of the pre-created CodeStar Connection (to be stored in SSM)."
  type        = string
}

variable "rds_endpoint" {
  description = "The endpoint of the RDS instance."
  type        = string
  default     = ""
}

variable "rds_port" {
  description = "The port of the RDS instance."
  type        = string
  default     = "5432"
}

variable "db_name" {
  description = "The name of the database."
  type        = string
}

variable "db_username" {
  description = "The username for the database."
  type        = string
}

variable "db_password" {
  description = "The password for the database."
  type        = string
  sensitive   = true
}

variable "allowed_cors_origins" {
  description = "Comma-separated list of allowed origins for CORS policy."
  type        = string
}

variable "cognito_issuer_uri" {
  description = "The Cognito User Pool Issuer URI for backend configuration."
  type        = string
}
