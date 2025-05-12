resource "aws_iam_service_linked_role" "ecs" {
  aws_service_name = "ecs.amazonaws.com"

  depends_on = [
    aws_ecs_cluster.main
  ]
}