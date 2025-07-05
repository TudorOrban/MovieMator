resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.env}-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 10
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
    source_arn            = ""
  }

  mfa_configuration = "OFF"

  deletion_protection = "INACTIVE"

  tags = {
    Name        = "${var.project_name}-${var.env}-user-pool"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_cognito_user_pool_client" "moviemator_spa_client" {
  name                = "${var.project_name}-${var.env}-spa-client"
  user_pool_id        = aws_cognito_user_pool.main.id
  generate_secret     = false
  explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_PASSWORD_AUTH"]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]

  callback_urls = [
    "https://${var.frontend_cloudfront_domain_name}/",
    "https://${var.domain_name}/",
    "https://www.${var.domain_name}/",
    "http://localhost:4200/"
  ]
  logout_urls = [
    "https://${var.frontend_cloudfront_domain_name}/",
    "https://${var.domain_name}/",
    "https://www.${var.domain_name}/",
    "http://localhost:4200/"
  ]

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30

  prevent_user_existence_errors = "ENABLED"
}
