param(
    [string]$AppsScriptUrl = "https://script.google.com/macros/s/AKfycbw3RntVG0DodoECyYMfy9OpuWh9tMMXTu0v8tMS2uuMiP6Cb0pQZAzMYIL0o_n5_cDq1g/exec",
    [string]$SharedSecret = "Mango_bird",
    [string]$SheetName = "BambuLive",
    [string]$ConfigPath = ""
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ConfigPath) {
    $ConfigPath = Join-Path $root "bambu_mqtt_config.json"
}

if (-not (Test-Path $ConfigPath)) {
    throw "Missing MQTT config file: $ConfigPath. Copy bambu_mqtt_config.sample.json to bambu_mqtt_config.json and paste the two printer access codes."
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

function Normalize-ColorHex {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return ""
    }

    $hex = ($Value -replace '[^A-Fa-f0-9]', '').Trim()
    if ($hex.Length -ge 6) {
        return "#" + $hex.Substring(0, 6).ToUpperInvariant()
    }

    return $Value
}

function Encode-MqttString {
    param([string]$Value)

    $bytes = [System.Text.Encoding]::UTF8.GetBytes([string]$Value)
    $length = [byte[]]@(
        (($bytes.Length -shr 8) -band 0xFF),
        ($bytes.Length -band 0xFF)
    )
    return $length + $bytes
}

function Encode-RemainingLength {
    param([int]$Value)

    $encoded = New-Object System.Collections.Generic.List[byte]
    do {
        $digit = $Value % 128
        $Value = [math]::Floor($Value / 128)
        if ($Value -gt 0) {
            $digit = $digit -bor 0x80
        }
        $encoded.Add([byte]$digit)
    } while ($Value -gt 0)
    return $encoded.ToArray()
}

function Read-ExactBytes {
    param(
        [System.IO.Stream]$Stream,
        [int]$Length
    )

    $buffer = New-Object byte[] $Length
    $offset = 0
    while ($offset -lt $Length) {
        $read = $Stream.Read($buffer, $offset, $Length - $offset)
        if ($read -le 0) {
            throw "Unexpected end of MQTT stream."
        }
        $offset += $read
    }
    return $buffer
}

function Read-MqttRemainingLength {
    param([System.IO.Stream]$Stream)

    $multiplier = 1
    $value = 0
    do {
        $encodedByte = $Stream.ReadByte()
        if ($encodedByte -lt 0) {
            throw "Unexpected end of MQTT stream while reading remaining length."
        }
        $value += ($encodedByte -band 127) * $multiplier
        $multiplier *= 128
    } while (($encodedByte -band 128) -ne 0)

    return $value
}

function Read-MqttPacket {
    param([System.IO.Stream]$Stream)

    $firstByte = $Stream.ReadByte()
    if ($firstByte -lt 0) {
        return $null
    }

    $remainingLength = Read-MqttRemainingLength -Stream $Stream
    $payload = if ($remainingLength -gt 0) { Read-ExactBytes -Stream $Stream -Length $remainingLength } else { [byte[]]@() }
    return [pscustomobject]@{
        TypeFlags = $firstByte
        Type      = ($firstByte -shr 4)
        Payload   = $payload
    }
}

function Write-MqttPacket {
    param(
        [System.IO.Stream]$Stream,
        [byte]$TypeFlags,
        [byte[]]$Body
    )

    $header = [byte[]]@($TypeFlags) + (Encode-RemainingLength -Value $Body.Length)
    $packet = $header + $Body
    $Stream.Write($packet, 0, $packet.Length)
    $Stream.Flush()
}

function Send-MqttConnect {
    param(
        [System.IO.Stream]$Stream,
        [string]$ClientId,
        [string]$Username,
        [string]$Password
    )

    $variableHeader = (Encode-MqttString -Value "MQTT") + [byte[]]@(0x04, 0xC2, 0x00, 0x3C)
    $payload = (Encode-MqttString -Value $ClientId) + (Encode-MqttString -Value $Username) + (Encode-MqttString -Value $Password)
    Write-MqttPacket -Stream $Stream -TypeFlags 0x10 -Body ($variableHeader + $payload)

    $response = Read-MqttPacket -Stream $Stream
    if ($null -eq $response -or $response.Type -ne 2) {
        throw "MQTT connect failed: missing CONNACK."
    }

    if ($response.Payload.Length -lt 2 -or $response.Payload[1] -ne 0) {
        $code = if ($response.Payload.Length -ge 2) { $response.Payload[1] } else { -1 }
        throw "MQTT connect failed with code $code."
    }
}

function Send-MqttSubscribe {
    param(
        [System.IO.Stream]$Stream,
        [UInt16]$PacketId,
        [string]$Topic
    )

    $packetIdBytes = [byte[]]@(
        (($PacketId -shr 8) -band 0xFF),
        ($PacketId -band 0xFF)
    )
    $body = $packetIdBytes + (Encode-MqttString -Value $Topic) + [byte[]]@(0x00)
    Write-MqttPacket -Stream $Stream -TypeFlags 0x82 -Body $body

    $response = Read-MqttPacket -Stream $Stream
    if ($null -eq $response -or $response.Type -ne 9) {
        throw "MQTT subscribe failed: missing SUBACK."
    }
}

function Send-MqttPublish {
    param(
        [System.IO.Stream]$Stream,
        [string]$Topic,
        [string]$JsonPayload
    )

    $body = (Encode-MqttString -Value $Topic) + [System.Text.Encoding]::UTF8.GetBytes($JsonPayload)
    Write-MqttPacket -Stream $Stream -TypeFlags 0x30 -Body $body
}

function Parse-MqttPublish {
    param([byte[]]$Payload)

    if ($Payload.Length -lt 2) {
        return $null
    }

    $topicLength = ($Payload[0] -shl 8) + $Payload[1]
    if ($Payload.Length -lt (2 + $topicLength)) {
        return $null
    }

    $topic = [System.Text.Encoding]::UTF8.GetString($Payload, 2, $topicLength)
    $bodyOffset = 2 + $topicLength
    $bodyLength = $Payload.Length - $bodyOffset
    $body = if ($bodyLength -gt 0) { [System.Text.Encoding]::UTF8.GetString($Payload, $bodyOffset, $bodyLength) } else { "" }
    return [pscustomobject]@{
        Topic = $topic
        Body  = $body
    }
}

function New-BambuRow {
    param(
        [string]$DeviceId,
        [string]$PrinterName,
        [string]$CapturedAt,
        [string]$Slot,
        [string]$Status,
        [string]$MaterialType,
        [string]$MaterialCode,
        [string]$ColorHex,
        [string]$Source
    )

    return [ordered]@{
        DeviceId     = $DeviceId
        PrinterName  = $PrinterName
        CapturedAt   = $CapturedAt
        Slot         = $Slot
        Status       = $Status
        MaterialType = $MaterialType
        MaterialCode = $MaterialCode
        ColorHex     = $ColorHex
        Source       = $Source
    }
}

function Convert-TrayToRow {
    param(
        [object]$Tray,
        [string]$SlotId,
        [string]$DeviceId,
        [string]$PrinterName,
        [string]$CapturedAt,
        [string]$Source
    )

    $materialType = [string](Get-FieldValue -InputObject $Tray -Name "tray_type")
    $materialCode = [string](Get-FieldValue -InputObject $Tray -Name "tray_info_idx")
    $colorHex = Normalize-ColorHex -Value ([string](Get-FieldValue -InputObject $Tray -Name "tray_color"))
    $status = if ([string]::IsNullOrWhiteSpace($materialType) -or [string]::IsNullOrWhiteSpace($materialCode)) { "empty" } else { "loaded" }

    return New-BambuRow -DeviceId $DeviceId -PrinterName $PrinterName -CapturedAt $CapturedAt -Slot $SlotId -Status $status -MaterialType $materialType -MaterialCode $materialCode -ColorHex $colorHex -Source $Source
}

function Extract-BambuRowsFromReport {
    param(
        [object]$Report,
        [object]$PrinterConfig
    )

    $rows = @()
    $print = Get-FieldValue -InputObject $Report -Name "print"
    if ($null -eq $print) {
        $print = $Report
    }

    $capturedAt = Get-Date -Format o
    $source = "Direct MQTT via access code"
    $deviceId = [string](Get-FieldValue -InputObject $PrinterConfig -Name "serial")
    $printerName = [string](Get-FieldValue -InputObject $PrinterConfig -Name "name")

    $ams = Get-FieldValue -InputObject $print -Name "ams"
    $amsArray = @()
    if ($null -ne $ams) {
        $candidate = Get-FieldValue -InputObject $ams -Name "ams"
        if ($null -ne $candidate) {
            $amsArray = @($candidate)
        }
    }

    $slotIndex = 1
    foreach ($amsUnit in $amsArray) {
        foreach ($tray in @((Get-FieldValue -InputObject $amsUnit -Name "tray"))) {
            if ($null -eq $tray) {
                continue
            }
            $slotId = [string](Get-FieldValue -InputObject $tray -Name "id")
            if ([string]::IsNullOrWhiteSpace($slotId)) {
                $slotId = "A$slotIndex"
            }
            $rows += ,(Convert-TrayToRow -Tray $tray -SlotId $slotId -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Source $source)
            $slotIndex += 1
        }
    }

    while ($slotIndex -le 4) {
        $rows += ,(New-BambuRow -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Slot "A$slotIndex" -Status "empty" -MaterialType "" -MaterialCode "" -ColorHex "" -Source $source)
        $slotIndex += 1
    }

    $vtTray = Get-FieldValue -InputObject $print -Name "vt_tray"
    if ($null -ne $vtTray) {
        $rows += ,(Convert-TrayToRow -Tray $vtTray -SlotId "Ext" -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Source $source)
    } else {
        $rows += ,(New-BambuRow -DeviceId $deviceId -PrinterName $printerName -CapturedAt $capturedAt -Slot "Ext" -Status "empty" -MaterialType "" -MaterialCode "" -ColorHex "" -Source $source)
    }

    return $rows
}

function Get-BambuPrinterRows {
    param([object]$PrinterConfig)

    $ip = [string](Get-FieldValue -InputObject $PrinterConfig -Name "ip")
    $serial = [string](Get-FieldValue -InputObject $PrinterConfig -Name "serial")
    $accessCode = [string](Get-FieldValue -InputObject $PrinterConfig -Name "accessCode")

    if ([string]::IsNullOrWhiteSpace($ip) -or [string]::IsNullOrWhiteSpace($serial) -or [string]::IsNullOrWhiteSpace($accessCode) -or $accessCode -like "PASTE_*") {
        throw "Printer config is incomplete for serial '$serial'. Fill in ip, serial, and accessCode in bambu_mqtt_config.json."
    }

    $tcp = New-Object System.Net.Sockets.TcpClient
    $tcp.Connect($ip, 8883)

    try {
        $network = $tcp.GetStream()
        $ssl = New-Object System.Net.Security.SslStream($network, $false, ({ $true } -as [System.Net.Security.RemoteCertificateValidationCallback]))
        $ssl.ReadTimeout = 8000
        $ssl.WriteTimeout = 8000
        $ssl.AuthenticateAsClient($ip)

        $clientId = "Team31-" + [Guid]::NewGuid().ToString("N").Substring(0, 12)
        Send-MqttConnect -Stream $ssl -ClientId $clientId -Username "bblp" -Password $accessCode
        Send-MqttSubscribe -Stream $ssl -PacketId 1 -Topic "device/$serial/report"
        Send-MqttPublish -Stream $ssl -Topic "device/$serial/request" -JsonPayload '{"pushing":{"sequence_id":"0","command":"pushall"}}'
        Send-MqttPublish -Stream $ssl -Topic "device/$serial/request" -JsonPayload '{"pushing":{"sequence_id":"1","command":"start"}}'

        $deadline = (Get-Date).AddSeconds(8)
        $latestReport = $null
        while ((Get-Date) -lt $deadline) {
            try {
                $packet = Read-MqttPacket -Stream $ssl
            } catch [System.TimeoutException] {
                break
            }

            if ($null -eq $packet) {
                break
            }

            if ($packet.Type -eq 3) {
                $publish = Parse-MqttPublish -Payload $packet.Payload
                if ($null -eq $publish) {
                    continue
                }
                if ($publish.Topic -eq "device/$serial/report" -and -not [string]::IsNullOrWhiteSpace($publish.Body)) {
                    try {
                        $json = $publish.Body | ConvertFrom-Json -Depth 100
                        $rows = Extract-BambuRowsFromReport -Report $json -PrinterConfig $PrinterConfig
                        if ($rows.Count -gt 0) {
                            $latestReport = $rows
                            break
                        }
                    } catch {
                    }
                }
            }
        }

        if ($null -eq $latestReport) {
            throw "No direct MQTT report was received from printer $serial at $ip."
        }

        return $latestReport
    } finally {
        try { $tcp.Close() } catch {}
    }
}

$config = Get-Content -Path $ConfigPath -Raw | ConvertFrom-Json
$headers = @("DeviceId", "PrinterName", "CapturedAt", "Slot", "Status", "MaterialType", "MaterialCode", "ColorHex", "Source")
$allRows = @()

foreach ($printer in @($config.printers)) {
    $allRows += @(Get-BambuPrinterRows -PrinterConfig $printer)
}

if ($allRows.Count -eq 0) {
    throw "No printer rows were returned from direct MQTT."
}

$payload = [pscustomobject]@{
    action = "replaceRows"
    secret = $SharedSecret
    sheetName = $SheetName
    headers = $headers
    rows = $allRows
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri $AppsScriptUrl -Method Post -ContentType "application/json" -Body $payload

if (-not $response.ok) {
    throw "Apps Script sync failed: $($response.error)"
}

Write-Output "Synced $($allRows.Count) direct Bambu rows to sheet '$SheetName'."
