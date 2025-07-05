
# Network
output "dev_vpc_id" {
  value = module.network.vpc_id
}

output "dev_public_subnet_ids" {
  value = module.network.public_subnet_ids
}

output "dev_private_subnet_ids" {
  value = module.network.private_subnet_ids
}

# RDS
output "dev_rds_endpoint" {
  description = "The connection endpoint for the dev RDS instance"
  value       = module.rds.rds_endpoint
}

output "dev_rds_port" {
  description = "The port for the dev RDS instance"
  value       = module.rds.rds_port
}

output "dev_rds_security_group_id" {
  description = "The security group ID for the dev RDS instance"
  value       = module.rds.rds_security_group_id
}

# ECR
output "dev_ecr_repository_url" {
  description = "The URL of the ECR repository for the Spring Boot app"
  value       = module.ecr.repository_url
}

# EC2
output "dev_ec2_security_group_id" {
  description = "The security group ID for the dev EC2 instance"
  value       = module.ec2.ec2_security_group_id
}

output "dev_ssh_key_name" {
  description = "The name of the SSH key pair for the dev EC2 instance"
  value       = module.ec2.ssh_key_name
}

# ALB
output "dev_alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "dev_alb_security_group_id" {
  description = "The security group ID for the ALB"
  value       = module.alb.alb_security_group_id
}

# Frontend
output "dev_frontend_s3_bucket_name" {
  description = "The S3 bucket name for the Angular frontend"
  value       = module.s3_cloudfront_frontend.s3_bucket_name
}

output "dev_frontend_cloudfront_domain_name" {
  description = "The CloudFront domain name for the Angular frontend"
  value       = module.s3_cloudfront_frontend.cloudfront_domain_name
}

# CI/CD IAM
output "dev_codepipeline_role_arn" {
  description = "ARN of the IAM role for CodePipeline"
  value       = module.cicd_iam.codepipeline_role_arn
}

output "dev_codepipeline_artifact_bucket_id" {
  description = "ID of the S3 bucket for CodePipeline artifacts"
  value       = module.cicd_iam.codepipeline_artifact_bucket_id
}

output "dev_codebuild_backend_role_arn" {
  description = "ARN of the IAM role for CodeBuild (backend)"
  value       = module.cicd_iam.codebuild_backend_role_arn
}

output "dev_codebuild_frontend_role_arn" {
  description = "ARN of the IAM role for CodeBuild (frontend)"
  value       = module.cicd_iam.codebuild_frontend_role_arn
}

output "dev_codedeploy_role_arn" {
  description = "ARN of the IAM role for CodeDeploy"
  value       = module.cicd_iam.codedeploy_role_arn
}

# CodeBuild projects
output "dev_backend_build_project_name" {
  description = "Name of the CodeBuild project for the backend"
  value       = module.codebuild_projects.backend_build_project_name
}

output "dev_backend_build_project_arn" {
  description = "ARN of the CodeBuild project for the backend"
  value       = module.codebuild_projects.backend_build_project_arn
}

output "dev_frontend_build_project_name" {
  description = "Name of the CodeBuild project for the frontend"
  value       = module.codebuild_projects.frontend_build_project_name
}

output "dev_frontend_build_project_arn" {
  description = "ARN of the CodeBuild project for the frontend"
  value       = module.codebuild_projects.frontend_build_project_arn
}

# CodeDeploy components
output "dev_codedeploy_app_name" {
  description = "Name of the CodeDeploy app for the backend"
  value       = module.codedeploy_components.codedeploy_app_name
}

output "dev_codedeploy_deployment_group_name" {
  description = "Name of the CodeDeploy deployment group for the backend"
  value       = module.codedeploy_components.codedeploy_deployment_group_name
}

# CodeStar Connection
# output "dev_codestar_connection_arn" {
#     description = "ARN of the CodeStar Connection"
#     value = module.codestar_connection.connection_arn
# }

# output "dev_codestar_connection_name" {
#     description = "Name of the CodeStar Connection"
#     value = module.codestar_connection.connection_name
# }

# CodePipeline
output "dev_pipeline_name" {
  description = "Name of the CodePipeline"
  value       = module.codepipeline.pipeline_name
}

output "dev_pipeline_arn" {
  description = "ARN of the CodePipeline"
  value       = module.codepipeline.pipeline_arn
}
