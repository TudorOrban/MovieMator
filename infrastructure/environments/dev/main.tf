provider "aws" {
    region = var.region
}

provider "aws" {
    alias = "us_east_1"
    region = "us-east-1"
}

module "network" {
    source = "../../modules/network"

    vpc_cidr = var.vpc_cidr
    public_subnet_cidrs = var.public_subnet_cidrs
    private_subnet_cidrs = var.private_subnet_cidrs
    env = var.env
    project_name = var.project_name
    region = var.region
}

module "rds" {
    source = "../../modules/rds"

    vpc_id = module.network.vpc_id
    vpc_cidr = var.vpc_cidr
    private_subnet_ids = module.network.private_subnet_ids
    env = var.env
    project_name = var.project_name
    region = var.region
    
    db_name = var.db_name
    db_username = var.db_username
    db_password = var.db_password
    rds_port = var.rds_port
    db_instance_class = var.db_instance_class
    db_allocated_storage = var.db_allocated_storage
    db_skip_final_snapshot = var.db_skip_final_snapshot
    db_multi_az = var.db_multi_az
}

module "ecr" {
    source = "../../modules/ecr"

    repository_name = var.ecr_repository_name
    env = var.env
    project_name = var.project_name
    region = var.region
}

module "ec2" {
    source = "../../modules/ec2"

    vpc_id = module.network.vpc_id
    public_subnet_ids = module.network.public_subnet_ids
    env = var.env
    project_name = var.project_name
    region = var.region

    ec2_instance_type = var.ec2_instance_type
    my_public_ip_cidr = var.my_public_ip_cidr
    ssh_public_key = var.ssh_public_key

    rds_endpoint = module.rds.rds_endpoint
    rds_port = module.rds.rds_port
    db_name = var.db_name
    db_username = var.db_username
    db_password = var.db_password

    ecr_repository_url = module.ecr.repository_url
    alb_security_group_id = module.alb.alb_security_group_id
    alb_dns_name = module.alb.alb_dns_name
    frontend_cloudfront_domain_name = module.s3_cloudfront_frontend.cloudfront_domain_name
}

# Load Balancer
module "alb" {
    source = "../../modules/alb" 
    
    vpc_id = module.network.vpc_id
    public_subnet_ids = module.network.public_subnet_ids
    env = var.env
    project_name = var.project_name
    region = var.region
    ec2_instance_id = module.ec2.ec2_instance_id
}

# S3/CloudFront
module "s3_cloudfront_frontend" {
    source = "../../modules/s3-cloudfront-frontend"

    project_name = var.project_name
    env = var.env
    region = var.region
    alb_dns_name = module.alb.alb_dns_name
    providers = {
        aws = aws
        aws.us_east_1 = aws.us_east_1
    }
}

# SSM
module "ssm_params" {
    source = "../../modules/ssm-params"

    project_name = var.project_name
    env = var.env

    rds_endpoint = module.rds.rds_endpoint
    rds_port = var.rds_port
    db_name = var.db_name
    db_username = var.db_username
    db_password = var.db_password
    frontend_cloudfront_domain_name = module.s3_cloudfront_frontend.cloudfront_domain_name
}

# CI/CD IAM Roles
module "cicd_iam" {
    source = "../../modules/cicd-iam"

    env = var.env
    project_name = var.project_name
    region = var.region
    ecr_repository_arn = module.ecr.repository_arn
    frontend_s3_bucket_arn = module.s3_cloudfront_frontend.s3_bucket_arn
    cloudfront_distribution_arn = module.s3_cloudfront_frontend.cloudfront_distribution_arn
    codestar_connection_arn = "arn:aws:codeconnections:eu-central-1:474668403865:connection/831b9d46-9ac5-4a0e-adc7-eb2127b4bd3b"
}

# CodeBuild Projects
module "codebuild_projects" {
    source = "../../modules/codebuild-projects"

    env = var.env
    project_name = var.project_name
    region = var.region
    codebuild_backend_role_arn = module.cicd_iam.codebuild_backend_role_arn
    codebuild_frontend_role_arn = module.cicd_iam.codebuild_frontend_role_arn 
    ecr_repository_url = module.ecr.repository_url
    alb_dns_name = module.alb.alb_dns_name
    cloudfront_domain_name = module.s3_cloudfront_frontend.cloudfront_domain_name
    frontend_s3_bucket_name = module.s3_cloudfront_frontend.s3_bucket_name
    cloudfront_distribution_id = module.s3_cloudfront_frontend.cloudfront_distribution_id
}

# CodeDeploy Components
module "codedeploy_components" {
    source = "../../modules/codedeploy-components"

    env = var.env
    project_name = var.project_name
    codedeploy_role_arn = module.cicd_iam.codedeploy_role_arn
    alb_target_group_name = module.alb.alb_target_group_name
}

# CodeStar Connection
# module "codestar_connection" {
#     source = "../../modules/codestar-connection"

#     env = var.env
#     project_name = var.project_name
# }

# CodePipeline
module "codepipeline" {
    source = "../../modules/codepipeline"

    env = var.env
    project_name = var.project_name

    codepipeline_role_arn = module.cicd_iam.codepipeline_role_arn
    codepipeline_artifact_bucket_id = module.cicd_iam.codepipeline_artifact_bucket_id 

    github_repo_owner = var.github_repo_owner
    github_repo_name = var.github_repo_name
    github_branch = var.github_branch
    github_oauth_token = var.github_oauth_token
    codestar_connection_arn = "arn:aws:codeconnections:eu-central-1:474668403865:connection/831b9d46-9ac5-4a0e-adc7-eb2127b4bd3b"
    
    backend_build_project_name = module.codebuild_projects.backend_build_project_name
    frontend_build_project_name = module.codebuild_projects.frontend_build_project_name

    codedeploy_app_name = module.codedeploy_components.codedeploy_app_name
    codedeploy_deployment_group_name = module.codedeploy_components.codedeploy_deployment_group_name

    frontend_s3_bucket_name = module.s3_cloudfront_frontend.s3_bucket_name
}

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
    value = module.rds.rds_endpoint
}

output "dev_rds_port" {
    description = "The port for the dev RDS instance"
    value = module.rds.rds_port
}

output "dev_rds_security_group_id" {
    description = "The security group ID for the dev RDS instance"
    value = module.rds.rds_security_group_id
}

# ECR
output "dev_ecr_repository_url" {
    description = "The URL of the ECR repository for the Spring Boot app"
    value = module.ecr.repository_url
}

# EC2
output "dev_ec2_public_ip" {
    description = "The public IP address of the dev EC2 instance"
    value = module.ec2.ec2_public_ip
}

output "dev_ec2_public_dns" {
    description = "The public DNS name of the dev EC2 instance"
    value = module.ec2.ec2_public_dns
}

output "dev_ec2_security_group_id" {
    description = "The security group ID for the dev EC2 instance"
    value = module.ec2.ec2_security_group_id
}

output "dev_ssh_key_name" {
    description = "The name of the SSH key pair for the dev EC2 instance"
    value = module.ec2.ssh_key_name
}

# ALB
output "dev_alb_dns_name" {
    description = "The DNS name of the Application Load Balancer"
    value = module.alb.alb_dns_name
}

output "dev_alb_security_group_id" {
    description = "The security group ID for the ALB"
    value = module.alb.alb_security_group_id
}

# Frontend
output "dev_frontend_s3_bucket_name" {
    description = "The S3 bucket name for the Angular frontend"
    value = module.s3_cloudfront_frontend.s3_bucket_name
}

output "dev_frontend_cloudfront_domain_name" {
    description = "The CloudFront domain name for the Angular frontend"
    value = module.s3_cloudfront_frontend.cloudfront_domain_name
}

# CI/CD IAM
output "dev_codepipeline_role_arn" {
    description = "ARN of the IAM role for CodePipeline"
    value = module.cicd_iam.codepipeline_role_arn
}

output "dev_codepipeline_artifact_bucket_id" {
    description = "ID of the S3 bucket for CodePipeline artifacts"
    value = module.cicd_iam.codepipeline_artifact_bucket_id
}

output "dev_codebuild_backend_role_arn" {
    description = "ARN of the IAM role for CodeBuild (backend)"
    value = module.cicd_iam.codebuild_backend_role_arn
}

output "dev_codebuild_frontend_role_arn" {
    description = "ARN of the IAM role for CodeBuild (frontend)"
    value = module.cicd_iam.codebuild_frontend_role_arn
}

output "dev_codedeploy_role_arn" {
    description = "ARN of the IAM role for CodeDeploy"
    value = module.cicd_iam.codedeploy_role_arn
}

# CodeBuild projects
output "dev_backend_build_project_name" {
    description = "Name of the CodeBuild project for the backend"
    value = module.codebuild_projects.backend_build_project_name
}

output "dev_backend_build_project_arn" {
    description = "ARN of the CodeBuild project for the backend"
    value = module.codebuild_projects.backend_build_project_arn
}

output "dev_frontend_build_project_name" {
    description = "Name of the CodeBuild project for the frontend"
    value = module.codebuild_projects.frontend_build_project_name
}

output "dev_frontend_build_project_arn" {
    description = "ARN of the CodeBuild project for the frontend"
    value = module.codebuild_projects.frontend_build_project_arn
}

# CodeDeploy components
output "dev_codedeploy_app_name" {
    description = "Name of the CodeDeploy app for the backend"
    value = module.codedeploy_components.codedeploy_app_name
}

output "dev_codedeploy_deployment_group_name" {
    description = "Name of the CodeDeploy deployment group for the backend"
    value = module.codedeploy_components.codedeploy_deployment_group_name
}

#CodeStar Connection
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
    value = module.codepipeline.pipeline_name
}

output "dev_pipeline_arn" {
    description = "ARN of the CodePipeline"
    value = module.codepipeline.pipeline_arn
}