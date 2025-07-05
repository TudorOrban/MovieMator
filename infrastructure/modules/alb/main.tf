resource "aws_security_group" "alb_sg" {
    name = "${var.env}-alb-sg"
    description = "Security group for Application Load Balancer"
    vpc_id = var.vpc_id

    ingress {
        description = "Allow HTTP access from anywhere"
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "Allow HTTPS access from anywhere"
        from_port = 443
        to_port = 443
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.env}-alb-sg"
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_lb" "main" {
    name = "${var.env}-moviemator-alb"
    internal = false
    load_balancer_type = "application"
    security_groups = [aws_security_group.alb_sg.id]
    subnets = var.public_subnet_ids

    enable_deletion_protection = false

    tags = {
        Name = "${var.env}-moviemator-alb"
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_lb_target_group" "spring_boot_tg" {
    name = "${var.env}-spring-boot-tg"
    port = 8080
    protocol = "HTTP"
    vpc_id = var.vpc_id

    health_check {
        path = "/actuator/health"
        protocol = "HTTP"
        matcher = "200"
        interval = 30
        timeout = 5
        healthy_threshold = 2
        unhealthy_threshold = 2
    }

    tags = {
        Name = "${var.env}-spring-boot-tg"
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_lb_listener" "http_listener" {
    load_balancer_arn = aws_lb.main.arn
    port = 80
    protocol = "HTTP"

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.spring_boot_tg.arn
    }

    tags = {
        Name        = "${var.env}-http-listener"
        Environment = var.env
        Project     = var.project_name
    }
}

resource "aws_lb_listener" "https_listener" {
    load_balancer_arn = aws_lb.main.arn
    port = 443
    protocol = "HTTPS"
    ssl_policy = "ELBSecurityPolicy-2016-08"
    certificate_arn = var.alb_certificate_arn

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.spring_boot_tg.arn
    }

    tags = {
        Name = "${var.env}-https-listener"
        Environment = var.env
        Project = var.project_name
    }
}