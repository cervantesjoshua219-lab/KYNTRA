/**
 * KYNTRA colour tokens.
 *
 * Extracted from Figma file lci4QpXkmuC1Bs8M98r9OV, page "01 - Design System"
 * (#0:1), node "Color palette" (#9:14).
 *
 * The palette is monochrome-first: near-black ink on white, with a single
 * neutral surface and a muted grey for secondary copy. Green and red exist
 * only for status.
 *
 * Do not add colours here that are not in the Figma palette. If a screen needs
 * a colour that is missing, it is missing from the design too.
 */

export const colors = {
  /** Primary ink. Titles, body copy, icons, primary button fill. */
  primary: '#111111',

  /** Screen background. */
  background: '#FFFFFF',

  /** Raised / grouped surface. Cards, inputs, chips. */
  secondary: '#F5F5F5',

  /** De-emphasised copy. Captions, metadata, hints. */
  secondaryText: '#6B6B6B',

  /** Hairlines and dividers. */
  border: '#E5E5E5',

  /** Confirmation, in-stock, completed order. */
  success: '#26734D',

  /** Validation failure, declined, destructive. */
  error: '#B73535',
} as const;

/** Warning is not defined in the Figma palette — see comment above. */
export type ColorToken = keyof typeof colors;
