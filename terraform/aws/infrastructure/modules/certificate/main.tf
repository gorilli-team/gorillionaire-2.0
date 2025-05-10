locals {
  # Add wildcard domain if enabled
  domain_names = var.use_wildcard ? 
    concat([var.domain_name, "*.${var.domain_name}"], var.subject_alternative_names) :
    concat([var.domain_name], var.subject_alternative_names)

  # Merge default tags with additional tags
  certificate_tags = merge(
    {
      Name        = "${var.project_name}-${var.environment}-cert"
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

resource "aws_acm_certificate" "cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  # Add wildcard domain if enabled
  subject_alternative_names = var.use_wildcard ? 
    concat(["*.${var.domain_name}"], var.subject_alternative_names) :
    var.subject_alternative_names

  lifecycle {
    create_before_destroy = true
  }

  tags = local.certificate_tags
}

# Certificate renewal event rule
resource "aws_cloudwatch_event_rule" "certificate_renewal" {
  name                = "${var.project_name}-${var.environment}-cert-renewal"
  description         = "Trigger certificate renewal before expiration"
  schedule_expression = "rate(1 day)"
  is_enabled         = true

  tags = local.certificate_tags
}

# Lambda function to check certificate expiration and trigger renewal
resource "aws_lambda_function" "certificate_renewal" {
  filename         = "${path.module}/lambda/certificate_renewal.zip"
  function_name    = "${var.project_name}-${var.environment}-cert-renewal"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 300
  memory_size     = 128

  environment {
    variables = {
      CERTIFICATE_ARN = aws_acm_certificate.cert.arn
      GRACE_PERIOD   = var.renewal_grace_period
    }
  }

  tags = local.certificate_tags
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-${var.environment}-cert-renewal-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.certificate_tags
}

# IAM policy for Lambda to manage certificates
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.project_name}-${var.environment}-cert-renewal-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "acm:DescribeCertificate",
          "acm:RenewCertificate",
          "acm:RequestCertificate"
        ]
        Resource = aws_acm_certificate.cert.arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# CloudWatch Event target
resource "aws_cloudwatch_event_target" "certificate_renewal" {
  rule      = aws_cloudwatch_event_rule.certificate_renewal.name
  target_id = "CertificateRenewal"
  arn       = aws_lambda_function.certificate_renewal.arn
}

# Lambda permission for CloudWatch Events
resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.certificate_renewal.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.certificate_renewal.arn
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# Create DNS records for certificate validation
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.route53_zone_id
} 