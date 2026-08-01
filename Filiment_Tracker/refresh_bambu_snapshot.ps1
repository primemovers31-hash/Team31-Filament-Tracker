$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$snapshotScript = Join-Path $root 'bambu_log_snapshot.ps1'
$outputFile = Join-Path $root 'bambu_snapshot.json'

powershell -ExecutionPolicy Bypass -File $snapshotScript -OutputPath $outputFile
Write-Output "Updated $outputFile"
