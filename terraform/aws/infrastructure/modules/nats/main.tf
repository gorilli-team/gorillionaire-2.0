resource "aws_security_group" "nats_sg" {
  name        = "${var.project_name}-${var.environment}-nats-sg"
  description = "Allow NATS cluster access"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow NATS"
    from_port   = 4222
    to_port     = 4222
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    description = "Allow HTTP monitoring"
    from_port   = 8222
    to_port     = 8222
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "nats-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

data "aws_ami" "arm_amzn2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-arm64-gp2"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "nats" {
  ami                         = data.aws_ami.arm_amzn2.id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [aws_security_group.nats_sg.id]
  associate_public_ip_address = false
  source_dest_check           = false

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y wget unzip curl

              # Install NATS server
              wget https://github.com/nats-io/nats-server/releases/download/v2.10.1/nats-server-v2.10.1-linux-arm64.zip
              unzip nats-server-v2.10.1-linux-arm64.zip
              cp nats-server-v2.10.1-linux-arm64/nats-server /usr/local/bin/

              # Install NATS CLI
              curl -L -o /usr/local/bin/nats https://github.com/nats-io/natscli/releases/download/v0.1.4/nats-0.1.4-linux-arm64
              chmod +x /usr/local/bin/nats

              # Write stream config
              mkdir -p /etc/nats

              # Write NATS config
              cat <<EOC > /etc/nats/nats.conf
              server_name: ${var.project_name}-${var.environment}-nats
              jetstream {
                    store_dir: /data/jetstream
                    max_mem_store: 1Gb
                    max_file_store: 10Gb
                    domain: "${var.project_name}-${var.environment}"
            }
              port: 4222
              http_port: 8222
              EOC

              # Write stream config
              cat <<EOC > /etc/nats/gorillionaire.stream.conf
                {
                    "name": "gorillionaire",
                    "subjects": [ "gorillionaire.envio.>", "gorillionaire.db.>", "gorillionaire.oracle.>" ],
                    "storage": "file",
                    "retention": "limits",
                    "max_msgs": 10000,
                    "max_bytes": 104857600,
                    "discard": "old",
                    "duplicates": "1m",
                    "num_replicas": 1,
                    "consumers": [
                        {
                            "durable_name": "oracle-pair",
                            "deliver_subject": "gorillionaire.oracle.pair.*",
                            "ack_policy": "explicit",
                            "max_ack_pending": 1000
                        },
                        {
                            "durable_name": "envio-price",
                            "deliver_subject": "gorillionaire.envio.price",
                            "ack_policy": "explicit",
                            "max_ack_pending": 1000
                        },
                        {
                            "durable_name": "envio-newpair",
                            "deliver_subject": "gorillionaire.envio.newpair",
                            "ack_policy": "explicit",
                            "max_ack_pending": 1000
                        },
                        {
                            "durable_name": "db-price",
                            "deliver_subject": "gorillionaire.db.price",
                            "ack_policy": "explicit",
                            "max_ack_pending": 1000
                        },
                        {
                            "durable_name": "db-newpair",
                            "deliver_subject": "gorillionaire.db.newpair",
                            "ack_policy": "explicit",
                            "max_ack_pending": 1000
                        }
                    ]
                }

              EOC

              # Start NATS with JetStream
              nohup nats-server -js -m 8222 > /var/log/nats.log 2>&1 &

              # Wait for NATS to boot up
              sleep 5

              # Configure stream
              nats -s nats://localhost:4222 stream info gorillionaire >/dev/null 2>&1 && \
              nats -s nats://localhost:4222 stream update gorillionaire --config /etc/nats/gorillionaire.stream.conf --force || \
              nats -s nats://localhost:4222 stream add --config /etc/nats/gorillionaire.stream.conf
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-nats"
    Environment = var.environment
    Project     = var.project_name
  }
}
