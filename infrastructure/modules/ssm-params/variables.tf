variable "project_name" {
    description = "Name of the project."
    type = string
}

variable "env" {
    description = "Deployment environment (e.g., dev, prod)."
    type = string
}

variable "rds_endpoint" {
    description = "The endpoint of the RDS instance."
    type = string
    default = ""
}

variable "rds_port" {
    description = "The port of the RDS instance."
    type = string
    default = "5432"
}

variable "db_name" {
    description = "The name of the database."
    type = string
}

variable "db_username" {
    description = "The username for the database."
    type = string
}

variable "db_password" {
    description = "The password for the database."
    type = string
    sensitive = true
}

variable "allowed_cors_origins" {
    description = "Comma-separated list of allowed origins for CORS policy."
    type = string
}