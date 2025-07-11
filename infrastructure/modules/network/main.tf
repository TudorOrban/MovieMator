resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name        = "${var.env}-vpc"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name        = "${var.env}-igw"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name        = "${var.env}-public-subnet-${count.index + 1}"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = {
    Name        = "${var.env}-private-subnet-${count.index + 1}"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name        = "${var.env}-public-rt"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_route" "public_internet_gateway" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  count  = length(var.private_subnet_cidrs)
  vpc_id = aws_vpc.main.id
  tags = {
    Name        = "${var.env}-private-rt"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

data "aws_availability_zones" "available" {
  state = "available"
}

# NAT Gateway
resource "aws_eip" "nat" {
  # count = length(var.public_subnet_cidrs)
  tags = {
    # Name        = "${var.env}-nat-eip-${count.index + 1}"
    Name        = "${var.env}-nat-eip"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_nat_gateway" "main" {
  # count         = length(var.public_subnet_cidrs)
  # allocation_id = aws_eip.nat[count.index].id
  # subnet_id     = aws_subnet.public[count.index].id
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  tags = {
    # Name        = "${var.env}-nat-gateway-${count.index + 1}"
    Name        = "${var.env}-nat-gateway"
    Environment = var.env
    Project     = var.project_name
  }
  depends_on = [aws_internet_gateway.main]
}

resource "aws_route" "private_nat_gateway" {
  count                  = length(var.private_subnet_cidrs)
  route_table_id         = aws_route_table.private[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  # nat_gateway_id         = aws_nat_gateway.main[count.index].id
  nat_gateway_id = aws_nat_gateway.main.id
  depends_on     = [aws_nat_gateway.main]
}

resource "aws_vpc_endpoint" "s3_gateway" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.region}.s3"
  vpc_endpoint_type = "Gateway"

  route_table_ids = [for rt in aws_route_table.private : rt.id]

  tags = {
    Name        = "${var.env}-${var.project_name}-s3-vpc-endpoint"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_security_group" "codedeploy_endpoint_sg" {
  name        = "${var.env}-${var.project_name}-codedeploy-endpoint-sg"
  description = "Allows inbound HTTPS for CodeDeploy VPC Endpoint"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.private_subnet_cidrs
    description = "Allow HTTPS from private subnets for CodeDeploy commands"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "${var.env}-${var.project_name}-codedeploy-endpoint-sg"
    Environment = var.env
    Project     = var.project_name
  }
}

resource "aws_vpc_endpoint" "codedeploy_commands_interface" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.region}.codedeploy-commands-secure"
  vpc_endpoint_type = "Interface"

  subnet_ids = [for s in aws_subnet.private : s.id]

  security_group_ids = [aws_security_group.codedeploy_endpoint_sg.id]

  private_dns_enabled = true

  tags = {
    Name        = "${var.env}-${var.project_name}-codedeploy-commands-vpc-endpoint"
    Environment = var.env
    Project     = var.project_name
  }
}
