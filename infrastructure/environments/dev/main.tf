provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# Core Networking
module "network" {
  source = "../../modules/network"

  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  env                  = var.env
  project_name         = var.project_name
  region               = var.region
}

# 1. Route 53 Hosted Zone
module "route53_zone" {
  source = "../../modules/route53-zone"

  domain_name  = var.domain_name
  env          = var.env
  project_name = var.project_name
}

# 2. ACM Certificates
module "cloudfront_acm" {
  source = "../../modules/acm"
  providers = {
    aws = aws.us_east_1
  }
  domain_name     = var.domain_name
  route53_zone_id = module.route53_zone.zone_id
  env             = var.env
  project_name    = var.project_name
}

module "alb_acm" {
  source          = "../../modules/acm"
  domain_name     = "api.${var.domain_name}"
  route53_zone_id = module.route53_zone.zone_id
  env             = var.env
  project_name    = var.project_name
}

# Load Balancer (Depends on Network and ALB ACM certificate)
module "alb" {
  source = "../../modules/alb"

  vpc_id              = module.network.vpc_id
  public_subnet_ids   = module.network.public_subnet_ids
  env                 = var.env
  project_name        = var.project_name
  region              = var.region
  alb_certificate_arn = module.alb_acm.certificate_arn
}

# ECR (Independent, but needed by EC2)
module "ecr" {
  source = "../../modules/ecr"

  repository_name = var.ecr_repository_name
  env             = var.env
  project_name    = var.project_name
  region          = var.region
}

# RDS database (Depends on Network. app_server_security_group_id will directly use ec2 SG in dev)
module "rds" {
  source = "../../modules/rds"

  vpc_id             = module.network.vpc_id
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.network.private_subnet_ids
  env                = var.env
  project_name       = var.project_name
  region             = var.region

  app_server_security_group_id = module.ec2.ec2_security_group_id
  admin_public_ip_cidr         = var.admin_public_ip_cidr

  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
  rds_port               = var.rds_port
  db_instance_class      = var.db_instance_class
  db_allocated_storage   = var.db_allocated_storage
  db_skip_final_snapshot = var.db_skip_final_snapshot
  db_multi_az            = var.db_multi_az
}

# S3/CloudFront Frontend (Depends on ALB DNS name and CloudFront ACM certificate)
module "s3_cloudfront_frontend" {
  source = "../../modules/s3-cloudfront-frontend"

  project_name               = var.project_name
  env                        = var.env
  region                     = var.region
  alb_dns_name               = module.alb.alb_dns_name
  cloudfront_certificate_arn = module.cloudfront_acm.certificate_arn
  domain_name                = var.domain_name
  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }
}

data "aws_cloudfront_distribution" "s3_distribution_data" {
  id = module.s3_cloudfront_frontend.cloudfront_distribution_id
}

# Cognito
module "cognito" {
  source = "../../modules/cognito"

  project_name                    = var.project_name
  env                             = var.env
  region                          = var.region
  domain_name                     = var.domain_name
  frontend_cloudfront_domain_name = module.s3_cloudfront_frontend.cloudfront_domain_name
}

# SSM (Depends on RDS, Cognito, and S3/CloudFront outputs)
module "ssm_params" {
  source = "../../modules/ssm-params"

  project_name = var.project_name
  env          = var.env

  github_oauth_token      = var.github_oauth_token
  codestar_connection_arn = var.codestar_connection_arn
  rds_endpoint            = module.rds.rds_endpoint
  rds_port                = module.rds.rds_port
  db_name                 = var.db_name
  db_username             = var.db_username
  db_password             = var.db_password
  alb_dns_name            = module.alb.alb_dns_name
  cloudfront_domain_name  = module.s3_cloudfront_frontend.cloudfront_domain_name
  allowed_cors_origins = join(",", [
    "https://${module.s3_cloudfront_frontend.cloudfront_domain_name}",
    "https://${var.domain_name}",
    "https://www.${var.domain_name}"
  ])
  cognito_issuer_uri = module.cognito.user_pool_issuer_uri
}

# EC2 (Auto Scaling Group) (Depends on Network, ALB, ECR, SSM, and CloudFront/ALB DNS for user data)
module "ec2" {
  source = "../../modules/ec2"

  env          = var.env
  project_name = var.project_name
  region       = var.region

  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  ec2_instance_type  = var.ec2_instance_type
  ssh_public_key     = var.ssh_public_key

  alb_security_group_id = module.alb.alb_security_group_id
  alb_target_group_arn  = module.alb.alb_target_group_arn
  alb_dns_name          = module.alb.alb_dns_name

  frontend_cloudfront_domain_name = module.s3_cloudfront_frontend.cloudfront_domain_name

  ecr_repository_url = module.ecr.repository_url

  admin_public_ip_cidr = var.admin_public_ip_cidr

  rds_datasource_url_ssm_param_name   = module.ssm_params.rds_datasource_url_param_name
  rds_username_ssm_param_name         = module.ssm_params.rds_username_param_name
  rds_password_ssm_param_name         = module.ssm_params.rds_password_param_name
  allowed_cors_origins_ssm_param_name = module.ssm_params.allowed_cors_origins_param_name
  cognito_issuer_uri_ssm_param_name   = module.ssm_params.cognito_issuer_uri_param_name

  asg_min_size_dev           = var.asg_min_size_dev
  asg_max_size_dev           = var.asg_max_size_dev
  asg_desired_capacity_dev   = var.asg_desired_capacity_dev
  asg_target_cpu_utilization = var.asg_target_cpu_utilization

  cognito_jwk_set_uri_ssm_param_name            = module.ssm_params.cognito_jwk_set_uri_ssm_param_name
  cognito_principal_claim_name_ssm_param_name   = module.ssm_params.cognito_principal_claim_name_ssm_param_name
  cognito_authorities_claim_name_ssm_param_name = module.ssm_params.cognito_authorities_claim_name_ssm_param_name
  cognito_authorities_prefix_ssm_param_name     = module.ssm_params.cognito_authorities_prefix_ssm_param_name
}

# 3. Route 53 Records
module "route53_records" {
  source = "../../modules/route53-records"

  route53_zone_id = module.route53_zone.zone_id
  domain_name     = var.domain_name

  alb_dns_name        = module.alb.alb_dns_name
  alb_zone_id         = module.alb.alb_zone_id
  cloudfront_dns_name = module.s3_cloudfront_frontend.cloudfront_domain_name
  cloudfront_zone_id  = data.aws_cloudfront_distribution.s3_distribution_data.hosted_zone_id

  env          = var.env
  project_name = var.project_name
}

# CI/CD IAM Roles
module "cicd_iam" {
  source = "../../modules/cicd-iam"

  env                         = var.env
  project_name                = var.project_name
  region                      = var.region
  ecr_repository_arn          = module.ecr.repository_arn
  frontend_s3_bucket_arn      = module.s3_cloudfront_frontend.s3_bucket_arn
  cloudfront_distribution_arn = module.s3_cloudfront_frontend.cloudfront_distribution_arn
  codestar_connection_arn     = var.codestar_connection_arn
}

# CodeBuild Projects
module "codebuild_projects" {
  source = "../../modules/codebuild-projects"

  env                         = var.env
  project_name                = var.project_name
  region                      = var.region
  codebuild_backend_role_arn  = module.cicd_iam.codebuild_backend_role_arn
  codebuild_frontend_role_arn = module.cicd_iam.codebuild_frontend_role_arn
  ecr_repository_url          = module.ecr.repository_url
  domain_name                 = var.domain_name
  cloudfront_domain_name      = module.s3_cloudfront_frontend.cloudfront_domain_name
  frontend_s3_bucket_name     = module.s3_cloudfront_frontend.s3_bucket_name
  cloudfront_distribution_id  = module.s3_cloudfront_frontend.cloudfront_distribution_id
  cognito_user_pool_id        = module.cognito.user_pool_id
  cognito_user_pool_client_id = module.cognito.user_pool_client_id
}

# CodeDeploy Components
module "codedeploy_components" {
  source = "../../modules/codedeploy-components"

  env                   = var.env
  project_name          = var.project_name
  codedeploy_role_arn   = module.cicd_iam.codedeploy_role_arn
  alb_target_group_name = module.alb.alb_target_group_name
  asg_name              = module.ec2.asg_name
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

  env          = var.env
  project_name = var.project_name

  codepipeline_role_arn           = module.cicd_iam.codepipeline_role_arn
  codepipeline_artifact_bucket_id = module.cicd_iam.codepipeline_artifact_bucket_id

  github_repo_owner                      = var.github_repo_owner
  github_repo_name                       = var.github_repo_name
  github_branch                          = var.github_branch
  codestar_connection_arn_ssm_param_name = module.ssm_params.codestar_connection_arn_param_name
  github_oauth_token_ssm_param_name      = module.ssm_params.github_oauth_token_param_name

  backend_build_project_name  = module.codebuild_projects.backend_build_project_name
  frontend_build_project_name = module.codebuild_projects.frontend_build_project_name

  codedeploy_app_name              = module.codedeploy_components.codedeploy_app_name
  codedeploy_deployment_group_name = module.codedeploy_components.codedeploy_deployment_group_name

  frontend_s3_bucket_name = module.s3_cloudfront_frontend.s3_bucket_name
}
