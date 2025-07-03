output "connection_arn" {
    description = "ARN of the CodeStar Connection"
    value = aws_codestarconnections_connection.github_connection.arn
}

output "connection_name" {
    description = "Name of the CodeStar Connection"
    value = aws_codestarconnections_connection.github_connection.name
}