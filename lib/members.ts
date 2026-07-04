import type { Pool, PoolClient } from "pg";
import { getPool } from "@/lib/db";
import type { MemberProfile, MemberProfileUpdate } from "@/lib/members/types";
import { normalizeGithub } from "@/lib/waitlist";
import type { WaitlistSignup } from "@/lib/waitlist-admin";

export type {
  MemberProfile,
  MemberProfileUpdate,
  PublicMemberProfile,
} from "@/lib/members/types";

type MemberRow = {
  user_id: string;
  email: string;
  name: string;
  phone: string | null;
  age: number | null;
  sex: MemberProfile["sex"];
  school: string | null;
  github: string | null;
  interests: string | null;
  bio: string | null;
  skills: string[] | null;
  open_to_teams: boolean;
  show_email: boolean;
  show_phone: boolean;
  waitlist_id: string | null;
  created_at: Date;
  updated_at: Date;
  image_url?: string | null;
};

const memberSelect = `
  SELECT
    m.*,
    u.image AS image_url
  FROM members m
  LEFT JOIN "user" u ON u.id = m.user_id
`;

function emptyToNull(value: string | undefined | null): string | null {
  if (!value || value === "—") {
    return null;
  }

  return value.trim() || null;
}

function mapMemberRow(row: MemberRow): MemberProfile {
  return {
    userId: row.user_id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    age: row.age,
    sex: row.sex,
    school: row.school,
    github: row.github,
    interests: row.interests,
    bio: row.bio,
    skills: row.skills ?? [],
    openToTeams: row.open_to_teams,
    showEmail: row.show_email,
    showPhone: row.show_phone,
    waitlistId: row.waitlist_id,
    imageUrl: row.image_url ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function seedFromWaitlist(signup: WaitlistSignup) {
  return {
    name: signup.name,
    email: signup.email.trim().toLowerCase(),
    phone: emptyToNull(signup.phone),
    age: signup.age,
    sex: signup.sex,
    school: emptyToNull(signup.school),
    github: emptyToNull(signup.github),
    interests: emptyToNull(signup.interests),
    waitlistId: signup.id,
  };
}

export async function getMemberByUserId(
  userId: string,
): Promise<MemberProfile | null> {
  const pool = getPool();
  const result = await pool.query<MemberRow>(
    `${memberSelect}
     WHERE m.user_id = $1`,
    [userId],
  );

  const row = result.rows[0];
  return row ? mapMemberRow(row) : null;
}

export async function getOrCreateMember(
  userId: string,
  signup: WaitlistSignup,
): Promise<MemberProfile> {
  const existing = await getMemberByUserId(userId);
  if (existing) {
    return existing;
  }

  const seed = seedFromWaitlist(signup);
  const pool = getPool();

  const result = await pool.query<MemberRow>(
    `INSERT INTO members (
       user_id,
       email,
       name,
       phone,
       age,
       sex,
       school,
       github,
       interests,
       waitlist_id
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (user_id) DO NOTHING
     RETURNING *`,
    [
      userId,
      seed.email,
      seed.name,
      seed.phone,
      seed.age,
      seed.sex,
      seed.school,
      seed.github,
      seed.interests,
      seed.waitlistId,
    ],
  );

  if (result.rows[0]) {
    const created = await getMemberByUserId(userId);
    if (created) {
      return created;
    }
    return mapMemberRow(result.rows[0]);
  }

  const created = await getMemberByUserId(userId);
  if (!created) {
    throw new Error("Failed to create member profile.");
  }

  return created;
}

function parseSkillsInput(raw: unknown): string[] | undefined {
  if (raw === undefined) {
    return undefined;
  }

  if (!Array.isArray(raw)) {
    throw new Error("invalid_skills");
  }

  const skills = raw
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 20);

  return skills;
}

function parseOptionalText(raw: unknown, maxLength: number): string | null | undefined {
  if (raw === undefined) {
    return undefined;
  }

  if (raw === null) {
    return null;
  }

  const value = String(raw).trim();
  if (value.length > maxLength) {
    throw new Error("field_too_long");
  }

  return value || null;
}

export function parseMemberProfileUpdate(
  body: Record<string, unknown>,
): MemberProfileUpdate {
  const update: MemberProfileUpdate = {};

  const school = parseOptionalText(body.school, 200);
  if (school !== undefined) {
    update.school = school;
  }

  if (body.github !== undefined) {
    if (body.github === null || String(body.github).trim() === "") {
      update.github = null;
    } else {
      const normalized = normalizeGithub(String(body.github));
      if (!normalized) {
        throw new Error("invalid_github");
      }
      update.github = normalized;
    }
  }

  const interests = parseOptionalText(body.interests, 500);
  if (interests !== undefined) {
    update.interests = interests;
  }

  const bio = parseOptionalText(body.bio, 1000);
  if (bio !== undefined) {
    update.bio = bio;
  }

  const skills = parseSkillsInput(body.skills);
  if (skills !== undefined) {
    update.skills = skills;
  }

  if (body.openToTeams !== undefined) {
    if (typeof body.openToTeams !== "boolean") {
      throw new Error("invalid_open_to_teams");
    }
    update.openToTeams = body.openToTeams;
  }

  if (body.showEmail !== undefined) {
    if (typeof body.showEmail !== "boolean") {
      throw new Error("invalid_show_email");
    }
    update.showEmail = body.showEmail;
  }

  if (body.showPhone !== undefined) {
    if (typeof body.showPhone !== "boolean") {
      throw new Error("invalid_show_phone");
    }
    update.showPhone = body.showPhone;
  }

  return update;
}

async function updateMemberQuery(
  db: Pool | PoolClient,
  userId: string,
  update: MemberProfileUpdate,
): Promise<MemberProfile | null> {
  const fields: string[] = [];
  const values: unknown[] = [userId];

  function addField(column: string, value: unknown) {
    values.push(value);
    fields.push(`${column} = $${values.length}`);
  }

  if (update.school !== undefined) addField("school", update.school);
  if (update.github !== undefined) addField("github", update.github);
  if (update.interests !== undefined) addField("interests", update.interests);
  if (update.bio !== undefined) addField("bio", update.bio);
  if (update.skills !== undefined) addField("skills", update.skills);
  if (update.openToTeams !== undefined) {
    addField("open_to_teams", update.openToTeams);
  }
  if (update.showEmail !== undefined) {
    addField("show_email", update.showEmail);
  }
  if (update.showPhone !== undefined) {
    addField("show_phone", update.showPhone);
  }

  if (fields.length === 0) {
    return getMemberByUserId(userId);
  }

  const result = await db.query<MemberRow>(
    `UPDATE members
     SET ${fields.join(", ")}
     WHERE user_id = $1
     RETURNING *`,
    values,
  );

  if (!result.rows[0]) {
    return null;
  }

  return getMemberByUserId(userId);
}

export async function updateMemberProfile(
  userId: string,
  update: MemberProfileUpdate,
): Promise<MemberProfile | null> {
  const pool = getPool();
  return updateMemberQuery(pool, userId, update);
}

export type MemberSearchOptions = {
  query?: string;
  page?: number;
  limit?: number;
  openToTeams?: boolean;
};

export type MemberSearchResult = {
  members: MemberProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const DEFAULT_SEARCH_LIMIT = 24;
const MAX_SEARCH_LIMIT = 50;

function sanitizePage(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.floor(value);
}

function sanitizeLimit(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value) || value < 1) {
    return DEFAULT_SEARCH_LIMIT;
  }
  return Math.min(Math.floor(value), MAX_SEARCH_LIMIT);
}

function normalizeSearchQuery(query: string | undefined) {
  return query?.trim().slice(0, 100) ?? "";
}

function escapeIlikePattern(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

function buildMemberSearchWhere(options: {
  query: string;
  openToTeams?: boolean;
}) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (options.openToTeams) {
    params.push(true);
    conditions.push(`m.open_to_teams = $${params.length}`);
  }

  if (options.query) {
    params.push(`%${escapeIlikePattern(options.query)}%`);
    const placeholder = `$${params.length}`;
    conditions.push(`(
      m.name ILIKE ${placeholder} ESCAPE '\\'
      OR m.school ILIKE ${placeholder} ESCAPE '\\'
      OR m.interests ILIKE ${placeholder} ESCAPE '\\'
      OR m.github ILIKE ${placeholder} ESCAPE '\\'
      OR m.bio ILIKE ${placeholder} ESCAPE '\\'
      OR EXISTS (
        SELECT 1
        FROM unnest(m.skills) AS skill
        WHERE skill ILIKE ${placeholder} ESCAPE '\\'
      )
    )`);
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

export async function searchMembers(
  options: MemberSearchOptions = {},
): Promise<MemberSearchResult> {
  const pool = getPool();
  const query = normalizeSearchQuery(options.query);
  const limit = sanitizeLimit(options.limit);
  const page = sanitizePage(options.page);
  const offset = (page - 1) * limit;
  const { whereClause, params } = buildMemberSearchWhere({
    query,
    openToTeams: options.openToTeams,
  });

  const countResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM members m
     ${whereClause}`,
    params,
  );

  const total = Number(countResult.rows[0]?.count ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  const listParams = [...params, limit, offset];
  const limitParam = `$${params.length + 1}`;
  const offsetParam = `$${params.length + 2}`;

  const listResult = await pool.query<MemberRow>(
    `${memberSelect}
     ${whereClause}
     ORDER BY m.name ASC
     LIMIT ${limitParam}
     OFFSET ${offsetParam}`,
    listParams,
  );

  return {
    members: listResult.rows.map(mapMemberRow),
    total,
    page,
    limit,
    totalPages,
  };
}
