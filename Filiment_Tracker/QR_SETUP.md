# Team 31 QR Setup

## What the QR codes should do

Each spool should open the tracker directly to that filament using a link like:

`https://your-site-url/?tag=53.0`

## Best free hosting options

### Fastest
`GitHub Pages`

### Best long-term
`Cloudflare Pages`

## Recommended process

1. Put this project in a GitHub repository.
2. Host the site with GitHub Pages or Cloudflare Pages.
3. Confirm the public site opens on a phone.
4. Test a deep link such as `https://your-site-url/?tag=53.0`
5. Generate QR codes from those spool links.
6. Print small labels and stick one on each spool.

## Example spool links

- `https://your-site-url/?tag=31.0`
- `https://your-site-url/?tag=49.0`
- `https://your-site-url/?tag=53.0`

## Quick test after hosting

1. Open the website.
2. Click a spool.
3. Confirm the URL changes to include `?tag=...`
4. Copy that link into a phone browser.
5. Confirm it opens the right filament.

## Best label format

- Top line: `Tag 53.0`
- Second line: `Rainbow Universe`
- QR code underneath

## Free QR code generation options

- Chrome browser built-in QR sharing
- Canva free QR generator
- QRCode Monkey

## Good next upgrade

Once the site is live, add a small `Copy spool link` button in the detail panel so creating QR labels is faster.
