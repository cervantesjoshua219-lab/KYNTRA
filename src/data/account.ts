/**
 * The demo account.
 *
 * The name used to live in two places that had already drifted apart:
 * `UserProvider` defaulted to "Alex Morgan" while `authService.makeSession`
 * derived "Alex" from the sign-in email. Profile and the Home greeting could
 * therefore disagree about who is signed in. Both now read from here.
 *
 * This is the account the app presents out of the box. `signUp` still records
 * whatever name the user actually types, which then wins over these defaults.
 */
export const ACCOUNT = {
  firstName: 'Joshua',
  lastName: 'Cervantes',
  email: 'joshua.cervantes@example.com',
} as const;

/** "Joshua Cervantes" — used where the full name is shown as one string. */
export const ACCOUNT_FULL_NAME = `${ACCOUNT.firstName} ${ACCOUNT.lastName}`;

/** "JC" — the avatar fallback when no photograph is available. */
export const ACCOUNT_INITIALS = `${ACCOUNT.firstName.charAt(0)}${ACCOUNT.lastName.charAt(0)}`;