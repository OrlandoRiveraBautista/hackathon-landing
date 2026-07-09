import { getPool } from "@/lib/db";
import type { TeamInvite, TeamInviteStatus } from "@/lib/teams/types";
import { getTeamWithMembersAndProject } from "@/lib/teams/index";

type InviteRow = {
  id: string;
  team_id: string;
  team_name: string;
  from_user_id: string;
  from_user_name: string;
  from_user_image_url: string | null;
  to_user_id: string;
  to_user_name: string;
  status: TeamInviteStatus;
  created_at: Date;
  responded_at: Date | null;
};

const inviteSelect = `
  SELECT
    ti.id,
    ti.team_id,
    t.name AS team_name,
    ti.from_user_id,
    fm.name AS from_user_name,
    fu.image AS from_user_image_url,
    ti.to_user_id,
    tm.name AS to_user_name,
    ti.status,
    ti.created_at,
    ti.responded_at
  FROM team_invites ti
  INNER JOIN teams t ON t.id = ti.team_id
  INNER JOIN members fm ON fm.user_id = ti.from_user_id
  INNER JOIN members tm ON tm.user_id = ti.to_user_id
  LEFT JOIN "user" fu ON fu.id = ti.from_user_id
`;

function mapInviteRow(row: InviteRow): TeamInvite {
  return {
    id: row.id,
    teamId: row.team_id,
    teamName: row.team_name,
    fromUserId: row.from_user_id,
    fromUserName: row.from_user_name,
    fromUserImageUrl: row.from_user_image_url,
    toUserId: row.to_user_id,
    toUserName: row.to_user_name,
    status: row.status,
    createdAt: row.created_at,
    respondedAt: row.responded_at,
  };
}

export async function createTeamInvite(
  teamId: string,
  captainUserId: string,
  targetUserId: string,
): Promise<TeamInvite> {
  const pool = getPool();

  if (captainUserId === targetUserId) {
    throw new Error("cannot_invite_self");
  }

  const teamResult = await pool.query<{ captain_user_id: string; max_members: number }>(
    `SELECT captain_user_id, max_members FROM teams WHERE id = $1`,
    [teamId],
  );
  const team = teamResult.rows[0];
  if (!team) throw new Error("team_not_found");
  if (team.captain_user_id !== captainUserId) throw new Error("not_captain");

  const memberCheck = await pool.query(
    `SELECT user_id FROM members WHERE user_id = $1`,
    [targetUserId],
  );
  if (!memberCheck.rows[0]) throw new Error("member_not_found");

  const existingTeam = await pool.query(
    `SELECT team_id FROM team_members WHERE user_id = $1 LIMIT 1`,
    [targetUserId],
  );
  if (existingTeam.rows[0]) throw new Error("already_in_team");

  const countResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM team_members WHERE team_id = $1`,
    [teamId],
  );
  const count = Number(countResult.rows[0]?.count ?? 0);
  if (count >= team.max_members) throw new Error("team_full");

  const pendingInvite = await pool.query(
    `SELECT id FROM team_invites
     WHERE team_id = $1 AND to_user_id = $2 AND status = 'pending'
     LIMIT 1`,
    [teamId, targetUserId],
  );
  if (pendingInvite.rows[0]) throw new Error("invite_already_sent");

  const insertResult = await pool.query<{ id: string }>(
    `INSERT INTO team_invites (team_id, from_user_id, to_user_id)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [teamId, captainUserId, targetUserId],
  );

  const inviteId = insertResult.rows[0]?.id;
  if (!inviteId) throw new Error("Failed to create invite");

  const result = await pool.query<InviteRow>(
    `${inviteSelect}
     WHERE ti.id = $1`,
    [inviteId],
  );

  const row = result.rows[0];
  if (!row) throw new Error("Failed to create invite");
  return mapInviteRow(row);
}

export async function getPendingInvitesForUser(userId: string): Promise<TeamInvite[]> {
  const pool = getPool();
  const result = await pool.query<InviteRow>(
    `${inviteSelect}
     WHERE ti.to_user_id = $1 AND ti.status = 'pending'
     ORDER BY ti.created_at DESC`,
    [userId],
  );
  return result.rows.map(mapInviteRow);
}

export async function getPendingInviteCount(userId: string): Promise<number> {
  const pool = getPool();
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM team_invites
     WHERE to_user_id = $1 AND status = 'pending'`,
    [userId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function getPendingInviteUserIdsForTeam(teamId: string): Promise<string[]> {
  const pool = getPool();
  const result = await pool.query<{ to_user_id: string }>(
    `SELECT to_user_id
     FROM team_invites
     WHERE team_id = $1 AND status = 'pending'`,
    [teamId],
  );
  return result.rows.map((row) => row.to_user_id);
}

export async function respondToTeamInvite(
  inviteId: string,
  userId: string,
  accept: boolean,
) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const inviteResult = await client.query<{
      id: string;
      team_id: string;
      to_user_id: string;
      status: TeamInviteStatus;
    }>(
      `SELECT id, team_id, to_user_id, status
       FROM team_invites
       WHERE id = $1
       FOR UPDATE`,
      [inviteId],
    );

    const invite = inviteResult.rows[0];
    if (!invite) throw new Error("invite_not_found");
    if (invite.to_user_id !== userId) throw new Error("not_invitee");
    if (invite.status !== "pending") throw new Error("invite_not_pending");

    const now = new Date();
    const newStatus: TeamInviteStatus = accept ? "accepted" : "declined";

    await client.query(
      `UPDATE team_invites
       SET status = $2, responded_at = $3
       WHERE id = $1`,
      [inviteId, newStatus, now],
    );

    if (!accept) {
      await client.query("COMMIT");
      return { accepted: false as const };
    }

    const existingTeam = await client.query(
      `SELECT team_id FROM team_members WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    if (existingTeam.rows[0]) throw new Error("already_in_team");

    const teamResult = await client.query<{ max_members: number }>(
      `SELECT max_members FROM teams WHERE id = $1`,
      [invite.team_id],
    );
    const team = teamResult.rows[0];
    if (!team) throw new Error("team_not_found");

    const countResult = await client.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM team_members WHERE team_id = $1`,
      [invite.team_id],
    );
    const count = Number(countResult.rows[0]?.count ?? 0);
    if (count >= team.max_members) throw new Error("team_full");

    await client.query(
      `INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)`,
      [invite.team_id, userId],
    );

    await client.query(
      `UPDATE team_invites
       SET status = 'declined', responded_at = $2
       WHERE to_user_id = $1 AND status = 'pending' AND id <> $3`,
      [userId, now, inviteId],
    );

    await client.query("COMMIT");

    const updatedTeam = await getTeamWithMembersAndProject(invite.team_id);
    return { accepted: true as const, team: updatedTeam };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
