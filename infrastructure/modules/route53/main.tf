resource "aws_route53_zone" "main" {
    name = var.domain_name
    
    tags = {
        Environment = var.env
        Project = var.project_name
    }
}