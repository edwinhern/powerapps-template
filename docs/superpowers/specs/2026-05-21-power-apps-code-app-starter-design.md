# Power Apps Code App Starter Design

## Goal

Create a starter repository for a field crew replacement parts request app that runs through Power Apps. The repo should be friendly to AI coding tools, GitHub version control, local visual testing, and Power Platform deployment.

The first version will be a working starter, not a finished production app. It should give the team a clean base to build from.

## Target Platform

The main target is Power Apps Code Apps.

This keeps the app inside the Power Apps runtime so field crews can use it from Power Apps mobile, while still letting developers work in a normal React, TypeScript, Vite codebase.

The app will be scaffolded from the Microsoft Power Apps Code Apps starter template. Deployment will use Power Platform CLI commands:

```bash
pac code init --displayName "$POWER_APPS_APP_DISPLAY_NAME" --environment "$POWER_PLATFORM_ENVIRONMENT_ID"
npm run build
pac code push
```

## Local Development

The repo will support local visual testing with Vite:

```bash
npm run dev
```

Local testing will cover UI layout, mobile and tablet responsiveness, navigation, cart behavior, and request submission flow using mock data.

Final validation in Power Apps mobile will happen after the app is pushed to Power Apps.

## App Experience

The starter app will include these screens:

## Parts Catalog

Shows replacement parts as large, touch-friendly cards or buttons. Users can search by part name, part number, or category. Each part shows availability, unit cost, and an add-to-cart action with quantity selection.

## Shopping Cart

Shows selected parts, quantities, line totals, and total estimated cost. Users can increase quantity, decrease quantity, remove items, and submit the request.

## Submit Request

Creates a pending equipment request. In local mock mode, it stores the request in app state. After Microsoft Lists are connected, it will write to the Equipment Requests list.

## Request Status

Shows the current user's submitted requests in a read-only list with status, submission date, approval date, total cost, and approver comments.

## Data Model

The app expects two Microsoft Lists.

## Replacement Parts

Columns:

- Title
- Part Number
- Category
- Description
- Availability
- Unit Cost

## Equipment Requests

Columns:

- Request ID
- Requestor Name
- Requestor Email
- Requested Parts
- Total Estimated Cost
- Status
- Submission Date
- Approval Date
- Approver Comments

Requested Parts will be stored as a serialized list of part name, part number, quantity, and unit cost unless a later Power Platform design changes it to related child records.

## Repo Structure

Expected structure:

```text
src/
  app/
  components/
  data/
  hooks/
  lib/
  screens/
.github/workflows/
docs/
```

Key areas:

- `src/screens` contains page-level catalog, cart, submit, and status screens.
- `src/components` contains reusable UI components built with shadcn UI and lucide icons.
- `src/data` contains mock parts, mock requests, and later the Microsoft Lists data adapter.
- `src/hooks` contains cart and request state hooks.
- `src/lib` contains formatting, totals, and small helpers.

## UI System

The starter will use Tailwind, shadcn UI, and lucide icons. The visual style will favor high contrast, large tap targets, simple navigation, clear status badges, and low typing effort for field crews.

The first UI does not need custom branding. It should be easy to rebrand later by changing Tailwind tokens and shared components.

## Data Access Strategy

The initial starter will use mock data so it can run locally without tenant access.

The Microsoft Lists connection will be isolated behind a data adapter so the app can switch from mock data to real Power Platform data without changing screen components.

The likely real data path is Microsoft Lists through the Power Apps Code Apps supported APIs or Microsoft Graph if needed. This choice can be finalized once the tenant and Code Apps capabilities are confirmed.

## Deployment

The repo will include scripts for:

- local development
- production build
- Power Apps init
- Power Apps push

GitHub Actions will initially run install, lint, typecheck, and build on pull requests and main branch pushes.

A later deploy job can use Power Platform credentials and environment secrets after the target tenant, environment ID, app name, and solution name are known.

## Environments

The starter will use `.env.example` to document required values:

- Power Platform environment ID
- app display name
- solution name
- Microsoft List names
- optional site or list IDs if Graph is used

The repo should not commit real tenant IDs, client secrets, or user credentials.

## Security

Any authenticated field crew user can submit requests. Field crew users cannot edit submitted requests through the app.

Approvals should be handled outside the field crew UI through Power Automate and approver-only permissions.

## Automation

Power Automate will trigger after an Equipment Requests item is created. The flow will send an approval request by email or Teams and include requested parts, quantities, and total estimated cost.

The repo can include setup notes or placeholder config for this flow, but the first starter build will focus on the app source and deployment path.

## Testing

The starter should verify:

- build passes
- TypeScript passes
- lint passes
- cart totals are calculated correctly
- quantity changes update line totals and total estimated cost
- local UI works on mobile and tablet viewport sizes

## Scope Boundaries

Included in the starter:

- Power Apps Code Apps project setup
- React app shell
- responsive field crew UI
- mock data mode
- cart state
- request status state
- GitHub Actions build workflow
- Power Apps CLI scripts

Not included in the first starter:

- production Microsoft Lists tenant wiring
- real Power Automate flow export
- approver admin UI
- offline sync
- barcode scanning
- inventory decrement logic

These can be added after the starter is running locally and deploys successfully to Power Apps.
