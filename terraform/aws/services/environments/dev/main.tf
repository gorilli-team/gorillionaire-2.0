
module "ecs_tasks" {
  source = "../../modules/ecs-task"

  project_name          = var.project_name
  environment          = var.environment
  vpc_id               = module.vpc.vpc_id
  private_subnet_ids   = module.vpc.private_subnet_ids
  ecs_cluster_id       = module.ecs.cluster_id
  ecr_repository_url   = module.ecr.repository_url
  alb_security_group_id = module.alb.security_group_id
  alb_target_group_arns = module.alb.target_group_arns
  cloudwatch_log_group_name = var.cloudwatch_log_group_name
  aws_region           = var.aws_region

  postgres_secret_arn  = module.secrets.secret_arns["postgres"]
  timescale_secret_arn = module.secrets.secret_arns["timescale"]
  redis_secret_arn     = module.secrets.secret_arns["redis"]
  nats_secret_arn      = module.secrets.secret_arns["nats"]

  services = local.services
} 