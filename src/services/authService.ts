import { delay } from '@/utils';

/**
 * Mock authentication.
 *
 * There is no backend. Validation rules below exist so the form states Figma
 * actually designs — "Sign In — error" (9:560), "Forgot Password — email sent"
 * (9:533) — are reachable rather than dead code.
 *
 * Any well-formed email with a password of 8+ characters signs in. Use
 * `error@kyntra.com` to force the failure state on demand.
 */

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type Session = {
  token: string;
  email: string;
  /**
   * Display name, used by Home's greeting (Figma `9:729` reads "Good morning,
   * Alex."). Optional because sessions persisted before this field existed are
   * still valid — the gate only checks `expiresAt` — so callers must fall back.
   */
  firstName?: string;
  /** Unix ms. */
  expiresAt: number;
};

const FORCE_ERROR_EMAIL = 'error@kyntra.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 30 days — long enough that sessions don't expire mid-demo. */
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000;

/**
 * Derives a display name from the email local-part, since sign-in only ever
 * sees an address: `alex@kyntra.ph` -> `Alex`.
 */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const first = local.split(/[._-]/)[0] ?? '';
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function makeSession(email: string, firstName?: string): Session {
  return {
    token: `mock_${Math.random().toString(36).slice(2, 12)}`,
    email,
    firstName: firstName?.trim() || nameFromEmail(email),
    expiresAt: Date.now() + SESSION_TTL,
  };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async signIn({ email, password }: Credentials): Promise<Session> {
    await delay(null, 600);

    if (!EMAIL_RE.test(email.trim())) {
      throw new AuthError('Enter a valid email address.');
    }
    if (password.length < 8) {
      throw new AuthError('Password must be at least 8 characters.');
    }
    if (email.trim().toLowerCase() === FORCE_ERROR_EMAIL) {
      throw new AuthError('We could not sign you in. Check your details and try again.');
    }
    return makeSession(email.trim());
  },

  async signUp({ firstName, lastName, email, password }: SignUpPayload): Promise<Session> {
    await delay(null, 700);

    if (!firstName.trim() || !lastName.trim()) {
      throw new AuthError('Enter your first and last name.');
    }
    if (!EMAIL_RE.test(email.trim())) {
      throw new AuthError('Enter a valid email address.');
    }
    if (password.length < 8) {
      throw new AuthError('Password must be at least 8 characters.');
    }
    return makeSession(email.trim(), firstName);
  },

  /** Always succeeds unless the address is malformed — Figma shows only the sent state. */
  async requestPasswordReset(email: string): Promise<void> {
    await delay(null, 700);
    if (!EMAIL_RE.test(email.trim())) {
      throw new AuthError('Enter a valid email address.');
    }
  },

  async signOut(): Promise<void> {
    await delay(null, 250);
  },
};

export { FORCE_ERROR_EMAIL };