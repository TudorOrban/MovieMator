resource "aws_route53_zone" "main" {
  name = var.domain_name

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}
