
resource "aws_security_group" "ec2_sg" {
    name = "${var.env}-spring-boot-ec2-sg"
    description = "Security group for Spring Boot EC2 instances"
    vpc_id = var.vpc_id

    # For HTTP
    ingress {
        description = "Allow HTTP access from ALB"
        from_port = 8080
        to_port = 8080
        protocol = "tcp"
        security_groups = [var.alb_security_group_id]
    }

    # For SSH
    ingress {
        description = "Allow SSH access"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = [var.my_public_ip_cidr]
    }

    # Allow all outbound traffic
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.env}-spring-boot-ec2-sg"
        Environment = var.env
        Project = var.project_name
    }
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
        Project = var.project_name
    }
}

# Resources: (SSM, CloudWatch, ECR Read-Only)
resource "aws_iam_role_policy_attachment" "ssm_attach" {
    role = aws_iam_role.ec2_role.name
    policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_attach" {
    role = aws_iam_role.ec2_role.name
    policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "ecr_read_only_attach" {
    role = aws_iam_role.ec2_role.name
    policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}


data "aws_partition" "current" {}

resource "aws_iam_instance_profile" "ec2_profile" {
    name = "${var.env}-ec2-profile"
    role = aws_iam_role.ec2_role.name
}

data "aws_ami" "amazon_linux_2" {
    most_recent = true
    owners = ["amazon"]

    filter {
        name = "name"
        values = ["amzn2-ami-hvm-*-x86_64-gp2"]
    }

    filter {
        name = "virtualization-type"
        values = ["hvm"]
    }
}

resource "aws_key_pair" "main_key" {
    key_name = "${var.env}-spring-boot-key"
    public_key = var.ssh_public_key
}

resource "aws_instance" "spring_boot" {
    ami = data.aws_ami.amazon_linux_2.id
    instance_type = var.ec2_instance_type
    subnet_id = element(var.public_subnet_ids, 0)
    vpc_security_group_ids = [aws_security_group.ec2_sg.id]
    associate_public_ip_address = true
    key_name = aws_key_pair.main_key.key_name
    iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    user_data = <<-EOF
            #!/bin/bash
            sudo yum update -y

            # Install Docker
            sudo amazon-linux-extras install docker -y
            sudo service docker start
            sudo usermod -a -G docker ec2-user

            sudo systemctl enable docker

            # Get and start Spring Boot image
            ECR_REPO_URI = "${var.ecr_repository_url}" 

            aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin $$(split("/", $$ECR_REPO_URI)[0])

            docker pull $$ECR_REPO_URI:latest

            docker run -d --restart=always -p 8080:8080 --name moviemator-spring-boot-app \
                -e SPRING_DATASOURCE_URL="jdbc:postgresql://${var.rds_endpoint}:${var.rds_port}/${var.db_name}" \
                -e SPRING_DATASOURCE_USERNAME="${var.db_username}" \
                -e SPRING_DATASOURCE_PASSWORD="${var.db_password}" \
                -e SPRING_PROFILES_ACTIVE="docker-prod" \
                -e BACKEND_API_URL="http://${var.alb_dns_name}/api/v1" \
                -e FRONTEND_API_URL="http://${var.frontend_cloudfront_domain_name}" \
                $$ECR_REPO_URI:latest
            EOF
    
    tags = {
        Name = "${var.project_name}-${var.env}-spring-boot-instance"
        Environment = var.env
        Project = var.project_name
    }
}