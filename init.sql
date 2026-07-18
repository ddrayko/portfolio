-- ============================================================
-- Init SQL - v6-portfolio Database
-- Tables: settings, update, projets, admin
-- ============================================================

-- Settings (key-value pour toute la configuration)
CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       JSONB NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Update (page /update - roadmap et changelog)
CREATE TABLE IF NOT EXISTS "update" (
    id                    SERIAL PRIMARY KEY,
    next_update_date      TIMESTAMPTZ,
    no_update_planned     BOOLEAN DEFAULT TRUE,
    planned_features      JSONB DEFAULT '[]'::JSONB,
    changelog             JSONB DEFAULT '[]'::JSONB,
    latest_update_text    TEXT,
    show_last_update_prefix BOOLEAN DEFAULT TRUE,
    show_badge            BOOLEAN DEFAULT TRUE,
    hero_link_type        TEXT DEFAULT 'update',
    hero_custom_url       TEXT,
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Projets (projets du portfolio)
CREATE TABLE IF NOT EXISTS projets (
    id                    SERIAL PRIMARY KEY,
    title                 TEXT NOT NULL,
    slug                  TEXT NOT NULL UNIQUE,
    description           TEXT,
    image_url             TEXT,
    tags                  TEXT[],
    project_url           TEXT,
    github_url            TEXT,
    in_development        BOOLEAN DEFAULT FALSE,
    development_status    TEXT DEFAULT 'active',
    is_completed          BOOLEAN DEFAULT FALSE,
    is_archived           BOOLEAN DEFAULT FALSE,
    development_progress  INTEGER DEFAULT 0,
    changelog             JSONB DEFAULT '[]'::JSONB,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Admin (utilisateurs admin)
CREATE TABLE IF NOT EXISTS admin (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_projets_slug ON projets (slug);
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin (email);

-- Seed par défaut : settings
INSERT INTO settings (key, value) VALUES
    ('general',       '{"maintenance_mode": false, "maintenance_message": "", "maintenance_progress": 0}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
    ('availability',  '{"isAvailable": true}')
ON CONFLICT (key) DO NOTHING;

-- Seed par défaut : update (une seule ligne)
INSERT INTO "update" (no_update_planned, planned_features, changelog) VALUES
    (TRUE, '[]'::JSONB, '[]'::JSONB)
ON CONFLICT DO NOTHING;
