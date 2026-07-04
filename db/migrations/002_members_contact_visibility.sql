-- Member contact visibility toggles (email / phone on public profile)

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS show_email BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_phone BOOLEAN NOT NULL DEFAULT false;
