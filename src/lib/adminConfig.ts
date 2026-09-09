/**
 * Centralized list of authorized admin email addresses.
 *
 * IMPORTANT: This list is used ONLY for:
 *  1. Setting role: "admin" in a newly-created Firestore user document.
 *  2. Routing the user to the correct post-login destination.
 *
 * Actual permission enforcement is done server-side in firestore.rules and
 * storage.rules — never trust this list alone for access control.
 */
export const ADMIN_EMAILS = [
  '325prashant0009@dbit.in',
  'marathiclubdbit26@gmail.com',
] as const;

export type AdminEmail = (typeof ADMIN_EMAILS)[number];

/**
 * Returns true if the given email is an authorized admin address.
 * Comparison is case-insensitive.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (ADMIN_EMAILS as readonly string[]).some(
    (admin) => admin.toLowerCase() === normalized
  );
}
