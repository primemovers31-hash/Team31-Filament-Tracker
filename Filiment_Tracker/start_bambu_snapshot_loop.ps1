$ErrorActionPreference = 'Stop'

param(
    [int]$IntervalSeconds = 5
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$refreshScript = Join-Path $root 'refresh_bambu_snapshot.ps1'

while ($true) {
    try {
        powershell -ExecutionPolicy Bypass -File $refreshScript | Out-Host
    } catch {
        Write-Warning $_
    }
    Start-Sleep -Seconds $IntervalSeconds
}
