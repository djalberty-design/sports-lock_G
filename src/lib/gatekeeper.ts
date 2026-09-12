/**
 * Admin email allowlist. Sign-in itself stays on Better Auth (Google / X / email).
 * Magic link is not supported on this platform.
 *
 * ALLOWED_EMAILS is a comma list. Empty list = nobody auto-approved (pending screen).
 * Do not turn VITE_AUTH_ENABLED on until the owner adds their email.
 */

export interface AuthUser {
  email: string;
  name: string;
  isApproved: boolean;
}

export function allowedEmails(): string[] {
  const raw =
    (typeof process !== "undefined" && process.env && (process.env.ALLOWED_EMAILS || process.env.VITE_ALLOWED_EMAILS)) ||
    "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isUserApproved(email: string): boolean {
  const list = allowedEmails();
  if (!list.length) return false;
  return list.includes(email.trim().toLowerCase());
}
