output "alb_dns_name" {
  description = "DNS name of the ALB"
  value       = aws_lb.main.dns_name
}

output "security_group_id" {
  description = "Security group ID of the ALB"
  value       = aws_security_group.alb.id
}

output "target_group_arns" {
  description = "Map of service names to target group ARNs"
  value       = { for k, v in aws_lb_target_group.service : k => v.arn }
} 