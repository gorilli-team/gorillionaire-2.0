terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "../../modules/vpc"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
}

module "ecr" {
  source = "../../modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

module "ecs" {
  source = "../../modules/ecs"

  project_name = var.project_name
  environment  = var.environment
}

module "certificate" {
  source = "../../modules/certificate"

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name
  route53_zone_id = var.route53_zone_id
}

module "alb" {
  source = "../../modules/alb"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  domain_name       = var.domain_name
  certificate_arn   = module.certificate.certificate_validation_arn
}

module "secrets" {
  source = "../../modules/secrets"

  project_name       = var.project_name
  environment        = var.environment
  postgres_password  = var.postgres_password
  timescale_password = var.timescale_password
  redis_password     = var.redis_password
  nats_password      = var.nats_password
}
