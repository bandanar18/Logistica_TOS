# Script de Verificación de Salud (Health Check) - Marketplace Logístico

echo "Verificando estado de los servicios..."

# Backend Health
echo "Backend Liveness: "
curl -s http://localhost:3000/api/v1/health | Select-String -Pattern "UP"

# Database Health
echo "Database Connectivity: "
curl -s http://localhost:3000/api/v1/health/db | Select-String -Pattern "UP"

# Frontend Liveness (Check if port is open)
echo "Frontend Liveness (Port 5173): "
Test-NetConnection -ComputerName localhost -Port 5173 | Select-Object -Property TcpTestSucceeded

echo "Verificación completada."
