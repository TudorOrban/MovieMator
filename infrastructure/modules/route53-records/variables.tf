variable "route53_zone_id" {
  description = "The ID of the Route 53 Hosted Zone where records will be created."
  type        = string
}

variable "domain_name" {
  description = "The custom domain name for the hosted zone. Used for record naming."
  type        = string
}

variable "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer."
  type        = string
}

variable "alb_zone_id" {
  description = "The Hosted Zone ID of the Application Load Balancer."
  type        = string
}

variable "cloudfront_dns_name" {
  description = "The domain name of the CloudFront distribution."
  type        = string
}

variable "cloudfront_zone_id" {
  description = "The hosted zone ID of the CloudFront distribution."
  type        = string
}

variable "env" {
  description = "Deployment environment (e.g., dev, prod)."
  type        = string
}

variable "project_name" {
  description = "Name of the project."
  type        = string
}
