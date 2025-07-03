output "backend_build_project_name" {
    description = "Name of the CodeBuild project for the backend"
    value = aws_codebuild_project.backend_build.name
}

output "backend_build_project_arn" {
    description = "ARN of the CodeBuild project for the backend"
    value = aws_codebuild_project.backend_build.arn
}

output "frontend_build_project_name" {
    description = "Name of the CodeBuild project for the frontend"
    value = aws_codebuild_project.frontend_build.name
}

output "frontend_build_project_arn" {
    description = "ARN of the CodeBuild project for the frontend"
    value = aws_codebuild_project.frontend_build.arn
}