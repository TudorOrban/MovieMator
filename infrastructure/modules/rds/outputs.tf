output "rds_endpoint" {
  description = "The connection endpoint of the RDS instance"
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "The port of the RDS instance"
  value       = aws_db_instance.postgres.port
}

output "rds_security_group_id" {
  description = "The ID of the security group attached to the RDS instance"
  value       = aws_security_group.rds_sg.id
}
