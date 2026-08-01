# Google Sheets Two-Way Sync Setup

This tracker already reads from your Google Sheet.

These steps add website -> Google Sheet write-back so edits on the website update the sheet too.

## What already works

- Google Sheet -> website
  The site already refreshes from the sheet every minute.

## What this setup adds

- website -> Google Sheet
  When you change amount, location, seal status, or add a filament on the site, it can push those edits into the sheet.

## Files used

- Website config: `config.js`
- Website sync code: `app.js`
- Google Apps Script code to paste into your sheet: `GOOGLE_SHEETS_SYNC.gs`

## Step 1: Open the Google Sheet

Open:

`https://docs.google.com/spreadsheets/d/1t-iFSpfAp_ZCvsw62VQI-7thumBxM93KBD-5O0v4KNU/edit?usp=sharing`

## Step 2: Open Apps Script

In the Google Sheet:

1. Click `Extensions`
2. Click `Apps Script`

## Step 3: Paste the script

1. Delete the default code in the Apps Script editor
2. Open `GOOGLE_SHEETS_SYNC.gs`
3. Copy everything from that file
4. Paste it into the Apps Script editor
5. Click `Save`

## Step 4: Add the shared secret

In Apps Script:

1. Click the gear icon for `Project Settings`
2. Under `Script properties`, add a property:
   - Key: `SHARED_SECRET`
   - Value: choose your own secret string

Example:

`team31-filament-secret-2026`

## Step 5: Deploy the web app

1. Click `Deploy`
2. Click `New deployment`
3. Choose type `Web app`
4. Description: `Team 31 filament sync`
5. Execute as: `Me`
6. Who has access: `Anyone`
7. Click `Deploy`
8. Authorize the script if Google asks
9. Copy the `Web app URL`

## Step 6: Add the URL to the website

Open `config.js`

Set:

- `googleSheetAppsScriptUrl` to your web app URL
- `googleSheetSharedSecret` to the same secret you used in Apps Script

Example:

```js
window.APP_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  googleSheetCsvUrl: "https://docs.google.com/spreadsheets/d/1t-iFSpfAp_ZCvsw62VQI-7thumBxM93KBD-5O0v4KNU/export?format=csv&gid=0",
  googleSheetWebUrl: "https://docs.google.com/spreadsheets/d/1t-iFSpfAp_ZCvsw62VQI-7thumBxM93KBD-5O0v4KNU/edit?usp=sharing",
  googleSheetName: "Sheet1",
  googleSheetAppsScriptUrl: "PASTE_YOUR_WEB_APP_URL_HERE",
  googleSheetSharedSecret: "team31-filament-secret-2026"
};
```

## Step 7: Upload the updated website files

Update your GitHub Pages repo with:

- `config.js`
- `app.js`

## Step 8: Test it

1. Open the website
2. Change a spool amount
3. Wait a few seconds
4. Open the sheet
5. Confirm the row updated

Also test:

- location change
- seal status change
- adding a filament

## Notes

- Matching is done by `Asset tag`
- If a tag does not exist yet, the script adds a new row
- The website still refreshes from the sheet every minute, so sheet edits come back into the site
- Custom website-only fields like reactions, local comments, position, and reorder threshold are not written to the sheet by this script unless you add columns for them

## Fields currently synced

- Asset tag
- Filament type
- Specifics
- Brand
- Sealed
- Location
- Amount remaining
- Order again
- Comments
- Color
