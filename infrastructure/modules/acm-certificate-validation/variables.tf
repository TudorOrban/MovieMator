variable "certificate_arn" {
  description = "The ARN of the ACM certificate to validate."
  type        = string
}

variable "domain_validation_options" {
  description = "The domain validation options from the ACM certificate."
  type = list(object({
    domain_name           = string
    resource_record_name  = string
    resource_record_type  = string
    resource_record_value = string
  }))
}

variable "route53_zone_id" {
  description = "The Route 53 Hosted Zone ID for domain validation."
  type        = string
}
