output "task_definition_arns" {
  description = "Map of service names to task definition ARNs"
  value       = { for k, v in aws_ecs_task_definition.service : k => v.arn }
}

output "service_names" {
  description = "Map of service names to ECS service names"
  value       = { for k, v in aws_ecs_service.service : k => v.name }
}

output "task_execution_role_arn" {
  description = "ARN of the task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "task_role_arn" {
  description = "ARN of the task role"
  value       = aws_iam_role.ecs_task_role.arn
}

output "security_group_id" {
  description = "ID of the security group for ECS tasks"
  value       = aws_security_group.ecs_tasks.id
} 