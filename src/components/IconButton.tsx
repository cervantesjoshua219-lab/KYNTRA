import { Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type Props = {
  /** Glyph to render. */
  children: React.ReactNode;
  onPress?: () => void;
  /**
   * Surface behind the glyph. `solid` is white-filled (the Figma "Icon action"
   * template, #FFFFFF on a 48dp circle), `surface` is the #F5F5F5 token.
   */
  tone?: 'solid' | 'surface' | 'ghost';
  /** Draws the ring used over imagery, e.g. the floating cart button. */
  bordered?: boolean;
  disabled?: boolean;
  /** Required — icon-only controls must still announce themselves. */
  accessibilityLabel: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const TONE_BG: Record<NonNullable<Props['tone']>, string> = {
  solid: colors.background,
  surface: colors.secondary,
  ghost: 'transparent',
};

/**
 * Round icon button.
 *
 * Matches the Figma "Icon action" template (EL-8fda660c): a 48×48 circle with a
 * 40dp radius — i.e. fully round — with the glyph centred.
 */
export function IconButton({
  children,
  onPress,
  tone = 'solid',
  bordered = false,
  disabled = false,
  accessibilityLabel,
  size = spacing.target,
  style,
  testID,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
      // Keeps the touch target at 48dp even when a smaller glyph is requested.
      hitSlop={size < spacing.target ? (spacing.target - size) / 2 : 0}
      style={({ pressed }) => [
        {
          width: spacing.target,
          height: spacing.target,
          borderRadius: radius.pill,
          backgroundColor: TONE_BG[tone],
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.border,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}