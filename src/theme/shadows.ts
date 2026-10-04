import { Platform } from 'react-native';

/**
 * KYNTRA elevation.
 *
 * The Figma file does not define a shadow/elevation scale — the design is
 * flat, relying on the #F5F5F5 surface and #E5E5E5 hairline for separation.
 *
 * These are deliberately minimal and exist only to lift floating navigation
 * and bottom sheets off scrolling content. Do not add shadows to cards; use
 * colors.secondary instead, which is what the design does.
 */
export const shadows = {
  /** Floating navigation bar and bottom sheets. */
  float: Platform.select({
    android: { elevation: 8 },
    default: {
      shadowColor: '#111111',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
    },
  }),

  /** Raised header that sits above content on scroll. */
  header: Platform.select({
    android: { elevation: 4 },
    default: {
      shadowColor: '#111111',
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
  }),
} as const;
