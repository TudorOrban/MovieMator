variable "env" {
  description = "The environment name (e.g., 'dev', 'prod')"
  type        = string
}

variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "codepipeline_role_arn" {
  description = "ARN of the IAM role for CodePipeline"
  type        = string
}

variable "codepipeline_artifact_bucket_id" {
  description = "ID of the S3 bucket for CodePipeline artifacts"
  type        = string
}

variable "github_repo_owner" {
  description = "GitHub repository owner (username or organization)"
  type        = string
}

variable "github_repo_name" {
  description = "GitHub repository name"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to monitor for changes (e.g., 'dev')"
  type        = string
}

variable "backend_build_project_name" {
  description = "Name of the CodeBuild project for the backend"
  type        = string
}

variable "frontend_build_project_name" {
  description = "Name of the CodeBuild project for the frontend"
  type        = string
}

variable "codedeploy_app_name" {
  description = "Name of the CodeDeploy application for the backend"
  type        = string
}

variable "codedeploy_deployment_group_name" {
  description = "Name of the CodeDeploy deployment group for the backend"
  type        = string
}

variable "frontend_s3_bucket_name" {
  description = "Name of the S3 bucket hosting the frontend"
  type        = string
}

variable "codestar_connection_arn_ssm_param_name" {
  description = "The SSM parameter name for the CodeStar Connection ARN."
  type        = string
}

variable "github_oauth_token_ssm_param_name" {
  description = "The SSM parameter name for the GitHub OAuth token."
  type        = string
}
