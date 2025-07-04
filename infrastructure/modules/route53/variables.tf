variable "domain_name" {
    description = "The custom domain name for the hosted zone."
    type = string
}

variable "alb_dns_name" {
    description = "The DNS name of the Application Load Balancer"
    type = string
}

variable "alb_zone_id" {
    description = "The Hosted Zone ID of the Application Load Balancer"
    type = string
}

variable "env" {
    description = "Deployment environment (e.g., dev, prod)."
    type = string
}

variable "project_name" {
    description = "Name of the project."
    type = string
}