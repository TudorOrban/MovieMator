resource "aws_codedeploy_app" "backend_app" {
    name = "${var.env}-${var.project_name}-backend-app"
    compute_platform = "Server"

    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_codedeploy_deployment_group" "backend_dg" {
    app_name = aws_codedeploy_app.backend_app.name
    deployment_group_name = "${var.env}-${var.project_name}-backend-dg"
    service_role_arn = var.codedeploy_role_arn
    deployment_config_name = "CodeDeployDefault.OneAtATime"

    ec2_tag_set {
        ec2_tag_filter {
            key = "Environment"
            type = "KEY_AND_VALUE"
            value = var.env
        }
        ec2_tag_filter {
            key = "Project"
            type = "KEY_AND_VALUE"
            value = var.project_name
        }
        ec2_tag_filter {
            key = "Name"
            type = "KEY_AND_VALUE"
            value = "${var.project_name}-${var.env}-spring-boot-instance"
        }
    }

    auto_rollback_configuration {
        enabled = true
        events = ["DEPLOYMENT_FAILURE", "DEPLOYMENT_STOP_ON_ALARM", "DEPLOYMENT_STOP_ON_REQUEST"]
    }

    load_balancer_info {
        target_group_info {
            name = var.alb_target_group_name
        }
    }

    tags = {
        Environment = var.env
        Project     = var.project_name
    }
}

