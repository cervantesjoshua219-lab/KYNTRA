/**
 * KYNTRA typography.
 *
 * Extracted from Figma "01 - Design System" → "02 / Typography" (#9:44):
 *   Display  40 · 800
 *   Headline 28 · 700 · 1.12
 *   Section  22 · 700 · 1.12
 *   Body     15 · 400 · 1.5
 *   Label    13 · 600
 *   Caption  11 · 400
 *
 * "Title" (20 · 700) is not in the scale above; it was observed on the
 * Product Details app bar (#9:1503, "Paceform 01") and is kept because the
 * app bar needs it.
 *
 * Where Figma gives no line height, none is set — the font's own metrics are
 * used rather than a guessed multiplier.
 */

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
} as const;

export const fontSize = {
  display: 40,
  headline: 28,
  section: 22,
  title: 20,
  body: 15,
  label: 13,
  caption: 11,
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.display,
  },
  headline: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.headline,
    lineHeight: 31, // 1.12em
  },
  section: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.section,
    lineHeight: 25, // 1.12em
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.title,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    lineHeight: 22, // 1.5em
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.label,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.caption,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
