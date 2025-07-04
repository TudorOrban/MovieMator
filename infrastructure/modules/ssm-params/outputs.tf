output "rds_datasource_url_arn" {
    value = aws_ssm_parameter.rds_datasource_url.arn
}

output "rds_username_arn" {
    value = aws_ssm_parameter.rds_username.arn
}

output "rds_password_arn" {
    value = aws_ssm_parameter.rds_password.arn
}

output "frontend_api_url_arn" {
    value = aws_ssm_parameter.frontend_api_url.arn
}