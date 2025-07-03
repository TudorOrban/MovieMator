resource "aws_iam_role" "codepipeline_role" {
    name = "${var.env}-${var.project_name}-codepipeline-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Action = "sts:AssumeRole",
                Effect = "allow",
                Principal = {
                    Service = "codepipeline.amazonaws.com"
                },
            },
        ],
    })
    
    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_iam_role_policy" "codepipeline_policy" {
    name = "${var.env}-${var.project_name}-codepipeline-policy"
    role = aws_iam_role.codepipeline_role.id

    
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = concat(
            [
                {
                    Action = [
                        "s3:GetObject",
                        "s3:GetObjectVersion",
                        "s3:GetBucketVersioning",
                        "s3:PutObject",
                        "s3:ListBucket",
                    ],
                    Effect = "Allow",
                    Resource = [
                        aws_s3_bucket.codepipeline_artifact_bucket.arn,
                        "${aws_s3_bucket.codepipeline_artifact_bucket.arn}/*",
                    ],
                },
                {
                    Action = [
                        "codebuild:BatchGetBuilds",
                        "codebuild:StartBuild",
                        "codebuild:StopBuild",
                    ],
                    Effect = "Allow",
                    Resource = "*",
                },
                {
                    Action = [
                        "codedeploy:CreateDeployment",
                        "codedeploy:GetApplication",
                        "codedeploy:GetApplicationRevision",
                        "codedeploy:GetDeployment",
                        "codedeploy:GetDeploymentConfig",
                        "codedeploy:RegisterApplicationRevision",
                    ],
                    Effect = "Allow",
                    Resource = "*",
                },
                {
                    Action = [
                        "iam:PassRole",
                    ],
                    Effect = "Allow",
                    Resource = [
                        aws_iam_role.codebuild_backend_role.arn,
                        aws_iam_role.codebuild_frontend_role.arn,
                        aws_iam_role.codedeploy_role.arn,
                    ],
                },
            ],
            var.github_token_secret_arn != "" ? [
                {
                    Action = [
                        "secretsmanager:GetSecretValue",
                    ],
                    Effect = "Allow",
                    Resource = var.github_token_secret_arn
                }
            ] : []
        ),
    })
}

resource "aws_s3_bucket" "codepipeline_artifact_bucket" {
    bucket = "${var.project_name}-${var.env}-codepipeline-artifacts-${random_string.suffix.id}"
    acl = "private"

    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_s3_bucket_versioning" "codepipeline_artifact_bucket_versioning" {
    bucket = aws_s3_bucket.codepipeline_artifact_bucket.id
    versioning_configuration {
        status = "Enabled"
    }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "codepipeline_artifact_bucket_sse" {
    bucket = aws_s3_bucket.codepipeline_artifact_bucket.id

    rule {
        apply_server_side_encryption_by_default {
            sse_algorithm = "AES256"
        }
    }
}

resource "aws_iam_role" "codebuild_backend_role" {
    name = "${var.env}-${var.project_name}-codebuild-backend-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Action = "sts:AssumeRole",
                Effect = "Allow",
                Principal = {
                    Service = "codebuild.amazonaws.com"
                },
            },
        ],
    })

    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_iam_role_policy" "codebuild_backend_policy" {
    name = "${var.env}-${var.project_name}-codebuild-backend-policy"
    role = aws_iam_role.codebuild_backend_role.id

    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Action = [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                ],
                Effect = "Allow",
                Resource = "arn:${data.aws_partition.current.partition}:logs:${var.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/codebuild/${var.env}-${var.project_name}-backend-build:*",
            },
            {
                Action = [
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:PutObject",
                    "s3:ListBucket",
                    "s3:GetBucketAcl",
                    "s3:GetBucketLocation",
                ],
                Effect = "Allow",
                Resource = [
                    aws_s3_bucket.codepipeline_artifact_bucket.arn,
                    "${aws_s3_bucket.codepipeline_artifact_bucket.arn}/*",
                ],
            },
            {
                Action = [
                    "ecr:GetDownloadUrlForLayer",
                    "ecr:BatchGetImage",
                    "ecr:BatchCheckLayerAvailability",
                    "ecr:PutImage",
                    "ecr:InitiateLayerUpload",
                    "ecr:UploadLayerPart",
                    "ecr:CompleteLayerUpload",
                    "ecr:GetLoginPassword",
                ],
                Effect = "Allow",
                Resource = var.ecr_repository_arn,
            },
            {
                Action = "ecr:GetAuthorizationToken",
                Effect = "Allow",
                Resource = "*"
            },
            {
                Action = [
                    "sts:GetServiceBearerToken",
                ],
                Effect = "Allow",
                Resource = "*",
                Condition = {
                    StringEquals = {
                        "sts:AWSServiceName" = "ecr.amazonaws.com"
                    }
                }
            }
        ],
    })
}

resource "aws_iam_role" "codebuild_frontend_role" {
    name = "${var.env}-${var.project_name}-codebuild-frontend-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Action = "sts:AssumeRole",
                Effect = "Allow",
                Principal = {
                    Service = "codebuild.amazonaws.com"
                },
            },
        ],
    })

    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_iam_role_policy" "codebuild_frontend_policy" {
    name = "${var.env}-${var.project_name}-codebuild-frontend-policy"
    role = aws_iam_role.codebuild_frontend_role.id

    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Action = [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                ],
                Effect = "Allow",
                Resource = "arn:${data.aws_partition.current.partition}:logs:${var.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/codebuild/${var.env}-${var.project_name}-frontend-build:*",
            },
            {
                Action = [
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:PutObject",
                    "s3:ListBucket",
                    "s3:DeleteObject",
                    "s3:GetBucketAcl",
                    "s3:GetBucketLocation",
                ],
                Effect = "Allow",
                Resource = [
                    aws_s3_bucket.codepipeline_artifact_bucket.arn,
                    "${aws_s3_bucket.codepipeline_artifact_bucket.arn}/*",
                    var.frontend_s3_bucket_arn,
                    "${var.frontend_s3_bucket_arn}/*",
                ],
            },
            {
                Action = [
                    "cloudfront:CreateInvalidation",
                    "cloudfront:GetInvalidation",
                    "cloudfront:ListInvalidations",
                ],
                Effect = "Allow",
                Resource = var.cloudfront_distribution_arn,
            },
            {
                Action = [
                    "ssm:GetParameters",
                    "ssm:GetParameter",
                ],
                Effect = "Allow",
                Resource = [
                    "arn:${data.aws_partition.current.partition}:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/dev/alb_dns_name",
                    "arn:${data.aws_partition.current.partition}:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/dev/cloudfront_domain_name",
                ],
            }
        ],
    })
}

resource "aws_iam_role" "codedeploy_role" {
    name = "${var.env}-${var.project_name}-codedeploy-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Action = "sts:AssumeRole",
                Effect = "Allow",
                Principal = {
                    Service = "codedeploy.amazonaws.com"
                },
            },
        ],
    }) 

    tags = {
        Environment = var.env,
        Project = var.project_name
    }
}

resource "aws_iam_role_policy_attachment" "codedeploy_managed_policy" {
    role = aws_iam_role.codedeploy_role.name
    policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/service-role/AWSCodeDeployRole"
}

resource "random_string" "suffix" {
    length  = 8
    special = false
    upper   = false
    numeric = true
}

data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}