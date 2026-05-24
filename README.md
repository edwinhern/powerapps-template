# Field Equipment Parts

Responsive Power Apps Code App for field crews to request replacement equipment parts. The app runs locally with Vite for UI work and is intended to be published to Power Apps for phone and tablet use.

## What is included

- Mobile-first parts catalog with search by part name, part number, or category
- Availability labels and disabled add buttons for out of stock parts
- Shopping cart with quantity controls, removal, line totals, and estimated total
- Request submission that creates a pending request in local app state
- Read-only request status view
- Vitest tests for cart logic, catalog search, request creation, and the app shell
- GitHub Actions workflow for lint, test, and build

## Current data mode

The app uses mock parts from `src/features/parts/mock-parts.ts` so the UI can run locally before Microsoft Lists access is connected.

The planned Microsoft Lists are:

- `Replacement Parts`
- `Equipment Requests`

The request creation code is isolated in `src/features/requests/request-store.ts` so the later Microsoft Lists adapter can replace the local in-memory behavior without changing the screens.

## Local development

Install dependencies:

```bash
npm install
```

Run the local app:

```bash
npm run dev
```

Run checks:

```bash
npm run lint
npm test
npm run build
```

## Power Apps deployment

Install and sign in to the Power Platform CLI before pushing:

```bash
pac auth create
```

Create the Code App project binding:

```bash
POWERAPPS_APP_DISPLAY_NAME="Field Equipment Parts" \
POWERPLATFORM_ENVIRONMENT_ID="00000000-0000-0000-0000-000000000000" \
npm run powerapps:init
```

Build and push:

```bash
npm run powerapps:push
```

After publish, open the app from Power Apps Maker Portal, share it with field crew users, and test it in Power Apps Mobile.

## Environment values

Copy `.env.example` to `.env.local` for local values. Do not commit real tenant IDs, site IDs, list IDs, or secrets.

## Approval flow

Power Automate approval is not wired in this starter. After the `Equipment Requests` list write is connected, create a flow that starts on new request rows, sends approval notifications to approvers, and writes `Status`, `Approval Date`, and `Approver Comments` back to Microsoft Lists.
