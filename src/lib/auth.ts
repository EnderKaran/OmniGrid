import { auth } from "@clerk/nextjs/server";

export const enum UserRole {
  ADMIN = "org:admin",
  WORKER = "org:worker",
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { has } = await auth();

  if (has({ role: UserRole.ADMIN })) {
    return UserRole.ADMIN;
  }

  if (has({ role: UserRole.WORKER })) {
    return UserRole.WORKER;
  }

  return null;
}

export async function requireRole(role: UserRole): Promise<void> {
  const { has } = await auth();

  if (!has({ role })) {
    throw new Error(`Unauthorized: requires ${role} role`);
  }
}

export async function isAdmin(): Promise<boolean> {
  const { has } = await auth();
  return has({ role: UserRole.ADMIN });
}

export async function isWorker(): Promise<boolean> {
  const { has } = await auth();
  return has({ role: UserRole.WORKER });
}
