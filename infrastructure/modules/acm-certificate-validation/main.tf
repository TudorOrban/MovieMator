resource "aws_route53_record" "validation_records" {
  for_each = {
    for dvo in var.domain_validation_options : dvo.domain_name => dvo
  }

  zone_id = var.route53_zone_id
  name    = each.value.resource_record_name
  type    = each.value.resource_record_type
  records = [each.value.resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = var.certificate_arn
  validation_record_fqdns = [for record in aws_route53_record.validation_records : record.fqdn]

  timeouts {
    create = "30m"
  }
}
