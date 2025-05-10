variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "ecs_cluster_id" {
  description = "ID of the ECS cluster"
  type        = string
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  type        = string
}

variable "alb_security_group_id" {
  description = "ID of the ALB security group"
  type        = string
}

variable "alb_target_group_arns" {
  description = "Map of service names to ALB target group ARNs"
  type        = map(string)
}

variable "postgres_secret_arn" {
  description = "ARN of the PostgreSQL secret in AWS Secrets Manager"
  type        = string
}

variable "timescale_secret_arn" {
  description = "ARN of the TimescaleDB secret in AWS Secrets Manager"
  type        = string
}

variable "redis_secret_arn" {
  description = "ARN of the Redis secret in AWS Secrets Manager"
  type        = string
}

variable "nats_secret_arn" {
  description = "ARN of the NATS secret in AWS Secrets Manager"
  type        = string
}

variable "services" {
  description = "Map of service configurations"
  type = map(object({
    cpu    = number
    memory = number
    port   = number
    environment = map(string)
    secrets = list(object({
      name      = string
      valueFrom = string
    }))
  }))
} 