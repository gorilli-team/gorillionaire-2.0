module "vpc" {
  source = "./modules/vpc"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
}

module "nat" {
  source = "./modules/nat"

  vpc_id       = module.vpc.vpc_id
  project_name = var.project_name
  environment  = var.environment
} 