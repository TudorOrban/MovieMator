variable "domain_name" {
    description = "The custom domain name for the hosted zone."
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