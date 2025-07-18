output "user_pool_id" {
  description = "The ID of the Cognito User Pool."
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "The ARN of the Cognito User Pool."
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_issuer_uri" {
  description = "The issuer URI for the Cognito User Pool, used by Spring Boot backend."
  value       = "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.main.id}"
}

output "user_pool_client_id" {
  description = "The ID of the Cognito User Pool App Client."
  value       = aws_cognito_user_pool_client.moviemator_spa_client.id
}
