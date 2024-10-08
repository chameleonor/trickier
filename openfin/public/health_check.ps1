[System.Net.WebRequest]::DefaultWebProxy = [System.Net.WebRequest]::GetSystemWebProxy()
[System.Net.WebRequest]::DefaultWebProxy.Credentials = [System.Net.CredentialCache]::DefaultNetworkCredentials

$runtimePath = "$env:LOCALAPPDATA\OpenFin\runtime"

$DONE="ok"
$PENDING="pending"
$FAILED="failed"
$OPENFIN_CHECKSUM_BASE_URI="https://cdn.openfin.co/versions/fetchChecksum?url=https://cdn.openfin.co/release/meta/runtime/virustotal/win/x64"

$status = @{
    "RuntimeFolderExists" = $PENDING
    "ChecksumsVerification" = $PENDING
    "CDNValidation" = $PENDING
    "ThirdStep" = $PENDING
}

function CheckRuntimeFolder {
   if (-Not (Test-Path -Path $runtimePath)) {
        Write-Host "The runtime folder does not exist: $runtimePath" -ForegroundColor Red
        Write-Host "Creating the runtime folder..." -ForegroundColor Yellow
        
        New-Item -Path $runtimePath -ItemType Directory
        Write-Host "Runtime folder created: $runtimePath" -ForegroundColor Green
        
        Write-Host "Restarting the script..." -ForegroundColor Cyan
        Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -NoNewWindow
        exit
    } else {
        Write-Host "Runtime folder exists: $runtimePath" -ForegroundColor Green
        $status["RuntimeFolderExists"] = $DONE
        return $true
    }
}

function VerifyChecksums {
    $folders = Get-ChildItem -Path $runtimePath -Directory

    if ($folders.Count -gt 0) {
        foreach ($folder in $folders) {
            $version = $folder.Name
            Write-Host "Testing version: $version"
            $zipFolder = $version + ".zip"
            Compress-Archive -Path $folder.FullName -DestinationPath $zipFolder

            Write-Host "Zip file path: $zipFolder"
            if (-Not (Test-Path -Path $zipFolder)) {
                Write-Host "Error: The zip file was not created: $zipFolder" -ForegroundColor Red
                return
            }
            $calculatedChecksum = certutil.exe -hashfile $zipFolder sha256 | Select-String "^[0-9a-fA-F]{64}$" | ForEach-Object { $_.ToString().Trim() }

            Write-Host "Local checksum result version: $version / $calculatedChecksum"

            $checksum = Invoke-WebRequest -URI $OPENFIN_CHECKSUM_BASE_URI"/"$version".sha256"
            Write-Host "Openfin checksum result version: $version / $checksum"

            if ($checksum -eq $calculatedChecksum) {
                Write-Host "Checksum matches as expected." -ForegroundColor Green
            } else {
                Write-Host "Checksum does not match!" -ForegroundColor Red
                Write-Host "Checksum expected is: $checksum" -ForegroundColor Red
            }

            Write-Host "-----------------------------"
        }

        $status["ChecksumsVerification"] = $DONE
    } else {
        Write-Host "Step ChecksumsVerification - No folders found inside OpenFin Runtime."
        $status["ChecksumsVerification"] = $FAILED
    }
}

function CDNValidation {
    Write-Host "Executing step 2..." -ForegroundColor Cyan
    $status["CDNValidation"] = $DONE
}

function ThirdStep {
    Write-Host "Executing step 3..." -ForegroundColor Cyan
    $status["ThirdStep"] = $DONE
}

if (CheckRuntimeFolder) {
    VerifyChecksums
} else {
    Break
}

if ($status['RuntimeFolderExists'] -eq $DONE) {
    CDNValidation
}

if ($status['RuntimeFolderExists'] -eq $DONE) {
    ThirdStep
}


Write-Host "`n#### Checklist Status ####`n"
$status.GetEnumerator() | ForEach-Object { Write-Host "$($_.Key): $($_.Value)" }