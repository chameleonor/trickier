$runtimePath = "$env:LOCALAPPDATA\OpenFin\runtime"

# Inicializa o dicionário de status para monitorar o progresso do checklist
$status = @{
    "RuntimeFolderExists" = "pending"
    "ChecksumsVerification" = "pending"
    "OtherStep1" = "pending"
    "OtherStep2" = "pending"
}

function CheckRuntimeFolder {
    if (-Not (Test-Path -Path $runtimePath)) {
        Write-Host "The runtime folder does not exist: $runtimePath" -ForegroundColor Red
        $status["RuntimeFolderExists"] = "failed"
        return $false
    } else {
        Write-Host "Runtime folder exists: $runtimePath" -ForegroundColor Green
        $status["RuntimeFolderExists"] = "done"
        return $true
    }
}

function VerifyChecksums {
    $checksums = @{
        "38.126.82.64" = "26852CC443EC5B0F90214C1A0842B83EF80B9EBFAACE9BE175B0B74E368E4988"
        "38.126.82.61" = "CF8977FB8FA0A9831D396D49FA6878927AB4F02DA1F581FC66BD6A83A2AAE2EF"
        "37.124.81.30" = "0E9D2CCC362697F9324BC470FB0CC9EA9EB831B174CF4643BDF202F14EF8D680"
        "37.124.81.26" = "24791828A0D33B044EB9E77DFB5B3C4517B89285A8C40CB1F2485941CF29AF90"
    }

    $folders = Get-ChildItem -Path $runtimePath -Directory

    if ($folders.Count -gt 0) {
        foreach ($folder in $folders) {
            $version = $folder.Name
            $openfinExePath = Join-Path -Path $folder.FullName -ChildPath "OpenFin\openfin.exe"

            if (Test-Path -Path $openfinExePath) {
                $calculatedChecksum = Get-FileHash -Algorithm SHA256 -Path $openfinExePath | Select-Object -ExpandProperty Hash

                Write-Host "Version: $version"
                Write-Host "Checksum calculated: $calculatedChecksum"

                if ($checksums.ContainsKey($version)) {
                    $expectedChecksum = $checksums[$version]

                    if ($calculatedChecksum -eq $expectedChecksum) {
                        Write-Host "Checksum matches as expected." -ForegroundColor Green
                    } else {
                        Write-Host "Checksum does not match!" -ForegroundColor Red
                        Write-Host "Checksum expected is: $expectedChecksum" -ForegroundColor Red
                    }
                } else {
                    Write-Host "No expected checksum found on the list, please generate it before comparing." -ForegroundColor Yellow
                }
            } else {
                Write-Host "The openfin.exe file was not found for this version: $version." -ForegroundColor Yellow
            }

            Write-Host "-----------------------------"
        }

        $status["ChecksumsVerification"] = "done"
    } else {
        Write-Host "No folders found inside OpenFin Runtime."
        $status["ChecksumsVerification"] = "failed"
    }
}

# Funções adicionais para outras etapas podem ser definidas aqui
function OtherStep1 {
    Write-Host "Executing OtherStep1..." -ForegroundColor Cyan
    # Lógica para a etapa 1
    $status["OtherStep1"] = "done"
}

function OtherStep2 {
    Write-Host "Executing OtherStep2..." -ForegroundColor Cyan
    # Lógica para a etapa 2
    $status["OtherStep2"] = "done"
}

# Executando as funções (checklist)
if (CheckRuntimeFolder) {
    VerifyChecksums
}

# Executar outras etapas do checklist
OtherStep1
OtherStep2

# Exibir o status final do checklist
Write-Host "`nChecklist Status:"
$status.GetEnumerator() | ForEach-Object { Write-Host "$($_.Key): $($_.Value)" }
