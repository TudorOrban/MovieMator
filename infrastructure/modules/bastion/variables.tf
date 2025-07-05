variable "project_name" {
  description = "The name of the project."
  type        = string
}

variable "env" {
  description = "The environment name (e.g., 'dev', 'prod')."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where the bastion host will be deployed."
  type        = string
}

variable "public_subnet_id" {
  description = "The ID of a public subnet for the bastion host."
  type        = string
}

variable "ssh_public_key" {
  description = "The SSH public key for the bastion host."
  type        = string
}

variable "trusted_ssh_ingress_cidr_blocks" {
  description = "A list of CIDR blocks from which SSH access to the bastion host is allowed."
  type        = list(string)
}
