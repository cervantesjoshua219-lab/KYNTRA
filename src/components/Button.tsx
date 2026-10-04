import { ActivityIndicator, Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'regular' | 'large';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  /** Stretches to the container width. Most screen CTAs do. */
  block?: boolean;
  /** Optional leading glyph, e.g. an arrow or bag icon. */
  leading?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Pill buttons.
 *
 * Figma "Surface language" specifies 40dp radius on actions, which at the 48dp
 * minimum touch target makes the control fully rounded. Height is never below
 * `spacing.target` (48dp) so the touch area meets the accessibility rule.
 */

const VARIANT: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, fg: colors.background },
  secondary: { bg: colors.secondary, fg: colors.primary },
  outline: { bg: 'transparent', fg: colors.primary, border: colors.border },
  ghost: { bg: 'transparent', fg: colors.primary },
};

const HEIGHT: Record<ButtonSize, number> = {
  regular: spacing.target,
  large: 56,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'regular',
  disabled = false,
  loading = false,
  block = false,
  leading,
  style,
  accessibilityLabel,
  testID,
}: Props) {
  const tone = VARIANT[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}
      style={({ pressed }) => [
        {
          height: HEIGHT[size],
          minHeight: spacing.target,
          borderRadius: radius.pill,
          backgroundColor: tone.bg,
          borderWidth: tone.border ? 1 : 0,
          borderColor: tone.border,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
          paddingHorizontal: spacing.xl,
          alignSelf: block ? 'stretch' : 'flex-start',
          opacity: inactive ? 0.4 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tone.fg} />
      ) : (
        <>
          {leading}
          <Text variant="label" style={{ color: tone.fg }} lines={1}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}