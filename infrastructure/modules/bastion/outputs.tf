output "bastion_security_group_id" {
  description = "The ID of the Bastion Host's security group."
  value       = aws_security_group.bastion_sg.id
}
