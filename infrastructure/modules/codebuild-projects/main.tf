
resource "aws_codebuild_project" "backend_build" {
  name          = "${var.env}-${var.project_name}-backend-build"
  service_role  = var.codebuild_backend_role_arn
  build_timeout = "20"

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = var.region
    }
    environment_variable {
      name  = "ECR_REPO_URI"
      value = var.ecr_repository_url
    }
    environment_variable {
      name  = "CLOUDFRONT_DOMAIN_NAME"
      value = var.cloudfront_domain_name
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "backend/buildspec.yml"
  }

  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_codebuild_project" "frontend_build" {
  name          = "${var.env}-${var.project_name}-frontend-build"
  service_role  = var.codebuild_frontend_role_arn
  build_timeout = "30"

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:5.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = false
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = var.region
    }
    environment_variable {
      name  = "DOMAIN_NAME"
      value = var.domain_name
    }
    environment_variable {
      name  = "CLOUDFRONT_DOMAIN_NAME"
      value = var.cloudfront_domain_name
    }
    environment_variable {
      name  = "FRONTEND_S3_BUCKET_NAME"
      value = var.frontend_s3_bucket_name
    }
    environment_variable {
      name = "TMDB_API_KEY"
      value = var.tmdb_api_key
    }
    environment_variable {
      name  = "CLOUDFRONT_DISTRIBUTION_ID"
      value = var.cloudfront_distribution_id
    }
    environment_variable {
      name  = "COGNITO_USER_POOL_ID"
      value = var.cognito_user_pool_id
    }
    environment_variable {
      name  = "COGNITO_USER_POOL_CLIENT_ID"
      value = var.cognito_user_pool_client_id
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "frontend/buildspec.yml"
  }

  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}
