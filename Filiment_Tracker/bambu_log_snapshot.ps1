param(
    [string]$BambuRoot = "$env:APPDATA\BambuStudio",
    [string]$OutputPath = ""
)

$ErrorActionPreference = 'Stop'

function Get-LatestDebugLog {
    param([string]$Root)

    $logDir = Join-Path $Root 'log'
    if (-not (Test-Path $logDir)) {
        throw "Bambu Studio log folder not found: $logDir"
    }

    $patterns = @(
        'debug_*.log.0',
        'debug_*.log.1',
        'studio_*.log.0',
        'studio_*.log.1'
    )

    $candidates = @()
    foreach ($pattern in $patterns) {
        $candidates += @(Get-ChildItem $logDir -Filter $pattern -ErrorAction SilentlyContinue)
    }

    $log = $candidates |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $log) {
        throw "No Bambu Studio log found in $logDir"
    }

    return $log
}

function Normalize-ColorHex {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return ''
    }

    $trimmed = $Value.Trim()
    if ($trimmed.Length -ge 6) {
        return '#' + $trimmed.Substring(0, 6)
    }

    return $trimmed
}

function Convert-Tray {
    param($Tray)

    $slotId = $Tray.id
    $materialType = $Tray.tray_type
    $materialCode = $Tray.tray_info_idx
    $state = [string]$Tray.state
    $colorHex = Normalize-ColorHex $Tray.tray_color

    $status = if ([string]::IsNullOrWhiteSpace($materialType) -or [string]::IsNullOrWhiteSpace($materialCode)) {
        'empty'
    } else {
        'loaded'
    }

    [pscustomobject]@{
        slotId        = $slotId
        status        = $status
        materialType  = $materialType
        materialCode  = $materialCode
        colorHex      = $colorHex
        printerState  = $state
    }
}

function Get-LatestMachinePayloads {
    param([string]$LogPath)

    $lines = Get-Content $LogPath
    $devices = @{}
    $currentDevice = $null

    foreach ($line in $lines) {
        if ($line -match 'parse_json: dev_id=([^,]+), print playload=\{') {
            $currentDevice = $matches[1]
            if (-not $devices.ContainsKey($currentDevice)) {
                $devices[$currentDevice] = @{
                    deviceId = $currentDevice
                    capturedAt = Get-Date -Format o
                    slots = @{}
                    externalSpool = $null
                }
            } else {
                $devices[$currentDevice].capturedAt = Get-Date -Format o
            }
            continue
        }

        if ($line -match 'set_selected_machine:.*dev_id\s*=\s*([A-Za-z0-9]+)') {
            $currentDevice = $matches[1]
            if (-not $devices.ContainsKey($currentDevice)) {
                $devices[$currentDevice] = @{
                    deviceId = $currentDevice
                    capturedAt = Get-Date -Format o
                    slots = @{}
                    externalSpool = $null
                }
            } else {
                $devices[$currentDevice].capturedAt = Get-Date -Format o
            }
            continue
        }

        if (-not $currentDevice) {
            continue
        }

        if ($line -match 'build_filament_ams_list: name ([A-Za-z0-9]+) setting_id ([^ ]*) type ([^ ]*) color ([A-Fa-f0-9]*)') {
            $slotName = $matches[1]
            $materialCode = $matches[2]
            $materialType = $matches[3]
            $colorHex = Normalize-ColorHex $matches[4]

            $slot = [pscustomobject]@{
                slotId       = $slotName
                status       = if ([string]::IsNullOrWhiteSpace($materialType) -or [string]::IsNullOrWhiteSpace($materialCode)) { 'empty' } else { 'loaded' }
                materialType = $materialType
                materialCode = $materialCode
                colorHex     = $colorHex
            }

            if ($slotName -eq 'Ext') {
                $devices[$currentDevice].externalSpool = $slot
            } else {
                $devices[$currentDevice].slots[$slotName] = $slot
            }
        }
    }

    return $devices.Values | ForEach-Object {
        [pscustomobject]@{
            deviceId      = $_.deviceId
            capturedAt    = $_.capturedAt
            amsPresent    = ($_.slots.Count -gt 0)
            amsSlots      = @($_.slots.GetEnumerator() | Sort-Object Name | ForEach-Object { $_.Value })
            externalSpool = $_.externalSpool
        }
    }
}

$latestLog = Get-LatestDebugLog -Root $BambuRoot
$snapshots = @(Get-LatestMachinePayloads -LogPath $latestLog.FullName)

$output = [pscustomobject]@{
    sourceLog   = $latestLog.FullName
    generatedAt = Get-Date -Format o
    printers    = $snapshots
}

$json = $output | ConvertTo-Json -Depth 100

if ($OutputPath) {
    $parent = Split-Path $OutputPath -Parent
    if ($parent -and -not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent | Out-Null
    }
    Set-Content -Path $OutputPath -Value $json -Encoding UTF8
} else {
    $json
}
