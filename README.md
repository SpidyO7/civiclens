# CivicLens

**From complaint to change.** CivicLens is a closed-loop civic accountability prototype for reporting, routing, tracking, escalating, resolving, and verifying public-infrastructure issues.

> CivicLens is an evidence, routing, tracking, accountability, escalation, and verification layer. It does not replace official government grievance systems.

## What it supports

The current application covers the following civic workflow:

`SEE → CAPTURE → LOCATE → SUBMIT → ROUTE → TRACK → ESCALATE → RESOLVE → VERIFY`

- **Citizen reporting** — camera capture, optional image selection fallback, description, selected category/subcategory, and severity.
- **Location capture** — browser GPS with a development geocoding response for address, ward, and municipality display.
- **Routing and SLA** — deterministic routing to a department and category/severity-based SLA deadlines.
- **Incident lifecycle** — status history, assignment, support/upvoting, resolution evidence, and citizen verification/reopen actions.
- **Authority workspace** — dashboard, incident queue, escalations, analytics, and a live incident map.
- **Public map** — incident markers and the user’s current browser location; no citizen identity is displayed on map markers.
- **Demo mode** — deterministic seeded incidents make the dashboards usable on first run.

## Tech stack

- [Next.js 14](https://nextjs.org/) App Router with TypeScript
- React 18 and Tailwind CSS
- Leaflet and React Leaflet for maps
- Recharts for dashboard analytics
- Local JSON-backed development datastore (`civiclens.db`)

## Quick start

### Prerequisites

- Node.js 18.17 or later
- npm

### Install and run

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On macOS/Linux, use `cp .env.example .env.local` instead of `copy`.

## Configuration

Create `.env.local` from `.env.example`.

```env
# Local datastore path; defaults to ./civiclens.db
DATABASE_URL=./civiclens.db

# Public URL used by the app
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Set to false to start without automatic demo records
NEXT_PUBLIC_DEMO_MODE=true
```

`VISION_API_KEY` and `VISION_API_URL` remain in `.env.example` for backward compatibility, but the current product flow does not call an external vision API. Category and subcategory stay citizen-editable; the classification endpoint provides only deterministic demo suggestions.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Citizen home page |
| `/report` | Camera-first issue report form with GPS location |
| `/map` | Public civic map |
| `/incident/[id]` | Incident details, support, and verification |
| `/dashboard` | Authority dashboard |
| `/incidents` | Authority incident queue |
| `/live-map` | Authority live incident map |
| `/analytics` | Authority analytics |
| `/escalations` | Escalation queue |
| `/settings` | Development settings, including demo-data seeding |

## Development demo data

When `NEXT_PUBLIC_DEMO_MODE` is not `false`, the datastore automatically seeds deterministic demo records when it has no incidents.

You can also seed records explicitly:

- Open `/settings` and choose **Seed demo data**, or
- Send `POST /api/seed`.

The local datastore is persisted to `civiclens.db`, which is ignored by Git. To reset local development data, stop the development server and delete only that local datastore file; the next demo-mode start will seed it again.

## API overview

| Endpoint | Purpose |
| --- | --- |
| `GET`, `POST /api/incidents` | List or create incidents |
| `GET /api/incidents/[id]` | Get an incident and related records |
| `POST /api/incidents/[id]/assign` | Assign an incident |
| `POST /api/incidents/[id]/status` | Update incident status |
| `POST /api/incidents/[id]/support` | Register citizen support |
| `POST /api/incidents/[id]/resolve` | Submit resolution evidence/note |
| `POST /api/incidents/[id]/verify` | Verify or reopen an incident |
| `POST /api/incidents/[id]/escalate` | Escalate an incident |
| `GET /api/analytics` | Dashboard, ward, and recurring-issue analytics |
| `GET /api/geocode` | Development geocoding response for coordinates |
| `POST /api/duplicates` | Find nearby duplicate candidates |
| `POST /api/classify` | Deterministic category suggestion for demo use |
| `POST /api/seed` | Seed deterministic demo data |

The canonical domain types are defined in `src/types/index.ts`.

## Quality checks

```bash
npm run lint
npm run build
```

To run the production server after a successful build:

```bash
npm run start
```

## Current prototype boundaries

- Authentication and identity are demo-only; they are not production authentication.
- The local JSON datastore is for development/demo use, not concurrent or production storage.
- Geocoding currently returns development fixture data rather than querying a real geocoding provider.
- Browser GPS and camera functionality require user permission and are unavailable on unsupported devices or insecure origins.
- Notification, duplicate detection, routing, SLA, and escalation are local deterministic workflows; they do not contact government systems or send real notifications.
- Resolution evidence uses application-provided image URLs/data in the demo flow; production deployments need durable object storage and access control.

## Suggested next steps

1. Replace demo identity with real authentication and role-based authorization.
2. Move the local datastore to a production database with migrations and durable image storage.
3. Integrate real reverse geocoding and jurisdiction boundaries for routing.
4. Add validated notification delivery and escalation recipients.
5. Add secure authority resolution-evidence uploads and a citizen verification notification workflow.

## License

This repository currently has no declared license.
