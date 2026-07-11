-- Team invites: captain invites a member, member accepts or declines
-- Run: pnpm db:migrate

CREATE TABLE IF NOT EXISTS team_invites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  team_id TEXT NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  from_user_id TEXT NOT NULL REFERENCES members (user_id) ON DELETE CASCADE,
  to_user_id TEXT NOT NULL REFERENCES members (user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'declined', 'cancelled')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS team_invites_pending_unique_idx
  ON team_invites (team_id, to_user_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS team_invites_to_user_pending_idx
  ON team_invites (to_user_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS team_invites_team_pending_idx
  ON team_invites (team_id)
  WHERE status = 'pending';
