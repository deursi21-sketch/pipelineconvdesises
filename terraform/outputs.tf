output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.currency_app.id
}

output "public_ip" {
  description = "Elastic IP publique de l'instance"
  value       = aws_eip.currency_app_eip.public_ip
}

output "app_url" {
  description = "URL de l'application frontend"
  value       = "http://${aws_eip.currency_app_eip.public_ip}:3000"
}

output "backend_url" {
  description = "URL de l'API backend"
  value       = "http://${aws_eip.currency_app_eip.public_ip}:5000"
}

output "ssh_command" {
  description = "Commande SSH pour se connecter"
  value       = "ssh -i vockey.pem ubuntu@${aws_eip.currency_app_eip.public_ip}"
}
