output "certificate_arn" {
  description = "The ARN of the certificate"
  value       = aws_acm_certificate.cert.arn
}

output "certificate_domain_name" {
  description = "The domain name for the certificate"
  value       = aws_acm_certificate.cert.domain_name
}

output "certificate_status" {
  description = "The status of the certificate"
  value       = aws_acm_certificate.cert.status
}

output "certificate_validation_arn" {
  description = "The ARN of the certificate validation"
  value       = aws_acm_certificate_validation.cert.certificate_arn
}

output "certificate_validation_record_fqdns" {
  description = "The FQDNs of the certificate validation records"
  value       = aws_acm_certificate_validation.cert.validation_record_fqdns
}

output "lambda_function_arn" {
  description = "The ARN of the Lambda function for certificate renewal"
  value       = aws_lambda_function.certificate_renewal.arn
}

output "lambda_function_name" {
  description = "The name of the Lambda function for certificate renewal"
  value       = aws_lambda_function.certificate_renewal.function_name
}

output "validation_records" {
  description = "DNS records used for certificate validation"
  value       = aws_route53_record.cert_validation
} 