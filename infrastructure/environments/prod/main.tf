provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "network" {
  source = "../../modules/network"

  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  env                  = var.env
  project_name         = var.project_name
  region               = var.region
}

module "rds" {
  source = "../../modules/rds"

  vpc_id             = module.network.vpc_id
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.network.private_subnet_ids
  env                = var.env
  project_name       = var.project_name
  region             = var.region

  my_public_ip_cidr = var.my_public_ip_cidr

  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
  rds_port               = var.rds_port
  db_instance_class      = var.db_instance_class
  db_allocated_storage   = var.db_allocated_storage
  db_skip_final_snapshot = var.db_skip_final_snapshot
  db_multi_az            = var.db_multi_az
}

module "ecr" {
  source = "../../modules/ecr"

  repository_name = var.ecr_repository_name
  env             = var.env
  project_name    = var.project_name
  region          = var.region
}

module "ec2" {
  source = "../../modules/ec2"

  vpc_id            = module.network.vpc_id
  public_subnet_ids = module.network.public_subnet_ids
  env               = var.env
  project_name      = var.project_name
  region            = var.region

  ec2_instance_type = var.ec2_instance_type
  my_public_ip_cidr = var.my_public_ip_cidr
  ssh_public_key    = var.ssh_public_key

  rds_endpoint = module.rds.rds_endpoint
  rds_port     = module.rds.rds_port
  db_name      = var.db_name
  db_username  = var.db_username
  db_password  = var.db_password

  ecr_repository_url              = module.ecr.repository_url
  alb_security_group_id           = module.alb.alb_security_group_id
  alb_dns_name                    = module.alb.alb_dns_name
  frontend_cloudfront_domain_name = module.s3_cloudfront_frontend.cloudfront_domain_name
}

# Load Balancer
module "alb" {
  source = "../../modules/alb"

  vpc_id              = module.network.vpc_id
  public_subnet_ids   = module.network.public_subnet_ids
  env                 = var.env
  project_name        = var.project_name
  region              = var.region
  ec2_instance_id     = module.ec2.ec2_instance_id
  alb_certificate_arn = module.alb_acm.certificate_arn
}

# S3/CloudFront
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

# Route 53
data "aws_cloudfront_distribution" "s3_distribution_data" {
  id = module.s3_cloudfront_frontend.cloudfront_distribution_id
}

module "route53" {
  source = "../../modules/route53"

  domain_name  = var.domain_name
  env          = var.env
  project_name = var.project_name
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id  = module.alb.alb_zone_id

  cloudfront_dns_name = module.s3_cloudfront_frontend.cloudfront_domain_name
  cloudfront_zone_id  = data.aws_cloudfront_distribution.s3_distribution_data.hosted_zone_id
}

# ACM
module "cloudfront_acm" {
  source = "../../modules/acm"
  providers = {
    aws = aws.us_east_1
  }
  domain_name     = var.domain_name
  route53_zone_id = module.route53.zone_id
  env             = var.env
  project_name    = var.project_name
}

module "alb_acm" {
  source          = "../../modules/acm"
  domain_name     = "api.${var.domain_name}"
  route53_zone_id = module.route53.zone_id
  env             = var.env
  project_name    = var.project_name
}

module "cognito" {
  source = "../../modules/cognito"

  project_name                    = var.project_name
  env                             = var.env
  region                          = var.region
  domain_name                     = var.domain_name
  frontend_cloudfront_domain_name = module.s3_cloudfront_frontend.cloudfront_domain_name
}

# SSM
module "ssm_params" {
  source = "../../modules/ssm-params"

  project_name = var.project_name
  env          = var.env

  github_oauth_token   = var.github_oauth_token
  codestar_connection_arn = var.codestar_connection_arn
  rds_endpoint = module.rds.rds_endpoint
  rds_port     = var.rds_port
  db_name      = var.db_name
  db_username  = var.db_username
  db_password  = var.db_password
  allowed_cors_origins = join(",", [
    "https://${module.s3_cloudfront_frontend.cloudfront_domain_name}",
    "https://${var.domain_name}",
    "https://www.${var.domain_name}"
  ])
  cognito_issuer_uri = module.cognito.user_pool_issuer_uri
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

  github_repo_owner       = var.github_repo_owner
  github_repo_name        = var.github_repo_name
  github_branch           = var.github_branch
  github_oauth_token      = var.github_oauth_token
  codestar_connection_arn = "arn:aws:codeconnections:eu-central-1:474668403865:connection/831b9d46-9ac5-4a0e-adc7-eb2127b4bd3b"

  backend_build_project_name  = module.codebuild_projects.backend_build_project_name
  frontend_build_project_name = module.codebuild_projects.frontend_build_project_name

  codedeploy_app_name              = module.codedeploy_components.codedeploy_app_name
  codedeploy_deployment_group_name = module.codedeploy_components.codedeploy_deployment_group_name

  frontend_s3_bucket_name = module.s3_cloudfront_frontend.s3_bucket_name
}
