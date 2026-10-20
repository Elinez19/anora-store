import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

/**
 * Checks whether an email is configured as a bootstrap admin in environment variables.
 * Comma-separated list of emails: ADMIN_EMAILS="admin@example.com,store@anoraa.com"
 */
export function isConfiguredAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  if (!adminEmailsEnv) return false;
  const emails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return emails.includes(email.trim().toLowerCase());
}

/**
 * Returns current authenticated user and their resolved admin status.
 * If user has role === 'admin' OR their email matches ADMIN_EMAILS, they are considered admin.
 * If their email is in ADMIN_EMAILS but DB role is still 'customer', it auto-syncs the DB role to 'admin'.
 */
export const getCurrentAdminUser = cache(async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  // Query fresh user row from DB to get the `role` column
  const [dbUser] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      image: userTable.image,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .where(eq(userTable.id, currentUser.id))
    .limit(1);

  if (!dbUser) return null;

  const isConfigured = isConfiguredAdminEmail(dbUser.email);

  if (isConfigured && dbUser.role !== "admin") {
    // Elevate role in background
    try {
      await db
        .update(userTable)
        .set({ role: "admin" })
        .where(eq(userTable.id, dbUser.id));
      dbUser.role = "admin";
    } catch (e) {
      console.error("Failed to auto-elevate admin role", e);
    }
  }

  const isAdmin = dbUser.role === "admin" || isConfigured;

  return {
    ...dbUser,
    isAdmin,
  };
});

/**
 * Gatekeeper for admin layouts and pages.
 * Redirects unauthenticated visitors to /sign-in?next=...
 * Throws or redirects unauthorized users away from admin dashboard.
 */
export async function requireAdmin(nextPath = "/admin") {
  const admin = await getCurrentAdminUser();

  if (!admin) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  if (!admin.isAdmin) {
    redirect("/?error=unauthorized_admin");
  }

  return admin;
}
