output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "A list of IDs of the public subnets"
  value       = aws_subnet.public.*.id
}

output "private_subnet_ids" {
  description = "A list of IDs of the private subnets"
  value       = aws_subnet.private.*.id
}

output "public_route_table_id" {
  description = "The ID of the public route table"
  value       = aws_route_table.public.id
}

output "private_route_table_ids" {
  description = "The IDs of the private route tables."
  value       = aws_route_table.private[*].id
}

output "nat_gateway_ids" {
  description = "IDs of the created NAT Gateways."
  value       = aws_nat_gateway.main[*].id
}
