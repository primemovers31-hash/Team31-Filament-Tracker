# Bambu Filament Bridge Setup

This bridge pushes live Bambu printer and AMS slot data into your Google Sheet tab named `BambuLive`.

Your website will then be able to read that tab and show live printer data even from GitHub Pages.

## What this bridge does

- Reads the latest Bambu Studio printer and AMS data from the laptop running Bambu Studio
- Regenerates `bambu_snapshot.json`
- Pushes printer slot data into the Google Sheet tab `BambuLive`
- Lets the website fall back to the sheet-fed Bambu data when the local JSON is not available

## Important limitation

This sync is great for:

- current printer status
- AMS slot materials
- external spool material
- what the printers are loaded with right now

It is not yet a full official Bambu Filament Manager import/export system because Bambu does not appear to expose a public inventory API/export for that manager yet.

## Files added

- `sync_bambu_live_to_sheet.ps1`
- `start_bambu_sheet_sync_loop.ps1`

## Step 1: Update your Google Apps Script

Open your Apps Script project and replace the code with the updated contents from:

- `GOOGLE_SHEETS_SYNC.gs`

Then:

1. Save the script
2. Deploy it again as a Web App
3. Make sure it is still connected to the same spreadsheet

## Step 2: Keep the shared secret the same

Your current shared secret is:

```text
Mango_bird
```

Make sure your Script Properties still contain:

```text
SHARED_SECRET = Mango_bird
```

## Step 3: Start the Bambu bridge on the laptop

Run this once to test:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Graham Pinnell\Downloads\Filiment_Tracker\sync_bambu_live_to_sheet.ps1"
```

If it works, you should see a success line saying rows were synced to `BambuLive`.

## Step 4: Start continuous syncing

Run:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Graham Pinnell\Downloads\Filiment_Tracker\start_bambu_sheet_sync_loop.ps1"
```

That refreshes the `BambuLive` tab every 15 seconds.

## Step 5: Upload website files to GitHub

Upload these updated files to your GitHub repo:

- `app.js`
- `config.js`

If you also want the repo to contain the latest setup notes, upload:

- `SETUP_BAMBU_SHEET_BRIDGE.md`

## Step 6: Hard refresh the website

After GitHub Pages finishes redeploying:

- on Windows: `Ctrl + F5`
- on Mac: `Cmd + Shift + R`
- on iPhone/iPad Safari: close the web app and reopen it, or clear site data if it still shows cached content

## What should happen next

- The website will try to read the `BambuLive` sheet tab first
- If the Bambu laptop sync loop is running, the hosted site can show updated printer status
- If the sheet tab is empty, the site falls back to the old local/saved printer snapshot behavior
