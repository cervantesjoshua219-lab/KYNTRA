import { Pressable, Switch, View } from 'react-native';

import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Text } from './Text';
import { colors, spacing } from '@/theme';

type RowProps = {
  label: string;
  /** Secondary line under the label — usually the current value. */
  detail?: string;
  icon?: IconName;
  onPress?: () => void;
  /** Trailing chevron. Implied when `onPress` is given. */
  chevron?: boolean;
  /** Destructive rows (sign out, delete) use the error token. */
  destructive?: boolean;
  /** Renders a switch instead of a chevron. */
  value?: boolean;
  onValueChange?: (next: boolean) => void;
};

/**
 * Settings / account list row.
 *
 * Used on Profile, Settings, Help Center and the checkout address and payment
 * pickers, which is why the value slot supports both text and a switch.
 */
export function ListRow({
  label,
  detail,
  icon,
  onPress,
  chevron,
  destructive = false,
  value,
  onValueChange,
}: RowProps) {
  const fg = destructive ? colors.error : colors.primary;

  const body = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        minHeight: 56,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
      }}
    >
      {icon ? <Icon name={icon} size={20} color={fg} /> : null}

      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" style={{ color: fg }}>
          {label}
        </Text>
        {detail ? (
          <Text variant="caption" tone="secondary" lines={1}>
            {detail}
          </Text>
        ) : null}
      </View>

      {onValueChange ? (
        <Switch
          value={!!value}
          onValueChange={onValueChange}
          accessibilityLabel={label}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      ) : null}

      {onPress && (chevron ?? true) ? <Icon name="chevronRight" size={18} color={colors.secondaryText} /> : null}
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={detail ? `${label}, ${detail}` : label}
      style={({ pressed }) => ({ backgroundColor: pressed ? colors.secondary : 'transparent' })}
    >
      {body}
    </Pressable>
  );
}

/** Grouped list with an optional heading. Uses the #F5F5F5 surface, not cards. */
export function ListGroup({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      {title ? (
        <Text variant="label" tone="secondary" style={{ paddingHorizontal: spacing.lg }}>
          {title}
        </Text>
      ) : null}
      <View style={{ backgroundColor: colors.secondary, borderRadius: 20, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}