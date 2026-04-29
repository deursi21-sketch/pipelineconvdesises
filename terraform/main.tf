terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Security Group
resource "aws_security_group" "currency_app_sg" {
  name        = "currency-app-sg"
  description = "Security group for Currency Converter App"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend React (port 3000)"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend Node.js (port 5000)"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "currency-app-sg"
  }
}

# EC2 Instance - Ubuntu 24.04 LTS
resource "aws_instance" "currency_app" {
  ami                    = "ami-0a0e5d9c7acc336f1" # Ubuntu 24.04 LTS us-east-1
  instance_type          = "t2.large"
  key_name               = "vockey"
  vpc_security_group_ids = [aws_security_group.currency_app_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "currency-converter-app"
    Env  = "production"
  }
}

# Elastic IP pour avoir une IP stable
resource "aws_eip" "currency_app_eip" {
  instance = aws_instance.currency_app.id
  domain   = "vpc"

  tags = {
    Name = "currency-app-eip"
  }
}
