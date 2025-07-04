output "zone_id" {
    description = "The ID of the created Route 53 Hosted Zone."
    value = aws_route53_zone.main.zone_id
}

output "name_servers" {
    description = "The list of name servers for the hosted zone. These must be set at your domain registrar."
    value = aws_route53_zone.main.name_servers
}

output "api_dns_name" {
    description = "The FQDN for the API endpoint"
    value = aws_route53_record.api_a_record.fqdn
}