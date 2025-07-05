output "ec2_security_group_id" {
  description = "The ID of the security group attached to the EC2 instances."
  value       = aws_security_group.ec2_sg.id
}

output "autoscaling_group_name" {
  description = "The name of the Auto Scaling Group."
  value       = aws_autoscaling_group.spring_boot_asg.name
}

output "ssh_key_name" {
  description = "The name of the SSH key pair"
  value       = aws_key_pair.main_key.key_name
}

output "asg_name" {
  description = "The name of the Auto Scaling Group."
  value       = aws_autoscaling_group.spring_boot_asg.name # Assuming your ASG resource is named 'spring_boot_asg'
}

variable "asg_scale_in_target_cpu_utilization" {
  description = "The target CPU utilization percentage for ASG scale-in policy."
  type        = number
  default     = 30
}
