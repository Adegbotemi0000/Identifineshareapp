@AGENTS.md
# IdentiShare — Project Context

Digital identity and contact-sharing platform (like a digital business card). Two sides: **Personal** (individuals) and **Corporate** (companies managing staff). Built frontend-first as a working prototype; backend/payments are deliberately deferred (Phase 12) and honestly stubbed where not yet real.

## Tech stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- `framer-motion`, `lucide-react`, `qrcode.react` (already installed)
- No backend yet — everything persists in browser `localStorage`

## Design system
- Palette: paper `#fefdfb`, ivory `#f6f2ea`, ink `#1b1a17`, ink-soft `#4a4740`, gold `#ad8a3f` — CSS custom properties in `src/app/globals.css`, consumed via Tailwind `@theme`
- Type: Fraunces (display/headings), Inter (body), IBM Plex Mono (data/labels/usernames)
- `PhoneViewport` (`src/components/layout/phone-viewport.tsx`) wraps most app screens — phone frame on desktop, full-width on mobile
- Public profiles are dynamically themed per-user: `backgroundColor` + `accentColor` fields drive everything via CSS `color-mix()` (see `src/lib/color.ts` `getContrastTextColor` for auto-legible text/icon colors against any chosen color)

## Core data model (`src/lib/storage.ts`)
- **`Profile`** is the single object type reused for BOTH personal profiles and corporate staff members (staff = a Profile with `companySlug` + `department` set). Do not create a separate staff type.
- `STORAGE_KEYS` centralizes every localStorage key — always add new keys there, never inline a raw string key elsewhere.
- Portfolio filename/size live directly on `Profile` (`portfolioFileName`, `portfolioFileSize`) — NOT a separate global key (that was a real bug we fixed: multiple staff profiles collided on one shared global slot).

## Corporate (`src/lib/company.ts`)
- `Company` object holds org-wide branding (logo, coverImage, backgroundColor, accentColor) + contact/social info.
- **Staff inherit the company's coverImage/backgroundColor/accentColor automatically** — call `applyCompanyBranding(profile, company)` before every `saveStaffProfile()` call, so staff branding always matches current company settings. Staff keep their own `profilePhoto`.
- Staff are stored as an array under `STORAGE_KEYS.staffProfiles`.

## Key routes
**Personal:** `/signup` → `/verify` → `/username` → `/profile-setup` (5-step wizard) → `/dashboard`. Public: `/profile/[username]`. Also `/share`, `/settings`, `/analytics`, `/pricing`, `/contact`.

**Corporate:** `/signup` (Corporate toggle) → `/verify` → `/corporate-setup` (3-step: Company Info, Branding, Company URL) → `/corporate-dashboard`. Staff: `/corporate-dashboard/staff` (directory), `/corporate-dashboard/staff/new` (add), `/corporate-dashboard/staff/[staffUsername]` (5-step edit wizard mirroring personal profile-setup). Public staff profile: `/profile/[companySlug]/[staffUsername]`.

- `src/app/profile/[username]/page.tsx` resolves EITHER a personal Profile OR a Company slug at the same URL shape — checks both.
- `src/components/profile/public-profile-view.tsx` is the shared public-profile renderer used by both personal and staff routes (avoid duplicating this UI).

## Honesty rules (important — carry these forward)
This is a real product principle established throughout the build, not just a nice-to-have:
- Never fabricate data presented as real (e.g., analytics numbers). `src/lib/analytics.ts` logs REAL events from this browser only (views tagged via `?src=qr`/`?src=share` URL params, device type from real `navigator.userAgent`). It's explicit in the UI that full cross-device analytics needs a real backend.
- Payment/Paystack is honestly stubbed (`/pricing` "Upgrade" shows a "not connected yet" notice, never fakes success).
- Prototype-only flows (OTP verification, forgot-password) say so explicitly in the UI rather than pretending to send real emails.

## Known bugs to fix first
1. `/corporate-dashboard/staff` — 404
2. `/profile/[company-slug]` (e.g. `/profile/xtremecr8`) — 404
3. Add Staff wizard — clicking "Finish" on the last step doesn't save/redirect correctly

Please investigate root cause (likely file/folder placement or a routing conflict) rather than guessing — read the actual file tree under `src/app/corporate-dashboard/` and `src/app/profile/` first.

## Not yet built (next planned work, in no particular order)
- QR code templates (WiFi, Calendar event, Location — not just vCard) + customization (gradient colors, embedded logo, decorative frames)
- Corporate HRM: sort/filter staff by name/department, pause/resume a staff member's public link (shows an error when scanned while paused)
- Bulk staff import via CSV/Excel/vCard (needs `papaparse` + `xlsx` packages, not yet installed)
- UTM parameter capture + fuller device/browser/language analytics breakdown

## Working style
- Fix one thing at a time, verify it works, then move to the next — don't bundle unrelated changes.
- Full, complete files — never partial snippets or "replace this section" instructions.