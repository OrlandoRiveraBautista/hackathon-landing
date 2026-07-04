# Build Pa'l Norte — Platform Vision & Roadmap

> **Read this before building member/team/project features.**  
> This doc describes what we're building beyond the marketing landing page.

## Mission

A platform for **local developers and engineers in Matamoros / the region** to:

1. **Meet each other** — discover who else is building, what they're into, and how to reach them.
2. **Form teams** — find collaborators before and during the hackathon (solo hackers ↔ teams).
3. **Submit work** — during the event, teams share project info and GitHub repos with organizers for demo day and judging.

The hackathon landing page is the front door. The **member platform** (profile → directory → teams → submissions) is the product we're growing into.

---

## Current State (as of July 2026)

### Built
| Area | What exists |
|------|-------------|
| Marketing | Bilingual landing, sponsors page, legal, waitlist modal |
| Registration | Firestore `waitlist` collection — name, email, phone, age, sex, school, github, interests |
| Auth | Google OAuth via Better Auth (Postgres) — member access if email is on waitlist |
| Profile | Editable `/profile` — Postgres `members` + waitlist gate; seeded on first visit |
| Admin | Read-only dashboard — waitlist + sponsor tables |
| Email | Waitlist confirmation via Resend |

### Not built (copy-only today)
- Team formation / matching
- Member directory / search
- Waitlist bulk import to Postgres (pre-auth participants)
- Project or GitHub submission flows
- Event schedule, announcements, check-in

### Key technical split
- **Postgres (Neon):** auth, member profiles, teams, projects (all platform data from Phase 1 onward)
- **Firestore:** waitlist + sponsor intake only (legacy registration gate)
- **Decision (July 2026):** Platform features use Postgres; waitlist stays in Firestore until migrated intentionally.

---

## Storage decisions

| Data | Store | Notes |
|------|-------|-------|
| Auth sessions / users | Postgres (Better Auth) | Existing |
| Waitlist signups | Firestore | Registration gate; seeds member on first login |
| Member profiles | Postgres `members` | Phase 1 ✅ |
| Teams, invites | Postgres | Phase 2 |
| Projects, submissions | Postgres | Phase 3 |
| Sponsors | Firestore | Unchanged for now |

Run migrations: `pnpm auth:migrate && pnpm db:migrate`

---

## Target User Journeys

### Pre-hackathon
1. Join waitlist on landing page (may already have github + interests).
2. Sign in with Google → land on **home** (`/{locale}/home`).
3. Complete / edit profile — bio, skills, GitHub, interests, **"looking for team"** flag.
4. Browse **member directory** — filter by interests, skills, school, team status.
5. Create a **team** or **request to join** one; accept/decline invites.

### During hackathon
1. Team opens **project workspace** — title, description, tech stack, demo link.
2. Submit **GitHub repo URL** (required for judging).
3. Optionally update submission until deadline.
4. Organizers review submissions in **admin**.

### Post-hackathon (later)
- Project gallery, winner showcase — out of scope for v1.

---

## Phased Roadmap

### Phase 1 — Profiles & identity
**Goal:** Turn waitlist rows into living member profiles tied to auth.

| Feature | Notes |
|---------|-------|
| `members` Postgres table | Keyed by `userId` (Better Auth), seeded from waitlist on first login ✅ |
| Editable profile | github, interests, bio, skills, school, "open to teams" toggle ✅ |
| Profile page v2 | View + edit own profile ✅ |
| Waitlist → member migration | On login: if waitlist doc exists, create/link member row ✅ |

**Exit criteria:** Signed-in user can update their info; data persists beyond waitlist snapshot.

### Phase 2 — Discovery & teams
**Goal:** Help people find each other and form teams before event day.

| Feature | Notes |
|---------|-------|
| Member directory | Paginated list, search/filter by interests, github present, team status |
| Team entity | name, description, max size, open/closed, captain |
| Team membership | invite by email or accept join requests |
| Solo / team badges | Visible on profile and directory cards |

**Exit criteria:** User can create a team, invite a member, and see team on their profile.

### Phase 3 — Project submissions
**Goal:** Collect hackathon deliverables during the event.

| Feature | Notes |
|---------|-------|
| Project per team | title, description, tech stack, demo URL, screenshot (optional) |
| GitHub submission | repo URL, validation (public repo, optional branch/tag) |
| Submission window | open/close times enforced server-side |
| Admin review | list submissions, filter by team, export for judges |

**Exit criteria:** Team captain submits GitHub repo before deadline; admin sees all submissions.

### Phase 4 — Event ops (optional / parallel)
- Schedule page (sessions, meals, demo slots)
- Announcements (banner or feed)
- Check-in (day-of attendance)

---

## Data Model (proposed)

### `members` (Postgres — implemented)
```sql
-- see db/migrations/001_members.sql
user_id, email, name, phone, age, sex,
school, github, interests, bio, skills[],
open_to_teams, waitlist_id, created_at, updated_at
```

### `teams`
```
teamId          string
name            string
description     string?
captainUserId   string
maxMembers      number    default 4
isOpen          boolean   accepting join requests
memberIds       string[]
createdAt       timestamp
updatedAt       timestamp
```

### `team_invites` (or subcollection under teams)
```
inviteId        string
teamId          string
fromUserId      string
toEmail         string
status          pending | accepted | declined | expired
createdAt       timestamp
```

### `projects`
```
projectId       string
teamId          string
title           string
description     string
techStack       string[]
githubUrl       string
demoUrl         string?
submittedAt     timestamp?
updatedAt       timestamp
status          draft | submitted | locked
```

**Storage:** Postgres for all platform entities. Firestore for waitlist/sponsors only.

---

## Auth & access rules (sketch)

| Route / action | Who |
|----------------|-----|
| `/profile` (own) | Signed-in waitlist member |
| `/profile/[userId]` (public) | Signed-in members only (not public internet) |
| `/directory` | Signed-in members |
| Create/edit team | Signed-in member; captain for edits |
| Submit project | Team captain (or all members — TBD) |
| Admin submissions | `admin` / `owner` role |

Middleware already guards `/{locale}/profile`. Extend pattern for `/directory`, `/teams`, etc.

---

## UI / navigation (future)

Today: no nav link to login from public site.

Planned nav (signed out): Login  
Planned nav (signed in): Profile · Directory · My Team · (Submit Project during event)

Profile stays **full-screen** (not the split AuthShell card layout). Directory and team pages can share a common **member app shell** (header, nav, content).

---

## Open decisions

1. ~~**Firestore vs Postgres** for members/teams/projects?~~ **Postgres** (decided July 2026)
2. **Profile visibility** — members-only directory vs fully public profiles?
3. **Team size cap** — fixed at 4? configurable per event?
4. **Waitlist vs registration** — does waitlist remain the gate, or separate "confirmed participant" status?
5. **GitHub validation** — require public repo? org account? README?
6. **Submission edits** — allowed until deadline or locked on first submit?
7. **i18n** — all new platform strings in `lib/dictionaries/` (en/es).

---

## Out of scope (for now)

- Chat / messaging between members (use Discord/WhatsApp links initially?)
- In-app notifications (email nudges first)
- Automated team matching algorithm (manual browse + invite first)
- Payments, tickets, or venue check-in hardware
- Post-event project hosting beyond links

---

## Implementation principles

1. **Ship phases vertically** — each phase should be usable on its own.
2. **Reuse auth + waitlist gate** — don't rewrite what's working.
3. **Minimal diff** — match existing patterns (Next.js app router, dictionaries, AuthShell aesthetic for auth flows, full-screen for member app).
4. **Server-first** — mutations via API routes / server actions; protect with session + role checks.
5. **Document schema changes** — update this file when decisions are made.

---

## Related files

```
app/[locale]/profile/page.tsx       # Current profile (read-only waitlist)
components/MemberProfileScreen.tsx
lib/waitlist.ts                     # Waitlist write shape (seed for members)
lib/auth.ts                         # Better Auth config
lib/auth/middleware.ts              # Protected route patterns
firestore.rules                     # Must extend for new collections
lib/dictionaries/en.ts | es.ts        # All user-facing copy
```
