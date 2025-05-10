variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
}

variable "postgres_password" {
  description = "Password for PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "timescale_password" {
  description = "Password for TimescaleDB database"
  type        = string
  sensitive   = true
}

variable "redis_password" {
  description = "Password for Redis"
  type        = string
  sensitive   = true
}

variable "nats_password" {
  description = "Password for NATS"
  type        = string
  sensitive   = true
} 