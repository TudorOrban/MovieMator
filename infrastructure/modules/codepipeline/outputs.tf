output "pipeline_name" {
    description = "Name of the CodePipeline"
    value = aws_codepipeline.main_pipeline.name
}

output "pipeline_arn" {
    description = "ARN of the CodePipeline"
    value = aws_codepipeline.main_pipeline.arn
}