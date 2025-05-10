output "secret_arns" {
  description = "Map of secret names to their ARNs"
  value       = { for k, v in aws_secretsmanager_secret.secret : k => v.arn }
}

output "secrets_access_policy_arn" {
  description = "ARN of the IAM policy for accessing secrets"
  value       = aws_iam_policy.secrets_access.arn
} 