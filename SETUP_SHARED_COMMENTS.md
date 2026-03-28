# Shared Web Comments Setup

To make comments editable by anyone on a public web URL, this app needs:

1. Static hosting for the site
2. A small database for comments

The cleanest setup is:

- Host the files on GitHub Pages, Netlify, or Vercel
- Use Supabase for the comment table

## 1. Create the Supabase table

Run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.filament_comments (
  id bigint generated always as identity primary key,
  spool_id text not null,
  display_name text not null default 'Anonymous',
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.filament_comments enable row level security;

create policy "public can read filament comments"
on public.filament_comments
for select
to anon
using (true);

create policy "public can insert filament comments"
on public.filament_comments
for insert
to anon
with check (char_length(body) > 0 and char_length(body) <= 500);
```

## 2. Add your Supabase project info

Open:

- `config.js`

Replace the blanks with your project values:

```js
window.APP_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR-ANON-KEY"
};
```

Use the public `anon` key, not the service role key.

## 3. Publish the app

Upload these files to your static host:

- `index.html`
- `styles.css`
- `inventory.js`
- `app.js`
- `config.js`

## Notes

- If `config.js` is left blank, comments still work, but only in the local browser.
- Amazon links are generated as search links from the selected spool details.
