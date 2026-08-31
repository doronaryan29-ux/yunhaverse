# YUNHAverse PH

YUNHAverse PH is a fan site for UNIS's Bang Yunha (방윤하), built for the Philippine fanbase. It showcases fan content, upcoming events, and countdowns, and includes a role-gated back office for admins and content staff.

This repository is organized as two applications:

- `frontend/` — React + Vite client application (the public site and staff/admin dashboards).
- `server-laravel/` — Laravel 12 API and backend.

## What's implemented today

The public homepage (`frontend/src/pages/Home.jsx`) is a single page composed of these sections:

- **Hero** — mascot badge, headline, and subheadline pulled from site settings.
- **Carousel** (`#highlights`) — auto-advancing image carousel with caption overlay and dot indicators.
- **Fan Art Showcase** (`#gallery`) — grid of fan art cards.
- **Countdown** (`#countdown`) — live countdown to the next tracked date, with switchable events.
- **Calendar / Upcoming Events** (`#events`) — month calendar with event filtering, search, and sorting, backed by a `/events` API call.
- **Footer contact** (`#footer-contact`) — social links and contact email.

There are no separate Gallery, Events, or Contact *pages* — the nav links to these as in-page anchors within Home. All three sections above are already implemented (not placeholders), though Calendar events depend on the Laravel API being available.

Beyond the homepage, the app also has hash-routed, role-gated areas (`frontend/src/App.jsx`): `#/login`, `#/admin`, `#/member`, `#/staff` (creative), `#/copywriter`, and `#/sns`, each backed by its own page under `frontend/src/pages/`.

## Tech stack

- **Frontend**: React 19 + Vite 7, hash-based routing (no router library), Tailwind CSS 4 for styling, `lucide-react` for icons, `sweetalert2` for alerts.
- **Backend**: Laravel 12 (PHP 8.2+), with Socialite for OAuth login.
- **Key frontend folders**: `src/pages` (routed views), `src/components` (home, layout, and role-specific admin/member/creative/copywriter/sns-updater components), `src/hooks`, `src/context`, `src/services` (API calls), `src/data` (static content like carousel/fan art items), `src/utils`.

## Running locally

From the repository root:

```bash
npm install
npm run dev
```

`npm install` installs the frontend's dependencies (via a `postinstall` step), and `npm run dev` starts the Vite dev server for `frontend/`. Other root scripts (`build`, `lint`, `preview`) proxy to the same commands in `frontend/`.

To run the Laravel API as well, set it up separately per `server-laravel/README.md`, or use `npm --prefix frontend run develop` to start both the frontend and `php artisan serve` together.
