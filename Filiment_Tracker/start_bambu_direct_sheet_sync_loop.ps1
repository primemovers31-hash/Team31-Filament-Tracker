param(
    [int]$IntervalSeconds = 15
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$syncScript = Join-Path $root "sync_bambu_direct_to_sheet.ps1"

if (-not (Test-Path $syncScript)) {
    throw "Missing sync script: $syncScript"
}

Write-Output "Starting direct Bambu MQTT -> Google Sheet sync loop every $IntervalSeconds seconds."

while ($true) {
    try {
        & powershell -ExecutionPolicy Bypass -File $syncScript
    } catch {
        Write-Warning $_
    }
    Start-Sleep -Seconds $IntervalSeconds
}
