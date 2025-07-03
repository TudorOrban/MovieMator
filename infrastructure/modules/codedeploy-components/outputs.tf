output "codedeploy_app_name" {
    description = "Name of the CodeDeploy app for the backend"
    value = aws_codedeploy_app.backend_app.name
}

output "codedeploy_deployment_group_name" {
    description = "Name of the CodeDeploy deployment group for the backend"
    value = aws_codedeploy_deployment_group.backend_dg.deployment_group_name
}