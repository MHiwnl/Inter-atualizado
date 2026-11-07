# Para banco, API e site do TaskGO. Os dados do banco ficam guardados.
# Uso, na raiz do projeto:  .\parar.ps1
Set-Location $PSScriptRoot
docker compose stop
Write-Host 'TaskGO parado. Para subir de novo: .\iniciar.ps1' -ForegroundColor Green
