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