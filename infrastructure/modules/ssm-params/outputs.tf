output "rds_datasource_url_param_name" {
  description = "The SSM parameter name for the RDS data source URL."
  value       = aws_ssm_parameter.rds_datasource_url.name
}

output "rds_username_param_name" {
  description = "The SSM parameter name for the RDS username."
  value       = aws_ssm_parameter.rds_username.name
}

output "rds_password_param_name" {
  description = "The SSM parameter name for the RDS password."
  value       = aws_ssm_parameter.rds_password.name
}

output "github_oauth_token_param_name" {
  description = "The SSM parameter name for the GitHub OAuth token."
  value       = aws_ssm_parameter.github_oauth_token.name
}

output "codestar_connection_arn_param_name" {
  description = "The SSM parameter name for the CodeStar Connection ARN."
  value       = data.aws_ssm_parameter.codestar_connection_arn.name
}

output "allowed_cors_origins_param_name" {
  description = "SSM Parameter name for allowed CORS origins."
  value       = aws_ssm_parameter.allowed_cors_origins.name
}

output "backend_api_url_params_name" {
  description = "SSM Parameter name for allowed CORS origins."
  value       = aws_ssm_parameter.backend_api_url.name
}

output "frontend_api_url_params_name" {
  description = "SSM Parameter name for allowed CORS origins."
  value       = aws_ssm_parameter.frontend_api_url.name
}

output "cognito_issuer_uri_param_name" {
  description = "SSM Parameter name for Cognito Issuer URI."
  value       = aws_ssm_parameter.cognito_issuer_uri.name
}

output "cognito_jwk_set_uri_ssm_param_name" {
  description = "SSM Parameter name for Cognito JWK Set URI."
  value       = aws_ssm_parameter.cognito_jwk_set_uri.name
}

output "cognito_principal_claim_name_ssm_param_name" {
  description = "SSM Parameter name for Cognito principal claim name."
  value       = aws_ssm_parameter.cognito_principal_claim_name.name
}

output "cognito_authorities_claim_name_ssm_param_name" {
  description = "SSM Parameter name for Cognito authorities claim name."
  value       = aws_ssm_parameter.cognito_authorities_claim_name.name
}

output "cognito_authorities_prefix_ssm_param_name" {
  description = "SSM Parameter name for Cognito authorities prefix."
  value       = aws_ssm_parameter.cognito_authorities_prefix.name
}
