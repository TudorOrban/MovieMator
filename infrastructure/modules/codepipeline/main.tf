resource "aws_codepipeline" "main_pipeline" {
  name     = "${var.env}-${var.project_name}-pipeline"
  role_arn = var.codepipeline_role_arn

  artifact_store {
    location = var.codepipeline_artifact_bucket_id
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["SourceOutput"]

      configuration = {
        ConnectionArn    = data.aws_ssm_parameter.codestar_connection_arn_from_ssm.value
        FullRepositoryId = "${var.github_repo_owner}/${var.github_repo_name}"
        BranchName       = var.github_branch
      }
    }
  }

  stage {
    name = "BuildBackend"

    action {
      name             = "BuildBackend"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["SourceOutput"]
      output_artifacts = ["BackendBuildOutput"]

      configuration = {
        ProjectName = var.backend_build_project_name
      }
    }
  }

  stage {
    name = "BuildFrontend"

    action {
      name             = "BuildFrontend"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["SourceOutput"]
      output_artifacts = ["FrontenndBuildOutput"]

      configuration = {
        ProjectName = var.frontend_build_project_name
      }
    }
  }

  stage {
    name = "DeployBackend"

    action {
      name            = "DeployBackend"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "CodeDeploy"
      version         = "1"
      input_artifacts = ["BackendBuildOutput"]

      configuration = {
        ApplicationName     = var.codedeploy_app_name
        DeploymentGroupName = var.codedeploy_deployment_group_name
      }
    }
  }

  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

data "aws_ssm_parameter" "codestar_connection_arn_from_ssm" {
  name = var.codestar_connection_arn_ssm_param_name

  with_decryption = false
}
