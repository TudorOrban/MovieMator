
resource "aws_db_subnet_group" "main" {
    name = "${var.env}-rds-subnet-group"
    subnet_ids = var.private_subnet_ids
    tags = {
        Name = "${var.env}-rds-subnet-group"
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_security_group" "rds_sg" {
    name = "${var.env}-rds-sg"
    description = "Allow inbound traffic to RDS from application servers"
    vpc_id = var.vpc_id

    ingress {
        description = "Allow PostgreSQL acces from within the VPC"
        from_port = 5432
        to_port = 5432
        protocol = "tcp"
        cidr_blocks = [var.vpc_cidr] # TODO: Restrict to the SG of the application servers
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.env}-rds-sg"
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_db_instance" "postgres" {
    allocated_storage = var.db_allocated_storage
    storage_type = "gp2"
    engine = "postgres"
    engine_version = "17.4"
    instance_class = var.db_instance_class
    db_name = var.db_name
    username = var.db_username
    password = var.db_password
    parameter_group_name = "default.postgres17"
    skip_final_snapshot = var.db_skip_final_snapshot
    multi_az = var.db_multi_az
    publicly_accessible = false

    db_subnet_group_name = aws_db_subnet_group.main.name
    vpc_security_group_ids = [aws_security_group.rds_sg.id]

    tags = {
        Name = "${var.env}-postgres-db"
        Environment = var.env
        Project = var.project_name
    }
}