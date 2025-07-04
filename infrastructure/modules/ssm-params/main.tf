resource "aws_ssm_parameter" "rds_datasource_url" {
    name = "/${var.project_name}/${var.env}/rds_datasource_url"
    description = "RDS Datasource URL for ${var.project_name} ${var.env} backend."
    type = "String"
    value = var.rds_endpoint != "" ? "jdbc:postgresql://${var.rds_endpoint}:${var.rds_port}/${var.db_name}" : ""
    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_ssm_parameter" "rds_username" {
    name = "/${var.project_name}/${var.env}/rds_username"
    description = "RDS Username for ${var.project_name} ${var.env} backend."
    type = "String"
    value = var.db_username
    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_ssm_parameter" "rds_password" {
    name = "/${var.project_name}/${var.env}/rds_password"
    description = "RDS Password for ${var.project_name} ${var.env} backend."
    type = "SecureString"
    value = var.db_password
    tags = {
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_ssm_parameter" "frontend_api_url" {
    name = "/${var.project_name}/${var.env}/frontend_api_url"
    description = "Frontend CloudFront domain name for ${var.project_name} ${var.env} backend CORS."
    type = "String"
    value = var.frontend_cloudfront_domain_name
    tags = {
        Environment = var.env
        Project = var.project_name
    }
}