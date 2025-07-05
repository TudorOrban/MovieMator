# output "rds_datasource_url_arn" {
#   value = aws_ssm_parameter.rds_datasource_url.arn
# }

# output "rds_username_arn" {
#   value = aws_ssm_parameter.rds_username.arn
# }

# output "rds_password_arn" {
#   value = aws_ssm_parameter.rds_password.arn
# }
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
  value       = aws_ssm_parameter.codestar_connection_arn.name
}
