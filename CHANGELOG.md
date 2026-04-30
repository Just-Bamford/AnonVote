# Changelog

All notable changes to AnonVote will be documented here.

---

## v1.1.0

### Improved

- **Complete frontend UI redesign** — Dark and light mode support with theme toggle
- **New design system** — Space Grotesk (headings), DM Sans (body), JetBrains Mono (monospace)
- **Framer-inspired dark mode** — Electric blue accents (#1c7ed6), pure black canvas (#000000), engineered precision
- **Apple-inspired light mode** — Clean surfaces, premium white space (#f5f5f7), ink type hierarchy
- **Improved error and success message components** — Consistent design system classes with proper icon sizing
- **Sticky navbar** — Fixed at top with frosted glass effect (backdrop-filter blur)
- **New footer** — Two-column layout with copyright/credit and navigation links
- **Password visibility toggle** — Eye icon on login and registration pages
- **Input field icon fixes** — Icons now correctly positioned inside fields
- **401 interceptor** — No longer redirects on public routes (login, register, token request)
- **Theme persistence** — Theme toggle now persists across sessions via localStorage
- **Dark mode toggle** — Manual toggle in navbar with sun/moon icon, persists user preference
- **PageLoader component** — Animated SVG loader with rose curve pattern and particle trail

### Fixed

- Input field icons now correctly positioned inside fields
- 401 interceptor no longer redirects on public routes
- Theme toggle now persists across sessions via localStorage

---

## v1.0.0

### Released

- **Organization registration and login** — Secure authentication with bcrypt password hashing
- **Ballot creation** — Dynamic options, eligibility list upload, voting deadline
- **Anonymous token-based voting** — One-time tokens with SHA-256 hashing
- **Results page** — Vote counts and percentages with visual breakdown
- **Stellar blockchain verification** — Tamper-proof results with public transaction IDs
- **Audit page** — Ballot transparency with event tracking
- **AES-256-GCM encryption** — Vote payloads encrypted with organization-specific key
- **SHA-256 voter token hashing** — No raw tokens stored in database
- **Eligibility list upload** — CSV/plain-text validation with injection prevention
- **Rate limiting** — Strict rate limiter (3 req/min) for vote submission
- **Session management** — JWT-based sessions with 8-hour expiration
- **Audit event tracking** — TOKEN_ISSUED, VOTE_CAST, RESULT_PUBLISHED events
- **Duplicate attempt detection** — Prevents token reuse and vote duplication

---

## v0.1.0

### Initial Development

- **Backend scaffolding** — Express.js with TypeScript
- **Prisma ORM setup** — PostgreSQL with Supabase connection
- **Core services** — Ballot engine, privacy engine, result engine, identity manager
- **Stellar integration** — Testnet blockchain for immutable audit trail
- **Frontend scaffolding** — React with Vite, TypeScript, Tailwind CSS
- **API client** — TypeScript client with axios interceptors
- **Theme context** — Dark/light mode toggle with localStorage persistence
