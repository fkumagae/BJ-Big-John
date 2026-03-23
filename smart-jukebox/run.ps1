$ErrorActionPreference = 'Stop'

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

function Resolve-PythonCommand {
    if (Get-Command py -ErrorAction SilentlyContinue) { return 'py' }
    if (Get-Command python -ErrorAction SilentlyContinue) { return 'python' }
    throw 'Python não encontrado no PATH.'
}

$PythonCmd = Resolve-PythonCommand
$VenvDir = Join-Path $RootDir '.venv'
$ActivateScript = Join-Path $VenvDir 'Scripts\Activate.ps1'

if (-not (Test-Path $ActivateScript)) {
    Write-Host '[1/4] Criando ambiente virtual (.venv)'
    & $PythonCmd -m venv $VenvDir
} else {
    Write-Host '[1/4] Ambiente virtual já existe (.venv)'
}

Write-Host '[2/4] Ativando ambiente virtual'
. $ActivateScript

Write-Host '[3/4] Atualizando pip e instalando dependências'
python -m pip install --upgrade pip

function Install-RequirementsIfNotEmpty([string]$ReqPath) {
    if (-not (Test-Path $ReqPath)) { return $false }

    $lines = Get-Content $ReqPath | Where-Object {
        $_.Trim() -ne '' -and -not $_.Trim().StartsWith('#')
    }

    if ($lines.Count -gt 0) {
        Write-Host "Instalando dependências de $ReqPath"
        python -m pip install -r $ReqPath
        return $true
    }

    return $false
}

$installedAny = $false
if (Install-RequirementsIfNotEmpty (Join-Path $RootDir 'software\backend\api\requirements.txt')) { $installedAny = $true }
if (Install-RequirementsIfNotEmpty (Join-Path $RootDir 'software\scripts\requirements.txt')) { $installedAny = $true }

if (-not $installedAny) {
    Write-Host 'Nenhum requirements preenchido. Instalando dependências padrão.'
    python -m pip install flask flask-cors pygame mutagen
}

Write-Host '[4/5] Iniciando API'
$apiJob = Start-Job -ScriptBlock {
    param($RootDir)
    python (Join-Path $RootDir 'software\backend\api\app.py')
} -ArgumentList $RootDir

Write-Host '[5/5] Iniciando Frontend (http.server)'
$frontendJob = Start-Job -ScriptBlock {
    param($RootDir)
    Set-Location $RootDir
    python -m http.server 8000
} -ArgumentList $RootDir

Write-Host 'Backend: http://localhost:5000'
Write-Host 'Frontend: http://localhost:8000/software/frontend/interface_jukebox/'
Write-Host 'Para encerrar, use: Get-Job | Stop-Job'
