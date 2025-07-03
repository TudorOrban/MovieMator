output "codepipeline_role_arn" {
    description = "ARN of the IAM role for CodePipeline"
    value = aws_iam_role.codepipeline_role.arn
}

output "codepipeline_artifact_bucket_id" {
    description = "ID of the S3 bucket for CodePipeline artifacts"
    value = aws_s3_bucket.codepipeline_artifact_bucket.id
}

output "codebuild_backend_role_arn" {
    description = "ARN of the IAM role for CodeBuild (backend)"
    value = aws_iam_role.codebuild_backend_role.arn
}

output "codebuild_frontend_role_arn" {
    description = "ARN of the IAM role for CodeBuild (frontend)"
    value = aws_iam_role.codebuild_frontend_role.arn
}

output "codedeploy_role_arn" {
    description = "ARN of the IAM role for CodeDeploy"
    value = aws_iam_role.codedeploy_role.arn
}