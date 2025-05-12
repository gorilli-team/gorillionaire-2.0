output "nats_instance_id" {
  value = aws_instance.nats.id
}

output "nats_private_ip" {
  value = aws_instance.nats.private_ip
} 
