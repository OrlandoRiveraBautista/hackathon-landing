export type Team = {
  id: string;
  name: string;
  description: string | null;
  captainUserId: string;
  maxMembers: number;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamMember = {
  teamId: string;
  userId: string;
  name: string;
  email: string | null;
  github: string | null;
  imageUrl: string | null;
  joinedAt: Date;
};

export type TeamWithMembers = Team & {
  members: TeamMember[];
};

export type Project = {
  id: string;
  teamId: string;
  title: string | null;
  description: string | null;
  techStack: string[];
  githubUrl: string;
  demoUrl: string | null;
  status: "draft" | "submitted" | "locked";
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamWithMembersAndProject = TeamWithMembers & {
  project: Project | null;
};

export type CreateTeamInput = {
  name: string;
  description?: string | null;
  isOpen?: boolean;
};

export type UpdateTeamInput = {
  name?: string;
  description?: string | null;
  isOpen?: boolean;
};

export type UpsertProjectInput = {
  title?: string | null;
  description?: string | null;
  techStack?: string[];
  githubUrl: string;
  demoUrl?: string | null;
  submit?: boolean;
};
