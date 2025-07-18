output "certificate_arn" {
  description = "The ARN of the ACM certificate."
  value       = aws_acm_certificate.main.arn
}

output "domain_validation_options" {
  description = "A list of domain validation options for the certificate."
  value       = aws_acm_certificate.main.domain_validation_options
}
