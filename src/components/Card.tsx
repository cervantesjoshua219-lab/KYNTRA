import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';

type Props = {
  children: ReactNode;
  /**
   * `raised` is the #F5F5F5 surface at 20dp radius — the Figma card template
   * (EL-d4a9289a). `outline` uses the #E5E5E5 hairline instead, for cards that
   * sit on a coloured or imaged surface.
   */
  tone?: 'raised' | 'outline' | 'plain';
  /** 16dp on every side, per the Figma template. */
  padded?: boolean;
  /** Makes the whole card pressable, e.g. a product tile. */
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Grouped surface.
 *
 * The design is deliberately flat — separation comes from the #F5F5F5 surface
 * and #E5E5E5 hairline rather than shadows. Do not add elevation here.
 */
export function Card({ children, tone = 'raised', padded = true, onPress, accessibilityLabel, style }: Props) {
  const surface: ViewStyle = {
    borderRadius: radius.card,
    backgroundColor: tone === 'raised' ? colors.secondary : 'transparent',
    borderWidth: tone === 'outline' ? 1 : 0,
    borderColor: colors.border,
    padding: padded ? spacing.lg : 0,
    gap: spacing.md,
  };

  if (!onPress) {
    return <View style={[surface, style]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [surface, { opacity: pressed ? 0.75 : 1 }, style]}
    >
      {children}
    </Pressable>
  );
}

/**
 * Section heading row — the Figma "Section heading" template (EL-12e2d7a9):
 * a horizontally-centred row with a 12dp gap, usually title plus a text action.
 */
export function SectionHeader({
  title,
  action,
  style,
}: {
  title: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        },
        style,
      ]}
    >
      <SectionHeaderTitle title={title} />
      {action}
    </View>
  );
}

function SectionHeaderTitle({ title }: { title: string }) {
  return <Text variant="section">{title}</Text>;
}