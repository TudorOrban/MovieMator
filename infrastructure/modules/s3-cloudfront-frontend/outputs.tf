output "s3_bucket_name" {
    description = "The name of the S3 bucket hosting the frontend"
    value = aws_s3_bucket.frontend_bucket.id
}

output "s3_bucket_arn" {
    description = "The ARN of the S3 bucket hosting the frontend"
    value = aws_s3_bucket.frontend_bucket.arn
}

output "cloudfront_domain_name" {
    description = "The domain name of the CloudFront distribution"
    value = aws_cloudfront_distribution.frontend_distribution.domain_name
}

output "cloudfront_distribution_id" {
    description = "The ID of the CloudFront distribution"
    value = aws_cloudfront_distribution.frontend_distribution.id
}

output "cloudfront_distribution_arn" {
    description = "The ARN of the CloudFront distribution"
    value = aws_cloudfront_distribution.frontend_distribution.arn
}