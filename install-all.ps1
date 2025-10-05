# Instala todas las dependencias de los microservicios y frontend
# Ejecuta este script desde la raíz del proyecto: powershell -ExecutionPolicy Bypass -File install-all.ps1

Write-Host "Instalando dependencias del frontend..." -ForegroundColor Cyan
cd frontend
npm install
cd ..

$services = @(
    "services/startups/create",
    "services/startups/read",
    "services/startups/update",
    "services/startups/delete",
    "services/technologies/create",
    "services/technologies/read",
    "services/technologies/update",
    "services/technologies/delete"
)

foreach ($svc in $services) {
    Write-Host "Instalando dependencias en $svc..." -ForegroundColor Cyan
    cd $svc
    npm install
    cd ../../../..
}

Write-Host "¡Listo! Todas las dependencias han sido instaladas." -ForegroundColor Green
