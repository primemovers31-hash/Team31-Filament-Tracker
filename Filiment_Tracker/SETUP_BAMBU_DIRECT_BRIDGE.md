# Bambu Direct Bridge Setup

Use this setup on the printer laptop when Bambu Studio logs are encrypted and the old log parser does not work.

This method connects to each printer directly over the local network and pushes the live AMS/external spool state into the `BambuLive` tab in Google Sheets.

## What you need

- `sync_bambu_direct_to_sheet.ps1`
- `start_bambu_direct_sheet_sync_loop.ps1`
- `bambu_mqtt_config.sample.json`

## Step 1: Copy the config template

Copy:

`bambu_mqtt_config.sample.json`

to:

`bambu_mqtt_config.json`

## Step 2: Paste the access codes

Edit `bambu_mqtt_config.json` and replace:

`PASTE_ACCESS_CODE_HERE`

with the real access code for each printer.

The file already includes these printer IPs and serials:

- `JenksRobotics1` / `10.113.168.13` / `01P00C582602448`
- `JenksRobotics2` / `10.113.160.45` / `01P00C591201911`

## Step 3: Run one sync test

```powershell
cd "C:\Users\Mentor\Downloads\Filiment_Tracker"
powershell -ExecutionPolicy Bypass -File ".\sync_bambu_direct_to_sheet.ps1"
```

If it works, it will push rows into the `BambuLive` tab in your Google Sheet.

## Step 4: Start the loop

```powershell
cd "C:\Users\Mentor\Downloads\Filiment_Tracker"
powershell -ExecutionPolicy Bypass -File ".\start_bambu_direct_sheet_sync_loop.ps1"
```

## Notes

- This direct method is for the printer laptop on the same LAN as the printers.
- The website can keep reading `BambuLive` from Google Sheets after this is working.
- If the printer rejects the connection, double-check that the IP, serial number, and access code are correct.
