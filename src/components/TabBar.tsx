import type { Href } from 'expo-router';
import { TabTrigger, useTabTrigger } from 'expo-router/ui';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadows, spacing } from '@/theme';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Text } from './Text';

/**
 * Tab definitions.
 *
 * Six tabs, per the decision taken after the Figma audit: Home, Shop, Search,
 * Favorites, Bag and Profile. Favorites is a top-level destination because
 * Figma gives it a full page (9:4759), not just a Profile row.
 */
export const TABS = [
  { name: 'home', label: 'Home', icon: 'home', href: '/' },
  { name: 'shop', label: 'Shop', icon: 'shop', href: '/shop' },
  { name: 'search', label: 'Search', icon: 'search', href: '/search' },
  { name: 'favorites', label: 'Saved', icon: 'heart', href: '/favorites' },
  { name: 'bag', label: 'Bag', icon: 'bag', href: '/bag' },
  { name: 'profile', label: 'You', icon: 'user', href: '/profile' },
] as const satisfies readonly { name: string; label: string; icon: IconName; href: Href }[];

/** Renders the triggers a parent `<TabList asChild>` passes as children. */
export function FloatingTabBar({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: spacing.lg,
        // Clears the Android gesture handle on gesture-navigation devices.
        paddingBottom: Math.max(insets.bottom, spacing.md),
        paddingTop: spacing.md,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: spacing.sm,
          borderRadius: radius.nav,
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.float,
        }}
      >
        {children}
      </View>
    </View>
  );
}

/**
 * Builds the six triggers.
 *
 * Returned as elements rather than rendered markup for two reasons:
 *
 * 1. `<TabList asChild>` reads *its child's* `props.children` to discover tabs,
 *    so these must be passed in as children. Wrapping them in a `<View>` would
 *    make them grandchildren and the navigator would register zero routes.
 *    Each element's type must be exactly `TabTrigger`, so they cannot be
 *    wrapped in a helper component either.
 * 2. Each `TabTrigger` is a `Pressable` and owns its own press handling, so the
 *    pressed-state style has to live on it. `TabButton` below is purely visual —
 *    giving it its own `Pressable` would swallow the press before it reached the
 *    trigger.
 */
export function tabTriggers(bagCount: number) {
  return TABS.map((tab) => {
    const badge = tab.name === 'bag' && bagCount > 0 ? bagCount : undefined;

    return (
      <TabTrigger
        key={tab.name}
        name={tab.name}
        href={tab.href}
        accessibilityRole="button"
        accessibilityLabel={badge ? `${tab.label}, ${badge} items` : tab.label}
        style={({ pressed }) => ({
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <TabButton name={tab.name} label={tab.label} icon={tab.icon} badge={badge} />
      </TabTrigger>
    );
  });
}

/**
 * Tab contents.
 *
 * Active state comes from `useTabTrigger` rather than from the pathname, so it
 * stays correct if a tab ever maps to a nested route.
 *
 * These are plain `View`s on purpose — see the note on `tabTriggers`.
 */
function TabButton({
  name,
  label,
  icon,
  badge,
}: {
  name: string;
  label: string;
  icon: IconName;
  badge?: number;
}) {
  const { trigger } = useTabTrigger({ name });
  const active = Boolean(trigger?.isFocused);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <View>
        <Icon name={icon} size={22} color={active ? colors.primary : colors.secondaryText} />
        {badge != null ? (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -9,
              minWidth: 16,
              height: 16,
              paddingHorizontal: 4,
              borderRadius: 8,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.background, fontSize: 10, fontFamily: 'Inter_600SemiBold' }}>
              {badge > 9 ? '9+' : badge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Inter_600SemiBold',
          color: active ? colors.primary : colors.secondaryText,
        }}
      >
        {label}
      </Text>
    </View>
  );
}