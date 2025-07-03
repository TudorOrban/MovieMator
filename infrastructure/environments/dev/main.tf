provider "aws" {
    region = var.region
}

module "network" {
    source = "../../modules/network"

    vpc_cidr = var.vpc_cidr
    public_subnet_cidrs = var.public_subnet_cidrs
    private_subnet_cidrs = var.private_subnet_cidrs
    env = var.env
    project_name = var.project_name
    region = var.region
}

module "rds" {
    source = "../../modules/rds"

    vpc_id = module.network.vpc_id
    vpc_cidr = var.vpc_cidr
    private_subnet_ids = module.network.private_subnet_ids
    env = var.env
    project_name = var.project_name
    region = var.region
    
    db_name = var.db_name
    db_username = var.db_username
    db_password = var.db_password
    db_instance_class = var.db_instance_class
    db_allocated_storage = var.db_allocated_storage
    db_skip_final_snapshot = var.db_skip_final_snapshot
    db_multi_az = var.db_multi_az
}

module "ec2" {
    source = "../../modules/ec2"

    vpc_id = module.network.vpc_id
    public_subnet_ids = module.network.public_subnet_ids
    env = var.env
    project_name = var.project_name
    region = var.region

    ec2_instance_type = var.ec2_instance_type
    my_public_ip_cidr = var.my_public_ip_cidr
    ssh_public_key = var.ssh_public_key

    rds_endpoint = module.rds.rds_endpoint
    rds_port = module.rds.rds_port
    db_name = var.db_name
    db_username = var.db_username
    db_password = var.db_password
}

output "dev_vpc_id" {
    value = module.network.vpc_id
}

output "dev_public_subnet_ids" {
    value = module.network.public_subnet_ids
}

output "dev_private_subnet_ids" {
    value = module.network.private_subnet_ids
}

output "dev_rds_endpoint" {
    description = "The connection endpoint for the dev RDS instance"
    value = module.rds.rds_endpoint
}

output "dev_rds_endpoint" {
    description = "The connection endpoint for the dev RDS instance"
    value = module.rds.rds_endpoint
}

output "dev_rds_port" {
    description = "The port for the dev RDS instance"
    value = module.rds.rds_port
}

output "dev_rds_security_group_id" {
    description = "The security group ID for the dev RDS instance"
    value = module.rds.rds_security_group_id
}

output "dev_ec2_public_ip" {
    description = "The public IP address of the dev EC2 instance"
    value = module.ec2.ec2_public_ip
}

output "dev_ec2_public_dns" {
    description = "The public DNS name of the dev EC2 instance"
    value = module.ec2.ec2_public_dns
}

output "dev_ec2_security_group_id" {
    description = "The security group ID for the dev EC2 instance"
    value = module.ec2.ec2_security_group_id
}

output "dev_ssh_key_name" {
    description = "The name of the SSH key pair for the dev EC2 instance"
    value = module.ec2.ssh_key_name
}