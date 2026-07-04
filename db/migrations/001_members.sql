-- Platform member profiles (Phase 1)
-- Run after Better Auth migrations: pnpm auth:migrate && pnpm db:migrate
--
-- Future: nullable user_id + email-first import for waitlist users who have not
-- signed in yet (Phase 1b). See docs/PLATFORM.md.

CREATE TABLE IF NOT EXISTS members (
  user_id TEXT PRIMARY KEY REFERENCES "user" (id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  age INTEGER CHECK (age IS NULL OR (age >= 18 AND age <= 120)),
  sex TEXT CHECK (
    sex IS NULL OR sex IN ('male', 'female', 'other', 'preferNotToSay')
  ),
  school TEXT,
  github TEXT,
  interests TEXT,
  bio TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  open_to_teams BOOLEAN NOT NULL DEFAULT true,
  waitlist_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS members_email_idx ON members (email);
CREATE INDEX IF NOT EXISTS members_open_to_teams_idx ON members (open_to_teams);

CREATE OR REPLACE FUNCTION set_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS members_updated_at ON members;
CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION set_members_updated_at();
