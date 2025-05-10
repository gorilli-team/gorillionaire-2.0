# variable "postgres_secret_arn" {
#   description = "ARN of the PostgreSQL secret in AWS Secrets Manager"
#   type        = string
# }

# variable "timescale_secret_arn" {
#   description = "ARN of the TimescaleDB secret in AWS Secrets Manager"
#   type        = string
# }

# variable "redis_secret_arn" {
#   description = "ARN of the Redis secret in AWS Secrets Manager"
#   type        = string
# }

# variable "nats_secret_arn" {
#   description = "ARN of the NATS secret in AWS Secrets Manager"
#   type        = string
# }

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "gorillionaire"
}

variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
  default     = "development"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-east-1a"]
}

# variable "domain_name" {
#   description = "Domain name for the ALB"
#   type        = string
#   default     = "dev.gorillionai.re"
# }

# variable "route53_zone_id" {
#   description = "ID of the Route53 hosted zone for DNS validation"
#   type        = string
# }

# variable "certificate_arn" {
#   description = "ARN of the SSL certificate for the ALB"
#   type        = string
# }

# variable "cloudwatch_log_group_name" {
#   description = "Name of the CloudWatch log group"
#   type        = string
#   default     = "/ecs/gorillionaire-dev"
# }

# variable "postgres_password" {
#   description = "Password for PostgreSQL database"
#   type        = string
#   sensitive   = true
# }

# variable "timescale_password" {
#   description = "Password for TimescaleDB database"
#   type        = string
#   sensitive   = true
# }

# variable "redis_password" {
#   description = "Password for Redis"
#   type        = string
#   sensitive   = true
# }

# variable "nats_password" {
#   description = "Password for NATS"
#   type        = string
#   sensitive   = true
# } 