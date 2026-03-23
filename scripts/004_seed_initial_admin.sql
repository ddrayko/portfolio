-- Insert initial admin
-- Password: [REDACTED_PASSWORD] (hashed with SHA-256)
INSERT INTO admins (email, password)
VALUES ('[REDACTED_EMAIL]', '[REDACTED_HASH]')
ON CONFLICT (email) DO NOTHING;
