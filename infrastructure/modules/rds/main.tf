
resource "aws_db_subnet_group" "main" {
  name       = "${var.env}-rds-subnet-group"
  subnet_ids = var.private_subnet_ids
  tags = {
    Name        = "${var.env}-rds-subnet-group"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.env}-rds-sg"
  description = "Allow inbound traffic to RDS from application servers and specific IPs"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = var.app_server_security_group_id != null ? [1] : []
    content {
      description     = "Allow PostgreSQL access from application servers"
      from_port       = var.rds_port
      to_port         = var.rds_port
      protocol        = "tcp"
      security_groups = [var.app_server_security_group_id]
    }
  }

  # For dev, allow access from a specific admin IP address
  dynamic "ingress" {
    for_each = var.env == "dev" && var.admin_public_ip_cidr != null ? [1] : []
    content {
      description = "Allow PostgreSQL access from specific public IP for admin/debugging (Dev Only)"
      from_port   = var.rds_port
      to_port     = var.rds_port
      protocol    = "tcp"
      cidr_blocks = [var.admin_public_ip_cidr]
    }
  }

  dynamic "ingress" {
    for_each = var.bastion_security_group_id != null ? [1] : []
    content {
      description     = "Allow PostgreSQL access from Bastion Host"
      from_port       = var.rds_port
      to_port         = var.rds_port
      protocol        = "tcp"
      security_groups = [var.bastion_security_group_id]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.env}-rds-sg"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = var.db_allocated_storage
  storage_type         = "gp3"
  engine               = "postgres"
  engine_version       = "17.4"
  instance_class       = var.db_instance_class
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres17"
  skip_final_snapshot  = var.db_skip_final_snapshot
  multi_az             = var.db_multi_az
  publicly_accessible  = false

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = {
    Name        = "${var.env}-postgres-db"
    Environment = var.env
    Project     = var.project_name
  }
}
