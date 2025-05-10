locals {
  services = {
    oracle_price = {
      cpu    = 256
      memory = 512
      port   = 8080
      environment = {
        NATS_URL = "nats://nats:${NATS_PASSWORD}@nats:4222"
        REDIS_URL = "redis://:${REDIS_PASSWORD}@redis:6379"
        POSTGRES_URL = "postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/gorillionaire"
        TIMESCALE_URL = "postgresql://postgres:${TIMESCALE_PASSWORD}@timescale:5432/gorillionaire"
      }
      secrets = [
        {
          name      = "POSTGRES_PASSWORD"
          valueFrom = var.postgres_secret_arn
        },
        {
          name      = "TIMESCALE_PASSWORD"
          valueFrom = var.timescale_secret_arn
        },
        {
          name      = "REDIS_PASSWORD"
          valueFrom = var.redis_secret_arn
        },
        {
          name      = "NATS_PASSWORD"
          valueFrom = var.nats_secret_arn
        }
      ]
    }
    events_worker = {
      cpu    = 256
      memory = 512
      port   = 8081
      environment = {
        NATS_URL = "nats://nats:${NATS_PASSWORD}@nats:4222"
        REDIS_URL = "redis://:${REDIS_PASSWORD}@redis:6379"
        POSTGRES_URL = "postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/gorillionaire"
        TIMESCALE_URL = "postgresql://postgres:${TIMESCALE_PASSWORD}@timescale:5432/gorillionaire"
      }
      secrets = [
        {
          name      = "POSTGRES_PASSWORD"
          valueFrom = var.postgres_secret_arn
        },
        {
          name      = "TIMESCALE_PASSWORD"
          valueFrom = var.timescale_secret_arn
        },
        {
          name      = "REDIS_PASSWORD"
          valueFrom = var.redis_secret_arn
        },
        {
          name      = "NATS_PASSWORD"
          valueFrom = var.nats_secret_arn
        }
      ]
    }
    signal_generator = {
      cpu    = 512
      memory = 1024
      port   = 8082
      environment = {
        NATS_URL = "nats://nats:${NATS_PASSWORD}@nats:4222"
        REDIS_URL = "redis://:${REDIS_PASSWORD}@redis:6379"
        POSTGRES_URL = "postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/gorillionaire"
        TIMESCALE_URL = "postgresql://postgres:${TIMESCALE_PASSWORD}@timescale:5432/gorillionaire"
      }
      secrets = [
        {
          name      = "POSTGRES_PASSWORD"
          valueFrom = var.postgres_secret_arn
        },
        {
          name      = "TIMESCALE_PASSWORD"
          valueFrom = var.timescale_secret_arn
        },
        {
          name      = "REDIS_PASSWORD"
          valueFrom = var.redis_secret_arn
        },
        {
          name      = "NATS_PASSWORD"
          valueFrom = var.nats_secret_arn
        }
      ]
    }
    nats = {
      cpu    = 256
      memory = 512
      port   = 4222
      environment = {}
      secrets = [
        {
          name      = "NATS_PASSWORD"
          valueFrom = var.nats_secret_arn
        }
      ]
    }
    timescale = {
      cpu    = 1024
      memory = 2048
      port   = 5432
      environment = {
        POSTGRES_USER = "postgres"
        POSTGRES_DB = "gorillionaire"
      }
      secrets = [
        {
          name      = "POSTGRES_PASSWORD"
          valueFrom = var.timescale_secret_arn
        }
      ]
    }
    postgres = {
      cpu    = 512
      memory = 1024
      port   = 5432
      environment = {
        POSTGRES_USER = "postgres"
        POSTGRES_DB = "gorillionaire"
      }
      secrets = [
        {
          name      = "POSTGRES_PASSWORD"
          valueFrom = var.postgres_secret_arn
        }
      ]
    }
    redis = {
      cpu    = 256
      memory = 512
      port   = 6379
      environment = {}
      secrets = [
        {
          name      = "REDIS_PASSWORD"
          valueFrom = var.redis_secret_arn
        }
      ]
    }
  }
}

# Task Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-${var.environment}-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Allow task execution role to access secrets
resource "aws_iam_role_policy" "secrets_access" {
  name = "${var.project_name}-${var.environment}-secrets-access"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          var.postgres_secret_arn,
          var.timescale_secret_arn,
          var.redis_secret_arn,
          var.nats_secret_arn
        ]
      }
    ]
  })
}

# Task Role
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-${var.environment}-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Security Groups
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project_name}-${var.environment}-ecs-tasks-sg"
  description = "Allow inbound traffic for ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [var.alb_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-tasks-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Task Definitions and Services
resource "aws_ecs_task_definition" "service" {
  for_each = var.services

  family                   = "${var.project_name}-${var.environment}-${each.key}"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = each.value.cpu
  memory                  = each.value.memory
  execution_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn           = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = each.key
      image     = "${var.ecr_repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = each.value.port
          hostPort      = each.value.port
          protocol      = "tcp"
        }
      ]
      environment = concat(
        [
          {
            name  = "ENVIRONMENT"
            value = var.environment
          }
        ],
        [
          for k, v in each.value.environment : {
            name  = k
            value = v
          }
        ]
      )
      secrets = each.value.secrets
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = var.cloudwatch_log_group_name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = each.key
        }
      }
    }
  ])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-${each.key}-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_service" "service" {
  for_each = var.services

  name            = "${var.project_name}-${var.environment}-${each.key}"
  cluster         = var.ecs_cluster_id
  task_definition = aws_ecs_task_definition.service[each.key].arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.alb_target_group_arns[each.key]
    container_name   = each.key
    container_port   = each.value.port
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-${each.key}-service"
    Environment = var.environment
    Project     = var.project_name
  }
} 