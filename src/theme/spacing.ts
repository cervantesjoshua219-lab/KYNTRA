/**
 * KYNTRA spacing tokens — 8dp grid.
 *
 * From Figma "01 - Design System" → "03 / Rhythm" (#9:54):
 *   "24dp page margins. 16dp between cards. 32dp between sections.
 *    48dp minimum interactive target."
 *
 * 4 and 12 are included because they recur throughout the layout tree even
 * though the prose rule only names the larger steps.
 */

export const spacing = {
  /** 4dp — icon-to-label gaps, hairline offsets. */
  xs: 4,
  /** 8dp — gap inside a tight row, app bar item gap. */
  sm: 8,
  /** 12dp — default gap inside a card. */
  md: 12,
  /** 16dp — gap between cards, default card padding. */
  lg: 16,
  /** 24dp — page margin, gap between stacked sections inside a column. */
  xl: 24,
  /** 32dp — gap between page sections. */
  xxl: 32,
  /** 40dp — large vertical rhythm. */
  xxxl: 40,
  /** 48dp — minimum interactive target, also the largest gap in the scale. */
  target: 48,
} as const;

/** Page gutter. Applied as horizontal padding on every screen. */
export const PAGE_MARGIN = spacing.xl;

/** Gap between page sections. */
export const SECTION_GAP = spacing.xxl;

/** Gap between sibling cards. */
export const CARD_GAP = spacing.lg;

export type SpacingToken = keyof typeof spacing;
