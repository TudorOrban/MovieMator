
resource "aws_security_group" "ec2_sg" {
    name = "${var.env}-spring-boot-ec2-sg"
    description = "Security group for Spring Boot EC2 instances"
    vpc_id = var.vpc_id

    # For HTTP
    ingress {
        description = "Allow HTTP access to Spring Boot app"
        from_port = 8080
        to_port = 8080
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # For SSH
    ingress {
        description = "Allow SSH access"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = [var.my_public_ip_cidr]
    }

    # Allow all outbound traaffic
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

resource "aws_iam_role_policy_attachment" "ssm_attach" {
    role = aws_iam_role.ec2_role.name
    policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_attach" {
    role = aws_iam_role.ec2_role.name
    policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/CloudWatchAgentServerPolicy"
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
    vps_security_group_ids = [aws_security_group.ec2_sg.id]
    associate_public_ip_address = true
    key_name = aws_key_pair.main_key.key_name
    iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    user_data = <<-EOF
            #!/bin/bash
            sudo yum update -y
            sudo amazon-linux-extras install docker -y # Install Docker
            sudo service docker start
            sudo usermod -a -G docker ec2-user # Add ec2-user to docker group

            YOUR_ECR_REPO_URI="<YOUR_ECR_REPOSITORY_URI>" # e.g., 123456789012.dkr.ecr.eu-central-1.amazonaws.com/moviemator-app:latest

            docker pull ${YOUR_ECR_REPO_URI}
            docker run -d --restart=always -p 8080:8080 --name spring-boot-app ${YOUR_ECR_REPO_URI}
            EOF
    
    tags = {
        Name = "${var.env}-spring-boot-app"
        Environment = var.env
        Project = var.project_name
    }
}