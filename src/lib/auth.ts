import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_auth";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return token === "1";
} 