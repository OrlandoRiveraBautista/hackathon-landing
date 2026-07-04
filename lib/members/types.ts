import type { SexOption } from "@/lib/waitlist";

export type MemberProfile = {
  userId: string;
  email: string;
  name: string;
  phone: string | null;
  age: number | null;
  sex: SexOption | null;
  school: string | null;
  github: string | null;
  interests: string | null;
  bio: string | null;
  skills: string[];
  openToTeams: boolean;
  waitlistId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicMemberProfile = Pick<
  MemberProfile,
  | "userId"
  | "name"
  | "school"
  | "github"
  | "interests"
  | "bio"
  | "skills"
  | "openToTeams"
  | "createdAt"
  | "updatedAt"
>;

export type MemberProfileUpdate = {
  school?: string | null;
  github?: string | null;
  interests?: string | null;
  bio?: string | null;
  skills?: string[];
  openToTeams?: boolean;
};
