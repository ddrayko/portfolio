<img src="public/pictoandtext.png" alt="Drayko Logo" width="400"/>

# Drayko v6 Portfolio

**v6.1.8** — [drayko.xyz](https://drayko.xyz)

> High-performance portfolio platform built with Next.js 16, Drizzle ORM, and PostgreSQL. Features a dynamic project showcase, interactive timeline, admin dashboard, versioning system, and real-time maintenance controls.

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
flowchart TB
    subgraph Client["Client Layer"]
        Browser["Browser"]
        React["React 19 + RSC"]
    end

    subgraph NextJS["Next.js 16 App Router"]
        direction TB
        Layout["Root Layout (layout.tsx)
                - Inter + Outfit fonts
                - Footer
                - BackToTop
                - ConsoleEasterEgg
                - OldVersionPopup"]
        
        Pages["Pages (13 routes)
                /               → Home
                /about          → About
                /contact        → Contact
                /journey        → Timeline
                /update         → Roadmap
                /privacy        → Privacy
                /terms          → Terms
                /copyright      → Copyright
                /tags-info      → Tag Legend
                /maintenance    → Maintenance
                /[slug]/update  → Project Updates
                /admin          → Login
                /admin/dashboard → Admin Panel"]
        
        API["Server Actions (16)
                CRUD: Projects, Admins, Moments,
                Versions, Settings"]
    end

    subgraph Components["Components Layer"]
        direction TB
        Public["Public Components
                ProjectCard · TechStack · TagFilter
                PortfolioContent · MomentTimeline
                VersionSelector · CopyEmail
                Countdown · ChangelogList"]
        
        Admin["Admin Components
                AdminDashboardClient · AdminForm
                ProjectForm · MomentForm
                VersionForm · UpdateDialog
                BadgeDialog · MaintenanceToggle
                AvailabilityToggle"]
        
        UI["UI Primitives (20)
                Button · Dialog · Accordion · Card
                Select · Sheet · Toast · Tooltip
                DropdownMenu · Tabs · ..."]
    end

    subgraph Data["Data Layer"]
        Drizzle["Drizzle ORM"]
        DB[(PostgreSQL
            6 tables)]
        Schema["Schema
                projects · admins · settings
                site_updates · moments · versions"]
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
| `/` | Dynamic | Homepage — hero, project grid, tech stack marquee, CTA |
| `/about` | Dynamic | Developer story, philosophy cards, personal note |
| `/contact` | Dynamic | Contact info, availability status, email copy |
| `/journey` | Dynamic | Animated timeline of education, work, and milestones |
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
        timestamp updated_at
    }

    moments {
        serial id PK
        text title
        text description
        text date
        text type
        text icon
        timestamp created_at
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
        Journey["Journey Page
                journey/page.tsx"]
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

    Journey --> Timeline["MomentTimeline
                         client component"]
    Timeline --> MomentCard["Moment Card
                             (education/work/milestone)"]

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
    Sections --> Section2["Moments
                           CRUD + cards"]
    Sections --> Section3["Versions
                           CRUD + cards"]
    Sections --> Section4["Admins
                           CRUD + cards"]
    Sections --> Section5["Site Settings
                           UpdateDialog
                           BadgeDialog
                           MaintenanceToggle
                           AvailabilityToggle"]

    Section1 --> ProjDialog["ProjectDialog"]
    Section1 --> ProjForm["ProjectForm
                           (2 tabs: details + changelog)"]
    Section1 --> ProjCard["AdminProjectCard"]
    Section1 --> DeleteProj["DeleteProjectDialog"]

    Section2 --> MomDialog["MomentDialog"]
    Section2 --> MomForm["MomentForm"]
    Section2 --> MomCard["AdminMomentCard"]

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
    participant Client as Browser
    participant Server as Next.js Server
    participant DB as PostgreSQL

    Note over Client,DB: Public Pages (every request)
    Client->>Server: GET / (or any page)
    Server->>Server: checkMaintenance() + isLocalRequest()
    alt Maintenance Mode ON & not local
        Server->>Client: 302 Redirect /maintenance
    else Normal flow
        Server->>DB: SELECT projects, versions, site_updates
        DB-->>Server: Serialized data
        Server->>Server: Serialize dates (toISOString)
        Server-->>Client: Rendered HTML + RSC payload
    end

    Note over Client,DB: Admin Login
    Client->>Server: POST login (email + password)
    Server->>DB: SELECT admin WHERE email = ?
    Server->>Server: bcrypt.compare(password, hash)
    alt Valid credentials
        Server->>Server: Set httpOnly cookie (admin_session, 24h)
        Server->>Client: 302 Redirect /admin/dashboard
    else Invalid
        Server-->>Client: { success: false, error: "..." }
    end

    Note over Client,DB: Admin CRUD (authenticated)
    Client->>Server: Server Action (create/update/delete)
    Server->>Server: checkAdminSession()
    Server->>DB: INSERT / UPDATE / DELETE
    DB-->>Server: Result
    Server->>Server: revalidatePath("/")
    Server-->>Client: { success: true, data }
```

---

## Features

### Public
- **Dynamic Project Grid** — Searchable, filterable by tags, responsive 3-column grid
- **Project Cards** — Rich status indicators (WIP, paused, finished, archived) with progress bars, live demo/code links, and update history
- **Tech Stack Marquee** — 47 technology icons in 3 auto-scrolling rows with hover pause
- **Journey Timeline** — Alternating left/right cards with Lucide icons, animated on viewport
- **System Roadmap** — Next-update countdown (Odometer.js) + versioned changelog
- **Version Selector** — Dropdown to switch between portfolio versions with old-version detection popup
- **Availability Badge** — Real-time "Open for projects" indicator on contact page
- **Maintenance Mode** — Server-side redirect with bypass for local requests

### Admin
- **Full CRUD** — Projects, Moments, Versions, Admins
- **Project Editor** — Two-tab form (details + reorderable changelog)
- **Site Updates** — Edit roadmap, changelog, planned features, badge text
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
│   ├── journey/
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
│   ├── moment-timeline.tsx
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

---

*Built with Next.js, PostgreSQL, and a lot of coffee.*
