import { ScrollView, View } from 'react-native';
import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, PAGE_MARGIN, spacing } from '@/theme';
import { Text } from './Text';

/**
 * Screen chrome.
 *
 * Figma frames draw the Android status bar (h32) and navigation safe area
 * (h28) as design elements. Those are **not** reproduced here — Expo draws
 * them. `react-native-safe-area-context` insets the content instead, which is
 * the correct equivalent. Hand-building them would double-pad on device.
 */

type Props = {
  children: ReactNode;
  /** Scrolls the content. Off for screens that manage their own lists. */
  scroll?: boolean;
  /** Draws the bottom safe-area inset. Leave on unless a TabBar handles it. */
  bottomInset?: boolean;
  background?: string;
  /** Page-level horizontal gutter. Defaults to the 24dp page margin. */
  padded?: boolean;
  /** Sticky element pinned below the scroll area (bag/checkout totals). */
  footer?: ReactNode;
};

export function Screen({
  children,
  scroll = false,
  bottomInset = true,
  background = colors.background,
  padded = true,
  footer,
}: Props) {
  const content = (
    <View style={padded && { paddingHorizontal: PAGE_MARGIN }}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={bottomInset ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: background }}
    >
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {footer}
    </SafeAreaView>
  );
}

/**
 * Full-bleed variant for hero imagery and carousels that must reach the screen
 * edges. The gutter is re-applied inside by the caller.
 */
export function BleedScreen({
  children,
  scroll = false,
  bottomInset = true,
  background = colors.background,
}: Omit<Props, 'padded' | 'footer'>) {
  return (
    <Screen scroll={scroll} bottomInset={bottomInset} background={background} padded={false}>
      {children}
    </Screen>
  );
}

/** Section wrapper applying the 32dp gap between page sections. */
export function Section({
  children,
  style,
}: {
  children: ReactNode;
  style?: object;
}) {
  return <View style={[{ marginBottom: spacing.xxl }, style]}>{children}</View>;
}

/** Full-width empty / error state used by Favorites, Orders, Bag and search. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl * 2, gap: spacing.md }}>
      <Text variant="section" align="center">
        {title}
      </Text>
      {body ? (
        <Text variant="body" tone="secondary" align="center" style={{ maxWidth: 280 }}>
          {body}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: spacing.md }}>{action}</View> : null}
    </View>
  );
}

export function Divider({ style }: { style?: object }) {
  return <View style={[{ height: 1, backgroundColor: colors.border }, style]} />;
}