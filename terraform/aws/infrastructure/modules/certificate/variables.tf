variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the certificate"
  type        = string
}

variable "use_wildcard" {
  description = "Whether to create a wildcard certificate (*.domain.com)"
  type        = bool
  default     = false
}

variable "subject_alternative_names" {
  description = "Additional domain names to include in the certificate"
  type        = list(string)
  default     = []
}

variable "route53_zone_id" {
  description = "ID of the Route53 hosted zone for DNS validation"
  type        = string
}

variable "renewal_grace_period" {
  description = "Number of days before expiration to start renewal"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Additional tags for the certificate"
  type        = map(string)
  default     = {}
} 