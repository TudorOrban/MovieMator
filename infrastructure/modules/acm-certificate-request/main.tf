resource "aws_acm_certificate" "main" {
  domain_name               = var.domain_name
  validation_method         = "DNS"
  subject_alternative_names = var.subject_alternative_names # Optional: if you need SANs

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}
