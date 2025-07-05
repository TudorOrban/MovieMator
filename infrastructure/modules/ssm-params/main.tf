resource "aws_ssm_parameter" "github_oauth_token" {
  name        = "/${var.project_name}/${var.env}/github_oauth_token"
  description = "GitHub OAuth Token for CodePipeline in ${var.project_name} ${var.env}."
  type        = "SecureString"
  value       = var.github_oauth_token
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "rds_datasource_url" {
  name        = "/${var.project_name}/${var.env}/rds_datasource_url"
  description = "RDS Datasource URL for ${var.project_name} ${var.env} backend."
  type        = "String"
  value       = var.rds_endpoint != "" ? "jdbc:postgresql://${var.rds_endpoint}:${var.rds_port}/${var.db_name}" : ""
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_ssm_parameter" "rds_username" {
  name        = "/${var.project_name}/${var.env}/rds_username"
  description = "RDS Username for ${var.project_name} ${var.env} backend."
  type        = "String"
  value       = var.db_username
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_ssm_parameter" "rds_password" {
  name        = "/${var.project_name}/${var.env}/rds_password"
  description = "RDS DB Password for ${var.project_name} ${var.env}."
  type        = "SecureString"
  value       = var.db_password
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "backend_api_url" {
  name        = "/${var.project_name}/${var.env}/backend_api_url"
  type        = "String"
  value       = "https://${var.alb_dns_name}/api/v1"
  description = "Backend API URL"
}

resource "aws_ssm_parameter" "frontend_api_url" {
  name        = "/${var.project_name}/${var.env}/frontend_api_url"
  type        = "String"
  value       = "https://${var.cloudfront_domain_name}"
  description = "Frontend API URL"
}

resource "aws_ssm_parameter" "allowed_cors_origins" {
  name        = "/${var.project_name}/${var.env}/ALLOWED_CORS_ORIGINS"
  description = "Comma-separated list of allowed origins for CORS policy."
  type        = "String"
  value       = var.allowed_cors_origins
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_ssm_parameter" "cognito_issuer_uri" {
  name        = "/${var.project_name}/${var.env}/spring/security/oauth2/resourceserver/jwt/issuer-uri"
  description = "Cognito User Pool Issuer URI for Spring Boot backend."
  type        = "String"
  value       = var.cognito_issuer_uri
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_ssm_parameter" "cognito_jwk_set_uri" {
  name        = "/${var.project_name}/${var.env}/spring/security/oauth2/resourceserver/jwt/jwk-set-uri"
  description = "Cognito JWK Set URI for Spring Boot backend."
  type        = "String"
  value       = "${var.cognito_issuer_uri}/.well-known/jwks.json"
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_ssm_parameter" "cognito_principal_claim_name" {
  name        = "/${var.project_name}/${var.env}/spring/security/oauth2/resourceserver/jwt/jwt-authentication-converter/principal-claim-name"
  description = "Cognito JWT principal claim name."
  type        = "String"
  value       = "sub"
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_ssm_parameter" "cognito_authorities_claim_name" {
  name        = "/${var.project_name}/${var.env}/spring/security/oauth2/resourceserver/jwt/jwt-authentication-converter/authorities-claim-name"
  description = "Cognito JWT authorities claim name."
  type        = "String"
  value       = "cognito:groups"
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_ssm_parameter" "cognito_authorities_prefix" {
  name        = "/${var.project_name}/${var.env}/spring/security/oauth2/resourceserver/jwt/jwt-authentication-converter/authorities-prefix"
  description = "Cognito JWT authorities prefix."
  type        = "String"
  value       = "ROLE_"
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

data "aws_ssm_parameter" "codestar_connection_arn" {
  name            = "/${var.project_name}/${var.env}/codestar_connection_arn"
  with_decryption = false
}
