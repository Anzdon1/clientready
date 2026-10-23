# ClientReady — marketing site

Homepage, four landing pages, a working email signup and a thank-you page for ClientReady, the Stark Labs project in Columbia's Startup Studio (COMS 4995, Fall 2026).

Live: https://clientready.cc

| Route | Audience | Value prop |
|---|---|---|
| `/` | Anyone building a small website from someone else's material | Know what belongs on each page |
| `/long-document` | A student or friend building a site from a long document and an image folder | Sort what you were sent by page; keep the open choices visible |
| `/section-brief` | Someone assembling a group's writing into one site | Tell everyone what each section needs before they write |
| `/needs-a-decision` | A club or event page coordinator | See what is still missing and who it is waiting on |
| `/freelancers` | Freelance web designers and small studios | Turn questionnaire answers and a folder into a page-by-page content pack |
| `/thanks` | After a signup | Fires the `signup` analytics event |
| `/privacy` | — | What the site collects |

## Run it

```sh
npm install
npm start            # http://localhost:3000
npm run check        # renders every page and checks tag, form, placeholders
npm run export       # writes the static site to dist/ (what Cloudflare Pages deploys)
```

Configuration is by environment variable; nothing needs a rebuild.

| Variable | What it is | Default |
|---|---|---|
| `GA_MEASUREMENT_ID` | Google Analytics 4 measurement id | `G-VZ595XF2ME` (the ClientReady property) |
| `FORMSPREE_FORM_ID` | the id in `https://formspree.io/f/<id>` | the team form |
| `SITE_URL` | public origin, used for canonical and OG tags | `https://clientready.cc` |
| `PORT` | set by Railway | `3000` |

## How it is built

- `server.js` renders `src/pages/*.html` into `src/layout.html` once at startup and serves them with Express. Each page starts with a small front-matter block (title, description, signup copy). Shared pieces live in `src/partials/`.
- `public/assets/site.css` implements the palette and rules in `docs/style_guide.md` (flat colors, one accent for the action, 44 px controls, visible focus). Type is Newsreader for headings and Inter for body, loaded from Google Fonts with Georgia and Arial as fallbacks; this is a deliberate change from the HW4 preview. The hero's page plan animates once on load, two sheets settling into alignment, and stays still when the visitor prefers reduced motion.
- `public/assets/site.js` submits the form to Formspree with `fetch`, then sends the visitor to `/thanks?from=<page>`. It also copies `utm_*` values from the arrival URL into hidden fields (and keeps the first set for the tab session) so each signup email says which page and which post it came from.
- Google's tag is in `<head>` on every page. The thank-you page fires `gtag('event', 'signup', {...})`; that event is marked a key event in the GA4 property.

## Deploy (Cloudflare Pages)

The site is static once exported, so it runs on Cloudflare Pages with no server.

1. Workers & Pages → Create → Pages → Connect to Git → this repository.
2. Build command `npm run export`, build output directory `dist`.
3. Environment variables (production): `GA_MEASUREMENT_ID`, `SITE_URL=https://clientready.cc`. (`FORMSPREE_FORM_ID` is already defaulted.)
4. Custom domains → add `clientready.cc` and `www.clientready.cc`. The domain is already on Cloudflare, so DNS is created automatically.

Every push to `main` redeploys. `dist/_redirects` sends `/page/` to `/page`; `dist/404.html` is the not-found page. The same export also works on Netlify or Vercel (static output `dist`), or on any Node host with `npm start`.

## Honesty rules for copy

From `docs/brand_position.md`: no invented customers, testimonials, metrics or shipping dates; never promise that a tool makes an unresponsive person respond; never present polished filler as a contributor's answer. The sample projects on the pages are labeled as invented examples. Interview quotes are translations from our own interview notes; the Reddit quote is verbatim and dated.
