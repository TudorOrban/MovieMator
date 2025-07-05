
// New
resource "aws_launch_template" "spring_boot_lt" {
  name_prefix            = "${var.env}-spring-boot-lt-"
  image_id               = data.aws_ami.amazon_linux_2.id
  instance_type          = var.ec2_instance_type
  key_name               = aws_key_pair.main_key.key_name
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  iam_instance_profile {
    arn = aws_iam_instance_profile.ec2_profile.arn
  }
  user_data = base64encode(<<-EOF
            #!/bin/bash
            sudo yum update -y

            # Install Docker
            sudo amazon-linux-extras install docker -y
            sudo service docker start
            sudo usermod -a -G docker ec2-user
            sudo systemctl enable docker

            # Get and start Spring Boot image
            ECR_REPO_URI="${var.ecr_repository_url}"

            # Login to ECR
            aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin $(echo ${var.ecr_repository_url} | cut -d/ -f1)

            docker pull $ECR_REPO_URI:latest

            # Use SSM Parameter Store for database credentials
            DB_DATASOURCE_URL=$(aws ssm get-parameter --name "${var.rds_datasource_url_ssm_param_name}" --query Parameter.Value --output text)
            DB_USERNAME=$(aws ssm get-parameter --name "${var.rds_username_ssm_param_name}" --query Parameter.Value --output text)
            DB_PASSWORD=$(aws ssm get-parameter --name "${var.rds_password_ssm_param_name}" --with-decryption --query Parameter.Value --output text)
            
            # Get other configs from SSM (if they're stored there) or directly from variables
            ALLOWED_CORS_ORIGINS=$(aws ssm get-parameter --name "${var.allowed_cors_origins_ssm_param_name}" --query Parameter.Value --output text)
            COGNITO_ISSUER_URI=$(aws ssm get-parameter --name "${var.cognito_issuer_uri_ssm_param_name}" --query Parameter.Value --output text)
            
            # ALB DNS name and CloudFront domain are not in SSM, pass them as instance user data variables
            ALB_DNS_NAME="${var.alb_dns_name}"
            FRONTEND_CLOUDFRONT_DOMAIN_NAME="${var.frontend_cloudfront_domain_name}"

            docker run -d --restart=always -p 8080:8080 --name moviemator-spring-boot-app \
                -e SPRING_DATASOURCE_URL="$DB_DATASOURCE_URL" \
                -e SPRING_DATASOURCE_USERNAME="$DB_USERNAME" \
                -e SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD" \
                -e SPRING_PROFILES_ACTIVE="docker-prod" \
                -e BACKEND_API_URL="http://$ALB_DNS_NAME/api/v1" \
                -e FRONTEND_API_URL="https://$FRONTEND_CLOUDFRONT_DOMAIN_NAME" \
                -e ALLOWED_CORS_ORIGINS="$ALLOWED_CORS_ORIGINS" \
                -e COGNITO_ISSUER_URI="$COGNITO_ISSUER_URI" \
                $ECR_REPO_URI:latest
            EOF
  )


  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "${var.project_name}-${var.env}-spring-boot-asg-instance"
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
  vpc_zone_identifier = var.public_subnet_ids

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

    health_check_type = "ELB"
    health_check_grace_period = 300

    target_group_arns = [var.alb_target_group_arn]

    force_delete = true
}

resource "aws_autoscaling_policy" "scale_out" {
    name = "${var.env}-spring-boot-scale-out-policy"
    autoscaling_group_name = aws_autoscaling_group.spring_boot_asg.name
    policy_type = "TargetTrackingScaling"
    target_tracking_configuration {
      predefined_metric_specification {
        predefined_metric_type = "ASGAverageCPUUtilization"
      }
      target_value = var.asg_target_cpu_utilization
    }
    enabled = var.env == "prod"
}

resource "aws_autoscaling_policy" "scale_in" {
    name = "${var.env}-spring-boot-scale-in-policy"
    autoscaling_group_name = aws_autoscaling_group.spring_boot_asg.name
    policy_type = "TargetTrackingScaling"
    target_tracking_configuration {
      predefined_metric_specification {
        predefined_metric_type = "ASGAverageCPUUtilization"
      }
      target_value = var.asg_target_cpu_utilization
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
