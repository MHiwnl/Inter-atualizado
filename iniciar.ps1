# Sobe banco, API e site do TaskGO e abre o navegador.
# Uso, na raiz do projeto:  .\iniciar.ps1
# Se o PowerShell bloquear scripts:  powershell -ExecutionPolicy Bypass -File .\iniciar.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$site = 'http://localhost:3000'

function Escrever($texto) { Write-Host "-> $texto" -ForegroundColor Cyan }
# Roda o docker sem mostrar a saída; o PowerShell 5.1 trataria mensagens de erro do docker como exceção.
function DockerQuieto($argumentos) { cmd /c "docker $argumentos >nul 2>&1"; return ($LASTEXITCODE -eq 0) }

# 1. Docker aberto?
if (-not (DockerQuieto 'info')) {
    # Instalação para todos os usuários ou só para o usuário atual.
    $desktop = @(
        (Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe'),
        (Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\Docker Desktop.exe')
    ) | Where-Object { Test-Path $_ } | Select-Object -First 1
    if (-not $desktop) { throw 'Docker não encontrado. Instale o Docker Desktop: https://www.docker.com/products/docker-desktop/' }
    Escrever 'Abrindo o Docker Desktop (pode levar 1 minuto)...'
    Start-Process $desktop
    $limite = (Get-Date).AddMinutes(3)
    do { Start-Sleep -Seconds 3; $ok = DockerQuieto 'info' } while (-not $ok -and (Get-Date) -lt $limite)
    if (-not $ok) { throw 'O Docker Desktop não respondeu. Abra-o manualmente e rode o script de novo.' }
}

# 2. Arquivo .env com a senha do banco (criado uma única vez, com senha aleatória).
if (-not (Test-Path .env)) {
    Escrever 'Criando o arquivo .env com uma senha aleatória para o banco...'
    $bytes = New-Object byte[] 24
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $senha = [Convert]::ToBase64String($bytes) -replace '[+/=]', ''
    Set-Content -Path .env -Encoding ascii -Value "DB_PASSWORD=$senha"
} elseif (-not (Select-String -Path .env -Pattern '^DB_PASSWORD=.+' -Quiet)) {
    throw 'O arquivo .env existe, mas não tem DB_PASSWORD. Adicione a linha DB_PASSWORD=sua-senha.'
}

# 3. Contêineres do roteiro antigo usam o mesmo banco: param antes, para não abrirem os dados ao mesmo tempo.
foreach ($antigo in 'taskgo-dev-api', 'taskgo-dev-db') {
    if (DockerQuieto "inspect $antigo") {
        Escrever "Parando o contêiner antigo $antigo (os dados ficam guardados)..."
        DockerQuieto "update --restart=no $antigo" | Out-Null
        DockerQuieto "stop $antigo" | Out-Null
    }
}

# 4. Sobe tudo. A primeira vez compila a API e leva alguns minutos.
Escrever 'Subindo banco, API e site...'
docker compose up -d --build
if ($LASTEXITCODE -ne 0) { throw 'O docker compose falhou. Veja a mensagem acima.' }

# 5. Espera a API responder.
Escrever 'Esperando a API ficar pronta...'
$limite = (Get-Date).AddMinutes(4)
$pronta = $false
while (-not $pronta -and (Get-Date) -lt $limite) {
    try { $pronta = (Invoke-RestMethod "$site/actuator/health" -TimeoutSec 3).status -eq 'UP' } catch { Start-Sleep -Seconds 3 }
}
if (-not $pronta) { throw 'A API não respondeu. Veja os logs com: docker compose logs api' }

Write-Host ''
Write-Host "Pronto! TaskGO rodando em $site" -ForegroundColor Green
Write-Host 'Parar: .\parar.ps1   |   Logs da API: docker compose logs -f api'
Start-Process $site
