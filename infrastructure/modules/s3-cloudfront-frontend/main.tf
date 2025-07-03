
resource "aws_s3_bucket" "frontend_bucket" {
    bucket = "${var.project_name}-${var.env}-frontend-${random_string.suffix.id}"

    tags = {
        Name = "${var.project_name}-${var.env}-frontend-bucket"
        Environment = var.env
        Project = var.project_name
    }
}

resource "aws_s3_bucket_public_access_block" "frontend_bucket_public_access_block" {
    bucket = aws_s3_bucket.frontend_bucket.id

    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_identity" "frontend_oai" {
    comment = "OAI for ${var.project_name}-${var.env} frontend CloudFront distribution"
}

resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
    bucket = aws_s3_bucket.frontend_bucket.id
    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    AWS = aws_cloudfront_origin_access_identity.frontend_oai.iam_arn
                },
                Action = "s3:GetObject",
                Resource = [
                    "${aws_s3_bucket.frontend_bucket.arn}/*",
                    "${aws_s3_bucket.frontend_bucket.arn}",
                ],
            },
        ],
    })
}

resource "aws_cloudfront_distribution" "frontend_distribution" {
    origin {
        domain_name = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
        origin_id = "S3-moviemator-frontend"
        s3_origin_config {
            origin_access_identity = aws_cloudfront_origin_access_identity.frontend_oai.cloudfront_access_identity_path
        }
    }

    enabled = true
    is_ipv6_enabled = true
    comment = "CloudFront distribution for ${var.project_name}-${var.env} frontend"
    default_root_object = "index.html"

    default_cache_behavior {
        allowed_methods = ["GET", "HEAD", "OPTIONS"]
        cached_methods = ["GET", "HEAD", "OPTIONS"]
        target_origin_id = "S3-moviemator-frontend"
        viewer_protocol_policy = "allow-all"
        min_ttl = 0
        default_ttl = 86400
        max_ttl = 31536000
        compress = true
        forwarded_values {
            query_string = true
            cookies {
                forward = "none"
            }
            headers = ["Origin"]
        }
    }

    custom_error_response {
        error_code = 403
        response_page_path = "/index.html"
        response_code = 200
        error_caching_min_ttl = 300
    }
    custom_error_response {
        error_code = 400
        response_page_path = "/index.html"
        response_code = 200
        error_caching_min_ttl = 300
    }
    
    viewer_certificate {
        cloudfront_default_certificate = true
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    tags = {
        Name = "${var.project_name}-${var.env}-frontend-cf"
        Environment = var.env
        Project = var.project_name
    }
}

resource "random_string" "suffix" {
    length = 8
    special = false
    upper = false
    numeric = true
}