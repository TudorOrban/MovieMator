# --- Module not currently used ---

resource "aws_codestarconnections_connection" "github_connection" {
    name = "${var.env}-${var.project_name}-github-connection"
    provider_type = "GitHub"

    tags = {
        Environment = var.env
        Project     = var.project_name
    }
}