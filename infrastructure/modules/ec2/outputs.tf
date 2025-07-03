output "ec2_public_ip" {
    description = "The public IP address of the EC2 instance"
    value = aws_instance.spring_boot.public_ip
}

output "ec2_public_dns" {
    description = "The public DNS name of the EC2 instance"
    value = aws_instance.spring_boot.public_dns
}

output "ec2_private_ip" {
    description = "The private IP address of the EC2 instance"
    value = aws_instance.spring_boot.private_ip
}

output "ec2_security_group_id" {
    description = "The ID of the security group attached to the EC2 instance"
    value = aws_security_group.ec2_sg.id
}

output "ssh_key_name" {
    description = "The name of the SSH key pair"
    value = aws_key_pair.main_key.key_name
}