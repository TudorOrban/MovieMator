output "api_dns_name" {
  description = "The FQDN for the API endpoint."
  value       = aws_route53_record.api_a_record.fqdn
}
