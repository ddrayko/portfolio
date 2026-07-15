<img src="public/assets/logo/pictoandtext.png" alt="Drayko Logo" width="400"/>

# Drayko v6 Portfolio

> High-performance portfolio platform built with Next.js 16, Drizzle ORM, and PostgreSQL. Features a dynamic project showcase, interactive timeline, admin dashboard, versioning system, and real-time maintenance controls.

> [!CAUTION]
> This portfolio was built for a specific environment (**Vercel** deployment, **Supabase** database, dedicated environment variables, etc.). It is **not guaranteed** to work out of the box if cloned into a different setup. You will likely need to adjust parts of the code (configuration, environment variables, endpoints, etc.) to make it compatible with your own environment.

> [!CAUTION]
> The installation scripts located at `public/installer.sh` and `public/update.sh` should **NOT** be used at this time, they still contain a significant number of bugs. This should be fully resolved in **v7**.

> [!IMPORTANT]
> This project was originally built for my own personal use, so you might come across things like custom popups or specific messages tailored for my site. I'm currently working on **v7** of the portfolio, where everything will be manageable through an admin panel instead of being hardcoded directly in the codebase.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16.2](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4, `tw-animate-css`, OKLCH color space |
| **Database** | PostgreSQL (via [Neon](https://neon.tech) serverless) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) 0.45 |
| **Auth** | Custom cookie-based (bcryptjs, httpOnly sessions, 24h expiry) |
| **UI Primitives** | Radix UI (20+ components), shadcn/ui style |
| **Icons** | Lucide React |
| **Fonts** | Inter (sans), Outfit (display) via `next/font/google` |
| **Notifications** | Sonner |
| **Deployment** | Vercel (production), Codeberg (source) |
| **Infrastructure** | OVHcloud VPS, Nginx, PM2, Docker |

---

## Architecture

```mermaid
flowchart LR
    subgraph Client["Client Layer"]
        Browser["Browser"]
        React["React 19 + RSC"]
    end

    subgraph NextJS["Next.js 16 App Router"]
        Layout["layout.tsx — fonts, footer, popups"]
        Pages["12 routes: / /about /contact /update /privacy /terms /copyright /tags-info /maintenance /[slug]/update /admin + dashboard"]
        API["Server actions — CRUD projects, admins, versions, settings, site updates"]
    end

    subgraph Components["Components"]
        Public["Public — ProjectCard, TechStack, PortfolioContent, TagFilter, VersionSelector"]
        Admin["Admin — DashboardClient, Forms, Dialogs, Toggles"]
        UI["UI primitives — 20 Radix + shadcn/ui components"]
    end

    subgraph Data["Data Layer"]
        Drizzle["Drizzle ORM"]
        DB[("PostgreSQL — 5 tables")]
        Schema["projects · admins · settings · site_updates · versions"]
    end

    Client --> NextJS
    NextJS --> Components
    NextJS --> API
    API --> Drizzle
    Drizzle --> DB
    Components --> UI
```

---

## Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Dynamic | Homepage — hero (badge links to /update or custom URL), project grid, tech stack marquee, CTA |
| `/about` | Dynamic | Developer story, philosophy cards, personal note |
| `/contact` | Dynamic | Contact info, availability status, email copy |
| `/update` | Dynamic | System roadmap with countdown + changelog history |
| `/[slug]/update` | Dynamic | Per-project changelog (auto: `/update` for drayko.xyz) |
| `/admin` | Dynamic | Admin login form (cookie-based session) |
| `/admin/dashboard` | Dynamic | Full admin panel — CRUD for all entities |
| `/maintenance` | Dynamic | Maintenance mode display (server-redirected) |
| `/privacy` | Static | Privacy policy |
| `/terms` | Static | Terms of service |
| `/copyright` | Static | Copyright & license info |
| `/tags-info` | Dynamic | Tag/status legend for project badges |
| `/sitemap.xml` | Generated | Dynamic sitemap (8 routes, weekly/monthly) |
| `/robots.txt` | Generated | Disallows `/admin`, `/maintenance`, `/update` |

---

## Database Schema

```mermaid
erDiagram
    projects {
        serial id PK
        text title
        text slug UK
        text description
        text image_url
        text[] tags
        text project_url
        text github_url
        boolean in_development
        text development_status
        boolean is_completed
        boolean is_archived
        integer development_progress
        jsonb changelog
        timestamp created_at
    }

    admins {
        serial id PK
        text email UK
        text password
        timestamp created_at
    }

    settings {
        text key PK
        jsonb value
        timestamp updated_at
    }

    site_updates {
        serial id PK
        timestamp next_update_date
        boolean no_update_planned
        jsonb planned_features
        jsonb changelog
        text latest_update_text
        boolean show_last_update_prefix
        text hero_link_type
        text hero_custom_url
        timestamp updated_at
    }

    versions {
        serial id PK
        text name
        text description
        text link
        boolean is_current
        timestamp created_at
    }
```

---

## Component Tree

```mermaid
flowchart LR
    subgraph Public["Public Pages"]
        Home["Home Page
              page.tsx"]
        About["About Page
              about/page.tsx"]
        Contact["Contact Page
                contact/page.tsx"]
        Update["Update Page
               update/page.tsx"]
    end

    Home --> Portfolio["PortfolioContent
                       client component"]
    Home --> Tech["TechStack
                  client component"]
    Home --> Version["VersionSelector"]
    Home --> PF["ProjectCard
                (per project)"]

    Portfolio --> Tag["TagFilter"]
    Portfolio --> Search["Search bar"]

    Tech --> TechCard["TechCard
                       (47 technologies, 3 marquee rows)"]

    Update --> Changelog["ChangelogList"]
    Update --> CountdownComponent["Countdown
                                   (Odometer.js CDN)"]

    Contact --> CopyBtn["CopyEmail
                         clipboard button"]
```

```mermaid
flowchart LR
    subgraph Admin["Admin /dashboard"]
        Dashboard["AdminDashboardClient
                  531-line client component"]
    end

    Dashboard --> Sections["Accordion Sections"]
    
    Sections --> Section1["Projects
                           CRUD + cards"]
    Sections --> Section3["Versions
                           CRUD + cards"]
    Sections --> Section4["Admins
                           CRUD + cards"]
    Sections --> Section5["Site Settings
                           UpdateDialog
                           BadgeDialog (headline + prefix + link destination)
                           MaintenanceToggle
                           AvailabilityToggle"]

    Section1 --> ProjDialog["ProjectDialog"]
    Section1 --> ProjForm["ProjectForm
                           (2 tabs: details + changelog)"]
    Section1 --> ProjCard["AdminProjectCard"]
    Section1 --> DeleteProj["DeleteProjectDialog"]

    Section3 --> VerDialog["VersionDialog"]
    Section3 --> VerForm["VersionForm"]
    Section3 --> VerCard["AdminVersionCard"]

    Section4 --> AdmDialog["AdminDialog"]
    Section4 --> AdmForm["AdminForm"]
    Section4 --> AdmCard["AdminCard"]
    Section4 --> DeleteAdm["DeleteAdminDialog"]
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant S as Next.js Server
    participant D as PostgreSQL

    Note over B,S: Public page request
    B->>S: GET / (any page)
    S->>S: checkMaintenance() + isLocalRequest()
    alt Maintenance ON & not local
        S->>B: 302 Redirect /maintenance
    else Normal
        S->>D: SELECT projects, versions, site_updates
        D-->>S: data rows
        S->>S: Serialize dates (toISOString)
        S-->>B: Rendered HTML + RSC payload
    end

    Note over B,S: Admin login
    B->>S: POST login (email, password)
    S->>D: SELECT admin WHERE email = ?
    S->>S: bcrypt.compare(password, hash)
    alt Valid
        S->>S: Set httpOnly cookie (24h)
        S->>B: 302 Redirect /admin/dashboard
    else Invalid
        S-->>B: { success: false, error }
    end

    Note over B,S: Admin CRUD
    B->>S: Server Action (create/update/delete)
    S->>S: checkAdminSession()
    S->>D: INSERT / UPDATE / DELETE
    D-->>S: result
    S->>S: revalidatePath("/")
    S-->>B: { success: true, data }
```

---

## Features

### Public
- **Dynamic Project Grid** — Searchable, filterable by tags, responsive 3-column grid
- **Project Cards** — Rich status indicators (WIP, paused, finished, archived) with progress bars, live demo/code links, and update history
- **Tech Stack Marquee** — 47 technology icons in 3 auto-scrolling rows with hover pause
- **Journey Timeline** — Alternating left/right cards with Lucide icons, animated on viewport
- **System Roadmap** — Next-update countdown (Odometer.js) + versioned changelog
- **Hero Badge** — Dynamic badge with configurable link destination (update page or custom URL)
- **Version Selector** — Dropdown to switch between portfolio versions with old-version detection popup
- **Availability Badge** — Real-time "Open for projects" indicator on contact page
- **Maintenance Mode** — Server-side redirect with bypass for local requests

### Admin
- **Full CRUD** — Projects, Versions, Admins
- **Project Editor** — Two-tab form (details + reorderable changelog)
- **Site Updates** — Edit roadmap, changelog, planned features, badge text, and badge link destination (update page / custom URL)
- **Maintenance Toggle** — Enable/disable site-wide with custom message and ETA
- **Availability Toggle** — "Open for projects" switch
- **Version Management** — Create named versions with links (e.g., v5, v6-beta)

### Technical
- **Cookie-based Auth** — httpOnly, secure (production), sameSite=lax, 24h expiry
- **Lazy DB Proxy** — Postgres connection deferred until first query; mock fallback in dev without DATABASE_URL
- **TypeScript Strict** — Full strict mode with build-time type checking disabled
- **Force-dynamic** — All pages server-rendered on each request (no stale data)
- **Dynamic Sitemap** — Auto-generated sitemap.xml + robots.txt
- **Console Easter Egg** — Hidden message in browser devtools

---

## Performance

### Build Time (Vercel)

```
Before:          22–30s
After cleanup:   ~8–12s (estimated on Vercel)
Local build:     ~3s (compilation: 2.7s)
```

Optimizations applied:
- Removed 28 unused dependencies (91 packages removed from `node_modules`)
- Moved type packages to `devDependencies`
- `typescript.ignoreBuildErrors: true`
- `npm ci --prefer-offline` on Vercel installs
- Turbopack (default in Next.js 16)

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Neon serverless)
- npm

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:password@host:5432/db
# or
POSTGRES_URL=postgresql://user:password@host:5432/db
```

### Install & Run

```bash
git clone https://codeberg.org/ddrayko/v6-portfolio.git
cd v6-portfolio
npm install
npm run dev        # http://localhost:3000
```

### Build

```bash
npm run build
npm start          # production server on :3000
```

### Database

```bash
npm run db:push       # Push schema to database
npm run db:generate   # Generate migration files
npm run db:studio     # Open Drizzle Studio GUI
```

Seed scripts are in `scripts/`:
- `001_create_projects_table.sql` to `005_update_admin_password.sql`
- `hash-password.js` — generate bcrypt hashes for admin passwords

---

## Project Structure

```
v6-portfolio/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout (fonts, footer, popups)
│   ├── page.tsx          # Homepage
│   ├── about/
│   ├── contact/
│   ├── update/
│   ├── admin/
│   │   ├── page.tsx      # Login
│   │   └── dashboard/    # Admin panel
│   ├── [slug]/update/    # Per-project changes
│   └── sitemap.ts        # Dynamic sitemap
├── components/
│   ├── ui/               # 20 shadcn/ui primitives
│   ├── project-card.tsx
│   ├── tech-stack.tsx
│   ├── portfolio-content.tsx
│   └── ... (33 custom components)
├── db/
│   ├── schema.ts         # 6 Drizzle tables
│   └── index.ts          # Lazy DB client
├── lib/
│   ├── actions.ts        # 16 server actions
│   ├── admin-auth.ts     # Cookie auth system
│   ├── server-utils.ts   # Local request detection
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # cn() helper
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── public/
│   ├── assets/tech/      # 47 technology icons
│   └── ...               # Favicon, logos
├── scripts/              # SQL migrations + utilities
├── next.config.mjs
├── vercel.json
└── package.json
```

---

## License

This project is free software — see [COPYRIGHT.md](COPYRIGHT.md) for details.
