import { TabList, TabSlot, Tabs } from 'expo-router/ui';

import { FloatingTabBar, tabTriggers } from '@/components/TabBar';
import { useCart } from '@/state';
import { colors } from '@/theme';

/**
 * Main tab group.
 *
 * Uses the headless `expo-router/ui` primitives so the design's floating pill
 * bar can replace the default one, while the navigator still preserves tab
 * state — the Shop filters and Search query survive tab switches.
 *
 * The triggers are passed to `<TabList asChild>` as its child's children, which
 * is how the navigator discovers them. See `tabTriggers` in components/TabBar.
 *
 * Tab screens render their own bottom clearance; the bar draws its own inset.
 */
export default function TabsLayout() {
  const { count } = useCart();

  return (
    <Tabs style={{ backgroundColor: colors.background }}>
      <TabSlot />
      <TabList asChild>
        <FloatingTabBar>{tabTriggers(count)}</FloatingTabBar>
      </TabList>
    </Tabs>
  );
}