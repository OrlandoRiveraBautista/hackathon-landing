import type { Pool, PoolClient } from "pg";
import { getPool } from "@/lib/db";
import type { MemberProfile, MemberProfileUpdate } from "@/lib/members/types";
import { normalizeGithub } from "@/lib/waitlist";
import type { WaitlistSignup } from "@/lib/waitlist-admin";

export type { MemberProfile, MemberProfileUpdate } from "@/lib/members/types";

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
  waitlist_id: string | null;
  created_at: Date;
  updated_at: Date;
};

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
    waitlistId: row.waitlist_id,
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
    `SELECT *
     FROM members
     WHERE user_id = $1`,
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

  const row = result.rows[0];
  return row ? mapMemberRow(row) : null;
}

export async function updateMemberProfile(
  userId: string,
  update: MemberProfileUpdate,
): Promise<MemberProfile | null> {
  const pool = getPool();
  return updateMemberQuery(pool, userId, update);
}
