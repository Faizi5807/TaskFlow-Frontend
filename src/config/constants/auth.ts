export const UserRole = {
  StandardUser: 1,
  Moderator: 2,
  Administrator: 3,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ROLE_LABELS: Record<number, string> = {
  [UserRole.StandardUser]: "User",
  [UserRole.Moderator]: "Moderator",
  [UserRole.Administrator]: "Admin",
};

export const AUTH_TOKEN_KEY = "jira_token";
export const AUTH_USER_KEY = "jira_user";
