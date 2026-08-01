param(
    [string]$AppsScriptUrl = "https://script.google.com/macros/s/AKfycbw3RntVG0DodoECyYMfy9OpuWh9tMMXTu0v8tMS2uuMiP6Cb0pQZAzMYIL0o_n5_cDq1g/exec",
    [string]$SharedSecret = "Mango_bird",
    [string]$SheetName = "BambuLive",
    [string]$BambuRoot = "$env:APPDATA\BambuStudio"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$snapshotScript = Join-Path $root "bambu_log_snapshot.ps1"
$snapshotPath = Join-Path $root "bambu_snapshot.json"

if (-not (Test-Path $snapshotScript)) {
    throw "Missing snapshot script: $snapshotScript"
}

function Get-PrinterName {
    param([string]$DeviceId)

    $known = @{
        "01P00C582602448" = "JenksRobotics1"
        "01P00C591201911" = "JenksRobotics2"
    }

    if ($known.ContainsKey($DeviceId)) {
        return $known[$DeviceId]
    }

    if ($DeviceId.Length -ge 3) {
        return "Bambu-" + $DeviceId.Substring($DeviceId.Length - 3)
    }

    return "Bambu Printer"
}

function Get-FieldValue {
    param(
        [object]$InputObject,
        [string]$Name
    )

    if ($null -eq $InputObject -or [string]::IsNullOrWhiteSpace($Name)) {
        return $null
    }

    if ($InputObject -is [System.Collections.IDictionary]) {
        if ($InputObject.Contains($Name)) {
            return $InputObject[$Name]
        }
        return $null
    }

    $property = $InputObject.PSObject.Properties[$Name]
    if ($null -ne $property) {
        return $property.Value
    }

    return $null
}

function New-BambuRow {
    param(
        [string]$DeviceId,
        [string]$PrinterName,
        [string]$CapturedAt,
        [string]$Slot,
        [object]$SlotData,
        [string]$Source
    )

    $status = ""
    $materialType = ""
    $materialCode = ""
    $colorHex = ""
    if ($null -ne $SlotData) {
        $statusValue = Get-FieldValue -InputObject $SlotData -Name "status"
        $materialTypeValue = Get-FieldValue -InputObject $SlotData -Name "materialType"
        $materialCodeValue = Get-FieldValue -InputObject $SlotData -Name "materialCode"
        $colorHexValue = Get-FieldValue -InputObject $SlotData -Name "colorHex"
        if ($null -ne $statusValue) { $status = [string]$statusValue }
        if ($null -ne $materialTypeValue) { $materialType = [string]$materialTypeValue }
        if ($null -ne $materialCodeValue) { $materialCode = [string]$materialCodeValue }
        if ($null -ne $colorHexValue) { $colorHex = [string]$colorHexValue }
    }

    return [ordered]@{
        DeviceId     = $DeviceId
        PrinterName  = $PrinterName
        CapturedAt   = $CapturedAt
        Slot         = $Slot
        Status       = $status
        MaterialType = $materialType
        MaterialCode = $materialCode
        ColorHex     = $colorHex
        Source       = $Source
    }
}

& powershell -ExecutionPolicy Bypass -File $snapshotScript -BambuRoot $BambuRoot -OutputPath $snapshotPath | Out-Null

if (-not (Test-Path $snapshotPath)) {
    throw "Snapshot output missing: $snapshotPath"
}

$snapshot = Get-Content -Path $snapshotPath -Raw | ConvertFrom-Json
$rows = New-Object System.Collections.Generic.List[object]
$headers = @("DeviceId", "PrinterName", "CapturedAt", "Slot", "Status", "MaterialType", "MaterialCode", "ColorHex", "Source")
$source = "Bambu Studio log"
if ($null -ne $snapshot.sourceLog -and -not [string]::IsNullOrWhiteSpace([string]$snapshot.sourceLog)) {
    $source = [string]$snapshot.sourceLog
}

foreach ($printer in @($snapshot.printers)) {
    $deviceId = ""
    if ($null -ne $printer.deviceId) {
        $deviceId = [string]$printer.deviceId
    }
    if ([string]::IsNullOrWhiteSpace($deviceId)) {
        continue
    }

    $printerName = Get-PrinterName -DeviceId $deviceId
    $capturedAt = ""
    if ($null -ne $printer.capturedAt -and -not [string]::IsNullOrWhiteSpace([string]$printer.capturedAt)) {
        $capturedAt = [string]$printer.capturedAt
    } elseif ($null -ne $snapshot.generatedAt) {
        $capturedAt = [string]$snapshot.generatedAt
    }
    $slotMap = @{}

    foreach ($slot in @($printer.amsSlots)) {
        $slotId = ""
        if ($null -ne $slot.slotId) {
            $slotId = [string]$slot.slotId
        }
        if (-not [string]::IsNullOrWhiteSpace($slotId)) {
            $slotMap[$slotId] = $slot
        }
    }

    foreach ($slotId in @("A1", "A2", "A3", "A4")) {
        if ($slotMap.ContainsKey($slotId)) {
            $rows.Add((New-BambuRow -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Slot $slotId -SlotData $slotMap[$slotId] -Source $source))
        } else {
            $rows.Add((New-BambuRow -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Slot $slotId -SlotData @{ status = "empty"; materialType = ""; materialCode = ""; colorHex = "" } -Source $source))
        }
    }

    if ($printer.externalSpool) {
        $rows.Add((New-BambuRow -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Slot "Ext" -SlotData $printer.externalSpool -Source $source))
    } else {
        $rows.Add((New-BambuRow -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Slot "Ext" -SlotData @{ status = "empty"; materialType = ""; materialCode = ""; colorHex = "" } -Source $source))
    }
}

$payload = @{
    action = "replaceRows"
    secret = $SharedSecret
    sheetName = $SheetName
    headers = $headers
    rows = @($rows)
} | ConvertTo-Json -Depth 8

$response = Invoke-RestMethod -Uri $AppsScriptUrl -Method Post -ContentType "application/json" -Body $payload

if (-not $response.ok) {
    throw "Apps Script sync failed: $($response.error)"
}

Write-Output "Synced $($rows.Count) Bambu rows to sheet '$SheetName'."
