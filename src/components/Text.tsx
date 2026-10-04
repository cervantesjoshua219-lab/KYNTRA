import { Text as RNText } from 'react-native';
import type { StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

import { colors, typography } from '@/theme';
import type { TypographyVariant } from '@/theme';

export type TextTone = 'primary' | 'secondary' | 'onDark' | 'error' | 'success' | 'inherit';
export type TextAlign = 'left' | 'center' | 'right';

type Props = RNTextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
  align?: TextAlign;
  /** Optional one-line clamp. Product names and review titles use it. */
  lines?: number;
  style?: StyleProp<TextStyle>;
};

const TONE_COLOR: Record<Exclude<TextTone, 'inherit'>, string> = {
  primary: colors.primary,
  secondary: colors.secondaryText,
  onDark: colors.background,
  error: colors.error,
  success: colors.success,
};

/**
 * Every piece of text in KYNTRA goes through this component so the Figma type
 * scale is applied by variant name rather than re-typed per screen.
 *
 * Defaults to `body` in primary ink, which is the most common case in the
 * design.
 */
export function Text({ variant = 'body', tone = 'primary', align = 'left', lines, style, ...rest }: Props) {
  return (
    <RNText
      {...rest}
      numberOfLines={lines}
      style={[
        typography[variant],
        tone !== 'inherit' && { color: TONE_COLOR[tone] },
        align !== 'left' && { textAlign: align },
        style,
      ]}
    />
  );
}