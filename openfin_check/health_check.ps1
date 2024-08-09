# Define o caminho para o diretório de runtimes
$runtimePath = "$env:LOCALAPPDATA\OpenFin\runtime"

# Verifica se o diretório existe
if (-Not (Test-Path -Path $runtimePath)) {
    Write-Host "O diretório especificado não existe: $runtimePath"
    exit
}

# Define um dicionário para mapear versões aos seus checksums
$checksums = @{
    "38.126.82.64" = "26852CC443EC5B0F90214C1A0842B83EF80B9EBFAACE9BE175B0B74E368E4988"
    "38.126.82.61" = "CF8977FB8FA0A9831D396D49FA6878927AB4F02DA1F581FC66BD6A83A2AAE2EF"
    "37.124.81.30" = "0E9D2CCC362697F9324BC470FB0CC9EA9EB831B174CF4643BDF202F14EF8D680"
    "37.124.81.26" = "24791828A0D33B044EB9E77DFB5B3C4517B89285A8C40CB1F2485941CF29AF90"
}

# Obtém todas as pastas dentro do diretório de runtime
$folders = Get-ChildItem -Path $runtimePath -Directory

# Verifica se há pastas de versão
if ($folders.Count -gt 0) {
    foreach ($folder in $folders) {
        $version = $folder.Name
        $openfinExePath = Join-Path -Path $folder.FullName -ChildPath "OpenFin\openfin.exe"

        if (Test-Path -Path $openfinExePath) {
            # Calcula o checksum do arquivo openfin.exe
            $calculatedChecksum = Get-FileHash -Algorithm SHA256 -Path $openfinExePath | Select-Object -ExpandProperty Hash

            Write-Host "Versão: $version"
            Write-Host "Checksum calculado: $calculatedChecksum"

            # Verifica se há um checksum esperado para esta versão
            if ($checksums.ContainsKey($version)) {
                $expectedChecksum = $checksums[$version]

                if ($calculatedChecksum -eq $expectedChecksum) {
                    Write-Host "Checksum corresponde ao esperado." -ForegroundColor Green
                } else {
                    Write-Host "Checksum NÃO corresponde ao esperado!" -ForegroundColor Red
                    Write-Host "Checksum esperado: $expectedChecksum" -ForegroundColor Red
                }
            } else {
                Write-Host "Não há checksum esperado definido para esta versão." -ForegroundColor Yellow
            }
        } else {
            Write-Host "Arquivo openfin.exe não encontrado na pasta $version." -ForegroundColor Yellow
        }

        Write-Host "-----------------------------"
    }
} else {
    Write-Host "Nenhuma pasta de versão encontrada no diretório OpenFin Runtime."
}

# Pausa para manter a janela aberta até que o usuário pressione uma tecla
Read-Host "Pressione qualquer tecla para sair"
