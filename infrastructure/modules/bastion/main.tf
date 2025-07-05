data "aws_ami" "bastion_ami" {
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

resource "aws_key_pair" "bastion_key" {
  key_name   = "${var.env}-bastion-key"
  public_key = var.ssh_public_key
}

resource "aws_security_group" "bastion_sg" {
  name        = "${var.project_name}-${var.env}-bastion-sg"
  description = "Security group for the Bastion Host"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.trusted_ssh_ingress_cidr_blocks
    description = "Allow SSH from trusted IPs"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "${var.project_name}-${var.env}-bastion-sg"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_iam_role" "bastion_role" {
  name_prefix = "${var.env}-bastion-role-"
  description = "IAM role for Bastion Host"

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

resource "aws_iam_role_policy_attachment" "bastion_ssm_attach" {
  role       = aws_iam_role.bastion_role.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "bastion_profile" {
  name = "${var.env}-bastion-profile"
  role = aws_iam_role.bastion_role.name
}

# EC2 Instance for the Bastion Host
resource "aws_instance" "bastion_host" {
  ami                         = data.aws_ami.bastion_ami.id
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.bastion_key.key_name
  subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  associate_public_ip_address = true

  iam_instance_profile = aws_iam_instance_profile.bastion_profile.name

  tags = {
    Name        = "${var.project_name}-${var.env}-bastion-host"
    Environment = var.env
    Project     = var.project_name
  }
}
