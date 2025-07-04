
resource "aws_acm_certificate" "main" {
    domain_name = var.domain_name
    validation_method = "DNS"

    lifecycle {
        create_before_destroy = true
    }

    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_route53_record" "main_validation" {
    for_each = {
        for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => dvo
    }

    zone_id = var.route53_zone_id
    name = each.value.resource_record_name
    type = each.value.resource_record_type
    records = [each.value.resource_record_value]
    ttl = 60
}

resource "aws_acm_certificate_validation" "main" {
    certificate_arn = aws_acm_certificate.main.arn
    validation_record_fqdns = [for record in aws_route53_record.main_validation : record.fqdn]

    timeouts {
        create = "30m"
    }
}