import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from './Icon';
import { Text } from './Text';
import { colors, radius, shadows, spacing } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Pinned action row, e.g. "Show N results". */
  footer?: React.ReactNode;
};

/**
 * Bottom sheet.
 *
 * Built on `Modal` rather than a gesture-driven sheet library: the design only
 * needs a plain slide-up panel on Shop (filters 9:1338, sort 9:1437), and this
 * avoids a dependency while staying fully functional in Expo Go.
 *
 * Uses the 4dp gesture handle radius from the Figma Android chrome and the 36dp
 * floating-navigation radius for the panel's top corners.
 */
export function BottomSheet({ visible, onClose, title, children, footer }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(17,17,17,0.4)' }}
      />

      <View
        style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: radius.nav,
          borderTopRightRadius: radius.nav,
          paddingBottom: insets.bottom + spacing.lg,
          maxHeight: '80%',
          ...shadows.float,
        }}
      >
        <View style={{ alignItems: 'center', paddingTop: spacing.md }}>
          <View
            style={{
              width: 108,
              height: 4,
              borderRadius: radius.handle,
              backgroundColor: colors.border,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.lg,
            paddingBottom: spacing.md,
          }}
        >
          <Text variant="section" style={{ flex: 1 }}>
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={12}
            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="close" size={20} color={colors.secondaryText} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.xl }}>{children}</View>

        {footer ? (
          <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl }}>{footer}</View>
        ) : null}
      </View>
    </Modal>
  );
}

/** Selectable pill used for filter values and sort options. */
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={({ pressed }) => ({
        minHeight: 40,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : colors.background,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        variant="label"
        style={{ color: selected ? colors.background : colors.primary }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Labelled multi-select row inside the filter sheet. */
export function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View style={{ gap: spacing.md, paddingVertical: spacing.lg }}>
      <Text variant="label">{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onPress={() => onToggle(option)}
          />
        ))}
      </View>
    </View>
  );
}