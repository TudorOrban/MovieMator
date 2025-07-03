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

output "dev_vpc_id" {
    value = module.network.vpc_id
}

output "dev_public_subnet_ids" {
    value = module.network.public_subnet_ids
}

output "dev_private_subnet_ids" {
    value = module.network.private_subnet_ids
}