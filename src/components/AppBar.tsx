import { router } from 'expo-router';
import { View } from 'react-native';

import { PAGE_MARGIN, spacing } from '@/theme';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Text } from './Text';

type Props = {
  title?: string;
  /** Shows a back chevron wired to the router. */
  back?: boolean;
  /** Overrides the router back action. */
  onBack?: () => void;
  right?: React.ReactNode;
  /** Renders the bar without the 24dp page gutter (used inside carousels). */
  flush?: boolean;
  transparent?: boolean;
};

/**
 * Screen app bar.
 *
 * Figma's app bar is 64dp tall with 16dp padding and an 8dp gap between items
 * (Product Details, #9:1496). The height is enforced here rather than by the
 * caller so every screen matches.
 *
 * Safe-area top inset is handled by `Screen`, not by this component — otherwise
 * the two would stack.
 */
export function AppBar({ title, back = false, onBack, right, flush = false, transparent = false }: Props) {
  return (
    <View
      style={{
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: flush ? 0 : PAGE_MARGIN - spacing.sm,
        backgroundColor: transparent ? 'transparent' : undefined,
      }}
    >
      {back ? (
        <IconButton
          accessibilityLabel="Go back"
          tone="ghost"
          onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/sign-in')))}
        >
          <Icon name="chevronLeft" size={24} />
        </IconButton>
      ) : null}

      <View style={{ flex: 1 }}>
        {title ? (
          <Text variant="title" lines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      {right}
    </View>
  );
}