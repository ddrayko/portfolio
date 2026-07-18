-- ============================================================
-- Init SQL - v6-portfolio Database
-- Tables: settings, projets, admin
-- ============================================================

-- Settings (key-value pour toute la configuration)
CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       JSONB NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
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
    is_featured           BOOLEAN DEFAULT FALSE,
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
