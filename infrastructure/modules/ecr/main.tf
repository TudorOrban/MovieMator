resource "aws_ecr_repository" "app_repo" {
    name = var.repository_name

    image_scanning_configuration {
        scan_on_push = true
    }

    lifecycle_policy {
        policy = jsonencode({
            rules = [
                {
                    rulePriority = 1,
                    description = "Keep last 10 images",
                    selection = {
                        tagStatus = "ANY",
                        countType = "IMAGE_COUNT_GE",
                        countNumber = 10
                    },
                    action = {
                        type = "EXPIRE"
                    }
                }
            ]
        })
    }

    tags = {
        Name = "${var.env}-${var.repository_name}"
        Environment = var.env
        Project = var.project_name
    }
}