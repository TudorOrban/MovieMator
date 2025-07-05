variable "domain_name" {
    description = "The domain name for which the certificate will be issued (e.g., the ALB DNS name or custom domain)."
    type = string
}

variable "route53_zone_id" {
    description = "The ID of the Route 53 Hosted Zone where the domain's DNS records are managed."
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