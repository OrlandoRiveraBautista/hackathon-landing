import { getPool } from "@/lib/db";
import type {
  CreateTeamInput,
  Project,
  Team,
  TeamMember,
  TeamWithMembers,
  TeamWithMembersAndProject,
  UpdateTeamInput,
  UpsertProjectInput,
} from "@/lib/teams/types";

type TeamRow = {
  id: string;
  name: string;
  description: string | null;
  captain_user_id: string;
  max_members: number;
  is_open: boolean;
  created_at: Date;
  updated_at: Date;
};

type TeamMemberRow = {
  team_id: string;
  user_id: string;
  name: string;
  email: string | null;
  github: string | null;
  image_url: string | null;
  joined_at: Date;
};

type ProjectRow = {
  id: string;
  team_id: string;
  title: string | null;
  description: string | null;
  tech_stack: string[] | null;
  github_url: string;
  demo_url: string | null;
  status: Project["status"];
  submitted_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

function mapTeamRow(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    captainUserId: row.captain_user_id,
    maxMembers: row.max_members,
    isOpen: row.is_open,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTeamMemberRow(row: TeamMemberRow): TeamMember {
  return {
    teamId: row.team_id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    github: row.github,
    imageUrl: row.image_url,
    joinedAt: row.joined_at,
  };
}

function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    teamId: row.team_id,
    title: row.title,
    description: row.description,
    techStack: row.tech_stack ?? [],
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    status: row.status,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getTeamByUserId(
  userId: string,
): Promise<TeamWithMembersAndProject | null> {
  const pool = getPool();

  const teamResult = await pool.query<TeamRow>(
    `SELECT t.*
     FROM teams t
     INNER JOIN team_members tm ON tm.team_id = t.id
     WHERE tm.user_id = $1
     LIMIT 1`,
    [userId],
  );

  const teamRow = teamResult.rows[0];
  if (!teamRow) return null;

  return getTeamWithMembersAndProject(teamRow.id);
}

export async function getTeamWithMembersAndProject(
  teamId: string,
): Promise<TeamWithMembersAndProject | null> {
  const pool = getPool();

  const teamResult = await pool.query<TeamRow>(
    `SELECT * FROM teams WHERE id = $1`,
    [teamId],
  );

  const teamRow = teamResult.rows[0];
  if (!teamRow) return null;

  const membersResult = await pool.query<TeamMemberRow>(
    `SELECT
       tm.team_id,
       tm.user_id,
       m.name,
       m.email,
       m.github,
       u.image AS image_url,
       tm.joined_at
     FROM team_members tm
     INNER JOIN members m ON m.user_id = tm.user_id
     LEFT JOIN "user" u ON u.id = tm.user_id
     WHERE tm.team_id = $1
     ORDER BY tm.joined_at ASC`,
    [teamId],
  );

  const projectResult = await pool.query<ProjectRow>(
    `SELECT * FROM projects WHERE team_id = $1 LIMIT 1`,
    [teamId],
  );

  const team = mapTeamRow(teamRow);
  const members = membersResult.rows.map(mapTeamMemberRow);
  const project = projectResult.rows[0] ? mapProjectRow(projectResult.rows[0]) : null;

  return { ...team, members, project };
}

export async function createTeam(
  captainUserId: string,
  input: CreateTeamInput,
): Promise<TeamWithMembersAndProject> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = await getTeamByUserId(captainUserId);
    if (existing) {
      throw new Error("already_in_team");
    }

    const teamResult = await client.query<TeamRow>(
      `INSERT INTO teams (name, description, captain_user_id, is_open)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        input.name.trim(),
        input.description?.trim() || null,
        captainUserId,
        input.isOpen ?? true,
      ],
    );

    const teamRow = teamResult.rows[0];
    if (!teamRow) throw new Error("Failed to create team");

    await client.query(
      `INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)`,
      [teamRow.id, captainUserId],
    );

    await client.query("COMMIT");

    const full = await getTeamWithMembersAndProject(teamRow.id);
    if (!full) throw new Error("Failed to fetch team after creation");
    return full;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateTeam(
  teamId: string,
  captainUserId: string,
  input: UpdateTeamInput,
): Promise<TeamWithMembersAndProject | null> {
  const pool = getPool();

  const fields: string[] = [];
  const values: unknown[] = [teamId, captainUserId];

  function addField(column: string, value: unknown) {
    values.push(value);
    fields.push(`${column} = $${values.length}`);
  }

  if (input.name !== undefined) addField("name", input.name.trim());
  if (input.description !== undefined) addField("description", input.description?.trim() || null);
  if (input.isOpen !== undefined) addField("is_open", input.isOpen);

  if (fields.length === 0) return getTeamWithMembersAndProject(teamId);

  const result = await pool.query(
    `UPDATE teams SET ${fields.join(", ")}
     WHERE id = $1 AND captain_user_id = $2`,
    values,
  );

  if (result.rowCount === 0) return null;

  return getTeamWithMembersAndProject(teamId);
}

export async function leaveTeam(
  teamId: string,
  userId: string,
): Promise<{ dissolved: boolean }> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const teamResult = await client.query<{ captain_user_id: string; count: string }>(
      `SELECT t.captain_user_id, COUNT(tm.user_id)::text AS count
       FROM teams t
       INNER JOIN team_members tm ON tm.team_id = t.id
       WHERE t.id = $1
       GROUP BY t.captain_user_id`,
      [teamId],
    );

    const row = teamResult.rows[0];
    if (!row) throw new Error("team_not_found");

    const isCaptain = row.captain_user_id === userId;
    const memberCount = Number(row.count);

    if (isCaptain && memberCount > 1) {
      throw new Error("captain_must_transfer");
    }

    await client.query(
      `DELETE FROM team_members WHERE team_id = $1 AND user_id = $2`,
      [teamId, userId],
    );

    let dissolved = false;
    if (isCaptain && memberCount <= 1) {
      await client.query(`DELETE FROM teams WHERE id = $1`, [teamId]);
      dissolved = true;
    }

    await client.query("COMMIT");
    return { dissolved };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function upsertProject(
  teamId: string,
  captainUserId: string,
  input: UpsertProjectInput,
): Promise<Project> {
  const pool = getPool();

  const teamCheck = await pool.query(
    `SELECT id FROM teams WHERE id = $1 AND captain_user_id = $2`,
    [teamId, captainUserId],
  );

  if (!teamCheck.rows[0]) {
    throw new Error("not_captain");
  }

  const existingResult = await pool.query<ProjectRow>(
    `SELECT * FROM projects WHERE team_id = $1`,
    [teamId],
  );

  const existing = existingResult.rows[0];
  if (existing?.status === "locked") {
    throw new Error("submission_locked");
  }

  const now = new Date();
  const status = input.submit ? "submitted" : "draft";
  const submittedAt = input.submit && existing?.status !== "submitted" ? now : (existing?.submitted_at ?? null);

  if (existing) {
    const result = await pool.query<ProjectRow>(
      `UPDATE projects
       SET title = $2, description = $3, tech_stack = $4, github_url = $5,
           demo_url = $6, status = $7, submitted_at = $8
       WHERE team_id = $1
       RETURNING *`,
      [
        teamId,
        input.title?.trim() || existing.title,
        input.description?.trim() || existing.description,
        input.techStack ?? existing.tech_stack ?? [],
        input.githubUrl.trim(),
        input.demoUrl?.trim() || null,
        status,
        submittedAt,
      ],
    );
    return mapProjectRow(result.rows[0]);
  }

  const result = await pool.query<ProjectRow>(
    `INSERT INTO projects (team_id, title, description, tech_stack, github_url, demo_url, status, submitted_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      teamId,
      input.title?.trim() || null,
      input.description?.trim() || null,
      input.techStack ?? [],
      input.githubUrl.trim(),
      input.demoUrl?.trim() || null,
      status,
      submittedAt,
    ],
  );

  return mapProjectRow(result.rows[0]);
}

const TEAM_NAME_ADJECTIVES = [
  "Atomic", "Blazing", "Cosmic", "Digital", "Electric", "Fierce", "Galactic",
  "Hyper", "Infinite", "Jade", "Kinetic", "Lunar", "Magnetic", "Nebula",
  "Orbital", "Pixel", "Quantum", "Rapid", "Solar", "Turbo", "Ultra",
  "Vivid", "Wild", "Xenon", "Zero", "Alpha",
];

const TEAM_NAME_NOUNS = [
  "Builders", "Coders", "Crew", "Devs", "Engineers", "Force", "Hackers",
  "Innovators", "Makers", "Ninjas", "Operators", "Pirates", "Rebels",
  "Squad", "Team", "Tribe", "Unit", "Wolves", "Xperts", "Yaks",
];

export async function addMemberToTeam(
  teamId: string,
  captainUserId: string,
  targetUserId: string,
): Promise<TeamWithMembersAndProject> {
  const pool = getPool();

  const teamResult = await pool.query<{ captain_user_id: string; max_members: number }>(
    `SELECT captain_user_id, max_members FROM teams WHERE id = $1`,
    [teamId],
  );
  const team = teamResult.rows[0];
  if (!team) throw new Error("team_not_found");
  if (team.captain_user_id !== captainUserId) throw new Error("not_captain");

  // Check target is a member (on platform)
  const memberCheck = await pool.query(
    `SELECT user_id FROM members WHERE user_id = $1`,
    [targetUserId],
  );
  if (!memberCheck.rows[0]) throw new Error("member_not_found");

  // Check target is not already in any team
  const existingTeam = await pool.query(
    `SELECT team_id FROM team_members WHERE user_id = $1 LIMIT 1`,
    [targetUserId],
  );
  if (existingTeam.rows[0]) throw new Error("already_in_team");

  // Check current size
  const countResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM team_members WHERE team_id = $1`,
    [teamId],
  );
  const count = Number(countResult.rows[0]?.count ?? 0);
  if (count >= team.max_members) throw new Error("team_full");

  await pool.query(
    `INSERT INTO team_members (team_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [teamId, targetUserId],
  );

  const updated = await getTeamWithMembersAndProject(teamId);
  if (!updated) throw new Error("team_not_found");
  return updated;
}

export function suggestTeamName(): string {
  const adj = TEAM_NAME_ADJECTIVES[Math.floor(Math.random() * TEAM_NAME_ADJECTIVES.length)];
  const noun = TEAM_NAME_NOUNS[Math.floor(Math.random() * TEAM_NAME_NOUNS.length)];
  return `${adj} ${noun}`;
}
