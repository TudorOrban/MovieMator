resource "aws_ecr_repository" "app_repo" {
    name = var.repository_name

    image_scanning_configuration {
        scan_on_push = true
    }

    tags = {
        Name = "${var.env}-${var.repository_name}"
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_ecr_lifecycle_policy" "app_repo_policy" {
    repository = aws_ecr_repository.app_repo.name

    policy = jsonencode({
        rules = [
            {
                rulePriority = 1,
                description = "Keep last 10 images",
                selection = {
                    tagStatus = "any",
                    countType = "imageCountMoreThan",
                    countNumber = 9
                },
                action = {
                    type = "expire"
                }
            }
        ]
    })
}