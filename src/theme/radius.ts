/**
 * KYNTRA corner radius tokens.
 *
 * From Figma "01 - Design System" → "Surface language" (#9:77):
 *   "20dp product cards · 16dp inputs / 40dp pill actions · 36dp floating navigation"
 * Plus 12dp (colour swatches, #9:16) and 4dp (system gesture handle, #9:1545).
 */

export const radius = {
  /** 4dp — Android gesture handle only. */
  handle: 4,
  /** 12dp — swatches, small chips. */
  sm: 12,
  /** 16dp — text inputs, small cards. */
  input: 16,
  /** 20dp — product cards, grouped panels. */
  card: 20,
  /** 36dp — floating navigation bar. */
  nav: 36,
  /** 40dp — pill actions and round icon buttons (fully circular at 48dp). */
  pill: 40,
} as const;

export type RadiusToken = keyof typeof radius;
