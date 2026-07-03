# ServeFinder

A web app that helps high school students **discover local volunteer opportunities** so
they can earn the **40 community-service hours required to graduate**.

Students search a curated directory by keyword, cause, and distance. Each listing shows
what the organization does, where it is, how far away it is, the age requirement,
**whether the org will verify service hours**, and how to contact it. Students then
reach out to organizations **directly, on their own** — ideally with a parent or
guardian in the loop.

> ## ⚠️ Replace the placeholder data before launch
>
> Every listing in `data/opportunities.json` is **fictional sample content** (fake orgs,
> 555 phone numbers, `example.org` emails/websites) so the app works out of the box.
> Before real students use this, replace it with **real, verified local organizations**:
>
> 1. Gather candidates from public sources: your local **United Way**,
>    **VolunteerMatch**, **JustServe**, city/county volunteer portals, libraries, food
>    banks, animal shelters, hospitals, and parks & rec departments.
> 2. Contact each org and confirm its info — especially the **hour-verification
>    policy** (will they sign a school service-hour form?), age rules, and contact
>    details.
> 3. Set each listing's `lastVerified` to the date you confirmed it, and re-check
>    listings periodically.

## Core constraints (what this deliberately is — and isn't)

- **Finder, not tracker.** No hour logging, timers, check-ins, or "progress toward 40
  hours" anywhere. The one job is helping students *find* places.
- **Read-only directory.** No in-app applications, booking, scheduling, or messaging
  with organizations. The app displays curated info; students use the contact details
  to reach out themselves.
- **Minor-safe & privacy-first.** No student accounts and no personal data collection.
  Location is optional: ZIP entry is the default and browser geolocation is opt-in.
  Both are used **only in the browser** to compute distances (Haversine) — precise
  coordinates never touch a server, the URL, or any storage. Saved hearts are
  in-memory for the visit only. There are no analytics.
- **Curated data.** All listings come from one JSON file an operator maintains (see
  below). The data layer (`lib/opportunities.ts`) is the only module that touches the
  source, so it can move to SQLite/Postgres later without UI changes.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS, mobile-first
- [Leaflet](https://leafletjs.com) + React-Leaflet with **OpenStreetMap tiles** — free,
  no API key, no billing (attribution shown on the map)
- Bundled **ZIP → lat/lng dataset** (US Census ZCTA gazetteer, public domain), sharded
  into `public/zip-data/` so the client fetches only ~10–40 KB for the user's region —
  no geocoding API, no rate limits
- No database, no auth for students; optional Basic-Auth-gated `/admin` for the operator

## Run it locally

```bash
npm install
npm run dev        # → http://localhost:3000
```

Production build & serve:

```bash
npm run build
npm start
```

## Adding & editing opportunities

`data/opportunities.json` is the single source of truth. Two ways to edit it:

### Option A — edit the JSON directly (recommended)

Add/edit objects in the `opportunities` array. Each listing looks like:

```jsonc
{
  "id": "maplewood-library-teen-corps",     // unique kebab-case slug (used in URLs)
  "name": "Maplewood Public Library — Teen Corps",
  "description": "What the org does and what the volunteer actually does.",
  "category": "Library",                    // one of the 15 categories in lib/types.ts
  "address": { "street": "111 High St", "city": "Medford", "state": "MA", "zip": "02155" },
  "lat": 42.4184, "lng": -71.1062,          // coordinates of the address (see below)
  "contact": {                              // all optional — include what's public
    "phone": "(781) 555-0158",
    "email": "teens@maplewoodlibrary.example.org",
    "website": "https://maplewoodlibrary.example.org/teens",
    "contactPerson": "Jess Park, Teen Services Librarian"
  },
  "minAge": 13,                             // omit for "no age minimum"
  "parentalConsentRequired": false,         // optional
  "verifiesHours": true,                    // will they sign a school hour form?
  "timeCommitment": "Flexible",             // OneTime | Ongoing | Flexible | EventBased
  "isVirtual": false,                       // can it be done remotely?
  "groupFriendly": false,                   // can a club volunteer together?
  "requirements": ["Sign-up sheet", "Short tutorial"],   // optional
  "hoursNotes": "How hours get documented here.",        // optional
  "howToStart": "Step one.\nStep two.\nStep three.",     // one step per line
  "lastVerified": "2026-06-15"              // date YOU confirmed this info
}
```

**Finding `lat`/`lng` for an address:** search the address on
[openstreetmap.org](https://www.openstreetmap.org), right-click the spot → "Show
address", and read the coordinates — or copy them from the page URL.

The loader validates the file on startup and fails with a descriptive error (bad
category, missing field, duplicate id, out-of-range coordinates…) if something's off.

### Option B — the `/admin` editor

1. Copy `.env.example` to `.env.local` and set a strong `ADMIN_PASSWORD`.
2. Visit `/admin` (any username, that password — HTTP Basic Auth via `proxy.ts`).
3. Add/edit/delete listings in the form. Changes affect a **working copy in your
   browser**:
   - In local dev, **Save to disk** writes straight to `data/opportunities.json`.
   - In production, **Download JSON**, replace `data/opportunities.json` in the repo,
     commit, and redeploy (deployed filesystems are ephemeral — by design there's no
     server-side persistence).

If `ADMIN_PASSWORD` is unset, `/admin` returns 503 and the rest of the site is
unaffected.

## Refreshing the ZIP dataset

`public/zip-data/` is generated from the US Census ZCTA gazetteer (public domain):

```bash
node scripts/build-zip-data.mjs    # downloads from census.gov and regenerates shards
```

Re-run yearly-ish and commit the output. ZIP centroids barely move, so this is low
urgency.

## Deploying (Vercel)

1. Push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new)
   (framework auto-detected; no special settings needed).
2. If you want `/admin`, add the `ADMIN_PASSWORD` environment variable in the Vercel
   project settings.
3. To update listings: edit `data/opportunities.json`, commit, push — Vercel rebuilds
   and the new data ships with the build.

Any Node host works the same way (`npm run build && npm start`).

## Safety & privacy notes

- The app only ever displays **publicly available organization contact info**.
- Detail pages and the About page repeatedly encourage students to **involve a
  parent/guardian** when contacting an org, and to confirm details (especially hour
  sign-off) before showing up.
- There is intentionally **no** account system, hour tracking, in-app messaging,
  scheduling, or payment anywhere — keep it that way when extending the app.
- No analytics are included. If you add any, keep them aggregate and
  non-individualized (e.g. privacy-focused page-view counters), never per-student.

## Project structure

```
app/                    # routes (App Router)
  page.tsx              #   home / search
  opportunities/        #   results (list + map) and detail pages
  about/                #   how it works, safety, disclaimers
  admin/ + api/admin/   #   operator editor (Basic Auth) + dev-only save API
components/             # UI building blocks (filters, cards, maps, admin form)
data/opportunities.json # ⚠️ the dataset — placeholder until you replace it
lib/                    # types, data loader/validator, filters, distance, geocode
public/zip-data/        # generated ZIP → [lat, lng] shards (Census ZCTA)
scripts/                # zip-data generator
proxy.ts                # Basic Auth gate for /admin
```
