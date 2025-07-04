output "zone_id" {
    description = "The ID of the created Route 53 Hosted Zone."
    value = aws_route53_zone.main.zone_id
}

output "name_servers" {
    description = "The list of name servers for the hosted zone. These must be set at your domain registrar."
    value = aws_route53_zone.main.name_servers
}