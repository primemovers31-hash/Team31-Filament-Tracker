# Bambu Local Sync

This tracker can now read a local Bambu Studio snapshot file named `bambu_snapshot.json`.

## What works now

- Reads AMS slot data from the latest local Bambu Studio debug log
- Updates the `P1S printer status` cards automatically
- Updates the `Best matches for current printer` section using the synced AMS/external spool materials
- Falls back to the manual snapshot cards if no local Bambu snapshot file is available

## One-time manual snapshot

Run:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Graham Pinnell\Downloads\Filiment_Tracker\refresh_bambu_snapshot.ps1"
```

That writes:

```text
C:\Users\Graham Pinnell\Downloads\Filiment_Tracker\bambu_snapshot.json
```

## Continuous local refresh

Run:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Graham Pinnell\Downloads\Filiment_Tracker\start_bambu_snapshot_loop.ps1"
```

That keeps regenerating `bambu_snapshot.json` every 5 seconds.

## Important limitation

If you are viewing the tracker from GitHub Pages on a phone, the phone cannot directly read your computer's local `AppData` Bambu Studio logs.

That means this local sync works best when:

- you open the tracker on the same computer that runs Bambu Studio, or
- you later add a small shared bridge that uploads `bambu_snapshot.json` somewhere the hosted site can fetch

## Best next step for phones

If you want phone users to see live Bambu updates too, the next bridge should be one of these:

1. Run a small local web server on the Bambu Studio PC and keep the tracker on the same LAN.
2. Push `bambu_snapshot.json` to a shared endpoint or repo action.
3. Build a tiny backend that publishes the snapshot for the GitHub Pages site.
