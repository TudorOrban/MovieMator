resource "aws_launch_template" "spring_boot_lt" {
  name_prefix            = "${var.env}-spring-boot-lt-"
  image_id               = data.aws_ami.amazon_linux_2.id
  instance_type          = var.ec2_instance_type
  key_name               = aws_key_pair.main_key.key_name
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  iam_instance_profile {
    arn = aws_iam_instance_profile.ec2_profile.arn
  }

  user_data = base64encode(templatefile("${path.module}/user_data_script.sh", {
    region                                        = var.region
    ecr_repository_url                            = var.ecr_repository_url
    rds_datasource_url_ssm_param_name             = var.rds_datasource_url_ssm_param_name
    rds_username_ssm_param_name                   = var.rds_username_ssm_param_name
    rds_password_ssm_param_name                   = var.rds_password_ssm_param_name
    allowed_cors_origins_ssm_param_name           = var.allowed_cors_origins_ssm_param_name
    cognito_issuer_uri_ssm_param_name             = var.cognito_issuer_uri_ssm_param_name
    alb_dns_name                                  = var.alb_dns_name
    frontend_cloudfront_domain_name               = var.frontend_cloudfront_domain_name
    cognito_jwk_set_uri_ssm_param_name            = var.cognito_jwk_set_uri_ssm_param_name
    cognito_principal_claim_name_ssm_param_name   = var.cognito_principal_claim_name_ssm_param_name
    cognito_authorities_claim_name_ssm_param_name = var.cognito_authorities_claim_name_ssm_param_name
    cognito_authorities_prefix_ssm_param_name     = var.cognito_authorities_prefix_ssm_param_name
  }))

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "${var.project_name}-${var.env}-spring-boot-instance"
      Environment = var.env
      Project     = var.project_name
    }
  }

  tags = {
    Name        = "${var.project_name}-${var.env}-spring-boot-launch-template"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_autoscaling_group" "spring_boot_asg" {
  name                = "${var.env}-spring-boot-asg"
  vpc_zone_identifier = var.private_subnet_ids

  min_size         = var.env == "prod" ? var.asg_min_size_prod : var.asg_min_size_dev
  max_size         = var.env == "prod" ? var.asg_max_size_prod : var.asg_max_size_dev
  desired_capacity = var.env == "prod" ? var.asg_desired_capacity_prod : var.asg_desired_capacity_dev

  launch_template {
    id      = aws_launch_template.spring_boot_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-${var.env}-spring-boot-instance"
    propagate_at_launch = true
  }
  tag {
    key                 = "Environment"
    value               = var.env
    propagate_at_launch = true
  }
  tag {
    key                 = "Project"
    value               = var.project_name
    propagate_at_launch = true
  }

  health_check_type         = "ELB"
  health_check_grace_period = 300

  target_group_arns = [var.alb_target_group_arn]

  force_delete = true
}

resource "aws_autoscaling_policy" "scale_out" {
  name                   = "${var.env}-spring-boot-scale-out-policy"
  autoscaling_group_name = aws_autoscaling_group.spring_boot_asg.name
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = var.asg_target_cpu_utilization
  }
  enabled = var.env == "prod"
}

resource "aws_autoscaling_policy" "scale_in" {
  name                   = "${var.env}-spring-boot-scale-in-policy"
  autoscaling_group_name = aws_autoscaling_group.spring_boot_asg.name
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value     = var.asg_target_cpu_utilization
    disable_scale_in = false
  }
  enabled = var.env == "prod"
}

resource "aws_iam_role" "ec2_role" {
  name_prefix = "${var.env}-ec2-role-"
  description = "IAM role for Spring Boot EC2 instances"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
      },
    ],
  })

  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

# Resources: (SSM, CloudWatch, ECR Read-Only)
resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "ecr_read_only_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ec2_s3_read_access" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

resource "aws_iam_role_policy" "ec2_ssm_params_read_access" {
  name = "${var.env}-ec2-ssm-params-read-access"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter",
          "ssm:GetParametersByPath"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/${var.env}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = "arn:${data.aws_partition.current.partition}:kms:${var.region}:${data.aws_caller_identity.current.account_id}:key/*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "ssm.${var.region}.amazonaws.com"
          }
          StringLike = {
            "kms:EncryptionContext:PARAMETER_ARN" = "arn:${data.aws_partition.current.partition}:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/${var.env}/*"
          }
        }
      }
    ]
  })
}

data "aws_partition" "current" {}
data "aws_caller_identity" "current" {}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.env}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "main_key" {
  key_name   = "${var.env}-spring-boot-key"
  public_key = var.ssh_public_key
}
