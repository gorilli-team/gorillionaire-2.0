locals {
  services = {
    oracle_price = {
      port     = 8080
      protocol = "HTTP"
      health_check_path = "/health"
    }
    events_worker = {
      port     = 8081
      protocol = "HTTP"
      health_check_path = "/health"
    }
    signal_generator = {
      port     = 8082
      protocol = "HTTP"
      health_check_path = "/health"
    }
    nats = {
      port     = 4222
      protocol = "TCP"
      health_check_path = null
    }
    timescale = {
      port     = 5432
      protocol = "TCP"
      health_check_path = null
    }
    postgres = {
      port     = 5432
      protocol = "TCP"
      health_check_path = null
    }
    redis = {
      port     = 6379
      protocol = "TCP"
      health_check_path = null
    }
  }
}

# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = local.services
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol == "HTTP" ? "tcp" : ingress.value.protocol
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-alb-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids

  tags = {
    Name        = "${var.project_name}-${var.environment}-alb"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Target Groups
resource "aws_lb_target_group" "service" {
  for_each = local.services

  name        = "${var.project_name}-${var.environment}-${each.key}-tg"
  port        = each.value.port
  protocol    = each.value.protocol
  vpc_id      = var.vpc_id
  target_type = "ip"

  dynamic "health_check" {
    for_each = each.value.health_check_path != null ? [1] : []
    content {
      enabled             = true
      healthy_threshold   = 2
      interval            = 30
      matcher            = "200"
      path               = each.value.health_check_path
      port               = "traffic-port"
      protocol           = "HTTP"
      timeout            = 5
      unhealthy_threshold = 2
    }
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-${each.key}-tg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# HTTP Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

# Listener Rules for HTTP Services
resource "aws_lb_listener_rule" "http_service" {
  for_each = { for k, v in local.services : k => v if v.protocol == "HTTP" }

  listener_arn = aws_lb_listener.https.arn
  priority     = index(keys(local.services), each.key) + 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service[each.key].arn
  }

  condition {
    host_header {
      values = ["${each.key}.${var.domain_name}"]
    }
  }
} 