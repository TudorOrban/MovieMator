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
  description = "RDS Password for ${var.project_name} ${var.env} backend."
  type        = "SecureString"
  value       = var.db_password
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
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
