# Lotus Ceylon — frontend

Next.js (App Router) rebuild of the Lotus Ceylon website, using the design,
colours and motion of the "Lotus Ceylon Motion" artifact. Every public page and
all the content from the legacy static site in `../thai` is included. The admin
panel is intentionally not part of this app.

```
lotusceylon/
├── thai/        legacy static site (source of the content)
├── frontend/    ← this app
└── backend/     (to come: inquiries, contact, reviews, chat)
```

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for metadata, sitemap and robots |
| `NEXT_PUBLIC_API_URL` | Backend base URL. Leave empty until the backend exists |

## Pages

| Route | Legacy page |
| --- | --- |
| `/` | `index.html` |
| `/tours` | `tours/index.html` (themes, trip finder, island map, travel-prep guide) |
| `/tours/[category]` (11) | `tours/<category>/index.html` |
| `/tours/[category]/[slug]` (29) | `tours/<category>/<slug>/index.html` |
| `/destinations`, `/destinations/[slug]` (24) | `destinations.html`, `destinations/<slug>/` |
| `/experiences`, `/about`, `/gallery`, `/reviews`, `/contact` | same-named `.html` |
| `/blog`, `/blog/[slug]` (5) | `blog.html`, `blog/<slug>/` |
| `/inquiry`, `/inquiry/quick` | `inquiry-detailed.html`, `inquiry-quick.html` |
| `/privacy-policy`, `/terms-conditions`, `/cancellation-policy`, `/cookie-policy` | same-named `.html` |

Old `.html` URLs permanently redirect to the new routes (`next.config.ts`).

## Content

All copy lives as JSON in `src/content/`, accessed through `src/lib/content.ts`.
It was generated from the legacy HTML plus `thai/data/*.json` by:

```bash
python3 -m pip install beautifulsoup4
python3 scripts/extract-legacy-content.py ../thai src/content
```

The extractor also repairs a few legacy pages: the "Wild Ceylon Predator &
Elephant Trail" page was a copy of another tour, and the three Buddhist
pilgrimage pages only had 6-day stub itineraries. These now use the full
records from `thai/data/packages.json`.

Company details, the shared FAQ and "Why Lotus" copy are in `src/lib/site.ts`.

## Design & motion

- `src/app/globals.css`: the artifact's tokens (ink, greys, navy, sky), Inter
  Tight with italic Playfair accent words, and every layout and component style.
- `src/components/motion.tsx`: Lenis smooth scroll on the GSAP ticker, masked
  line reveals with blurred italic characters (`Split`), rises, image unmasks,
  parallax, counters, and the background fading to navy (`NavyBand`).
- `src/components/home.tsx`: the hero film with captions synced to the
  video, the 3D card deck, the destination image swap and the sticky
  journeys feature.
- Everything respects `prefers-reduced-motion`.

## Backend integration

Every form (detailed and quick inquiry, contact, review, "Make it yours")
calls `submitForm()` in `src/lib/api.ts`. That function POSTs JSON to
`NEXT_PUBLIC_API_URL` at these endpoints:

| Form | Endpoint |
| --- | --- |
| Detailed inquiry | `POST /inquiries/detailed` |
| Quick inquiry | `POST /inquiries/quick` |
| Contact | `POST /contact` |
| Review | `POST /reviews` |
| Customize (reserved) | `POST /inquiries/customize` |

The inquiry payload (`InquiryPayload`) has the same shape as the legacy form's,
including the `LC-YYYY-NNNNNN` reference. If no API is configured, or a request
fails, the inquiry is handed to the WhatsApp concierge with a pre-filled
message, matching the legacy behaviour. Chat is currently the WhatsApp button.
A live chat widget can be mounted in `src/app/layout.tsx` once the backend
provides it.
