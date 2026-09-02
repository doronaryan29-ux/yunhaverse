# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Fans (public site visitors)** — Filipino fans of UNIS' Bang Yunha (방윤하) browsing the public fan site to follow news, browse fan art, track countdowns to key dates, and check upcoming events.
- **Members (logged-in fans)** — registered fans with member-only perks (early ticket access, RSVP priority, member updates).
- **Admins** — operate the back office: manage members, donations/funds, events, audit logs, site settings, and broadcast notifications.
- **Creative staff** — handle production workflow requests/submissions (fan content, creative assets).
- **Copywriter** and **SNS Updater** — staff roles with their own dashboards for content/social-media operations.

All five roles (admin, member, creative, copywriter, sns_updater) are active and staffed today, not scaffolded placeholders.

## Product Purpose

YUNHAverse PH is a fan community site for a single K-pop idol's Philippine fanbase, pairing a branded public-facing site (news, gallery, countdowns, events) with a role-gated back office for the team running the fanbase (membership, donations, content production, communications, moderation).

## Positioning

The admin/back-office layer is being built as a **tenant-agnostic, shareable platform**: the intent is for other fanclubs to eventually run their own branded public site while sharing this same admin panel. This is a confirmed roadmap direction, not just a styling rationale — it is why the admin panel was deliberately redesigned away from the public site's pink/cutesy branding into a neutral, professional SaaS style (no fanclub-specific branding baked into admin UI).

## Operating Context

- Two codebases: `frontend/` (React 19 + Vite, hash-based routing, Tailwind CSS 4) and `server-laravel/` (Laravel 12 API, PHP 8.2+, PostgreSQL).
- Public site sections: Hero, Member Spotlight, Countdown, Latest Events, Gallery (own route), Calendar/Events (own route), Footer. Login/Signup/Password-reset are page-based flows (not modals).
- Admin back office sections: Dashboard (stat cards, Action Center quick actions, Needs Attention panel, Upcoming Calendar, Audit Log snapshot), Members, Production Workflow, Funds & Donations, Events, Audit Logs, Settings, Profile.
- The admin panel was recently redesigned to a neutral SaaS style (white/light-gray backgrounds, dark slate/charcoal text, a single restrained indigo accent) specifically because it must not carry any one fanclub's brand identity.
- The public site uses a distinct "neubrutalist" pink design system (thick ink borders, hard offset shadows, `--brand-*`/`--nb-*` CSS tokens) — this is intentionally different from the admin panel and must not be merged into it.

## Capabilities and Constraints

- Multi-tenancy is a confirmed direction for the admin panel specifically; the public site remains single-tenant/brand-specific per fanclub. Constraint: admin UI work must not assume or reintroduce fanclub-specific branding (colors, mascots, fonts) that would break when a second tenant is onboarded.
- Backend: Laravel 12, PostgreSQL, Socialite for Google OAuth.
- No dedicated test runner on the frontend (no vitest/jest configured); Laravel has PHPUnit scaffolding.
- Some content is intentionally placeholder/filler pending real assets (e.g., two of three "Latest Events" cards, the login/signup hero images, the "Fan Guidelines" link target) — future work should not treat these as final and should not fabricate additional fake content around them.

## Evidence on Hand

- Real brand assets: logo, real social links (Facebook/Twitter/Instagram), real member-facing copy already in place on the public site.
- No formal design system doc existed before this session; the neubrutalist public-site tokens and the neutral admin-panel palette are both implemented in code (`frontend/src/index.css`, admin component files) but not yet captured in a DESIGN.md.

## Product Principles

- Public site and admin panel are two distinct visual worlds by design — never let one leak into the other.
- The admin panel optimizes for data density and operator speed over decoration; the public site optimizes for fan-facing warmth and brand personality.
- Prefer real, working functionality over decorative filler; clearly mark anything that is still placeholder content.
- Keep the admin panel tenant-agnostic so a second fanclub can be onboarded without visual rework.
