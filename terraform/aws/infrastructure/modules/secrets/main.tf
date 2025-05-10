locals {
  secrets = {
    postgres = {
      description = "PostgreSQL database credentials"
      secret_string = jsonencode({
        username = "postgres"
        password = var.postgres_password
        dbname   = "gorillionaire"
      })
    }
    timescale = {
      description = "TimescaleDB database credentials"
      secret_string = jsonencode({
        username = "postgres"
        password = var.timescale_password
        dbname   = "gorillionaire"
      })
    }
    redis = {
      description = "Redis credentials"
      secret_string = jsonencode({
        password = var.redis_password
      })
    }
    nats = {
      description = "NATS credentials"
      secret_string = jsonencode({
        username = "nats"
        password = var.nats_password
      })
    }
  }
}

resource "aws_secretsmanager_secret" "secret" {
  for_each = local.secrets

  name        = "${var.project_name}-${var.environment}-${each.key}"
  description = each.value.description

  tags = {
    Name        = "${var.project_name}-${var.environment}-${each.key}-secret"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "secret" {
  for_each = local.secrets

  secret_id     = aws_secretsmanager_secret.secret[each.key].id
  secret_string = each.value.secret_string
}

# IAM policy for ECS tasks to access secrets
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.project_name}-${var.environment}-secrets-access"
  description = "Policy for ECS tasks to access secrets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [for secret in aws_secretsmanager_secret.secret : secret.arn]
      }
    ]
  })
}
