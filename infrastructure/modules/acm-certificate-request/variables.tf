variable "domain_name" {
  description = "The domain name for the certificate."
  type        = string
}

variable "subject_alternative_names" {
  description = "(Optional) A list of subject alternative names for the certificate."
  type        = list(string)
  default     = []
}

variable "env" {
  description = "The environment tag."
  type        = string
}

variable "project_name" {
  description = "The project name tag."
  type        = string
}
