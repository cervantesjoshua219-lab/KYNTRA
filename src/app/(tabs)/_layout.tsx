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
 * `flex: 1` on Tabs and `position: 'relative'` are load-bearing, not cosmetic.
 * Nothing in `expo-router/ui` gives the container a height, so it was sizing to
 * each screen's content and the bar's `bottom: 0` was resolving against that
 * shifting box — measured at top=283 on Shop, 392 on Search, -72 on Favorites
 * (off the top of the screen) and 792 on Profile (below the fold), against a
 * correct value of 646. Making the chain full-height and explicitly positioned
 * is what pins the bar to the bottom on every screen.
 *
 * Tab screens render their own bottom clearance; the bar draws its own inset.
 */
export default function TabsLayout() {
  const { count } = useCart();

  return (
    <Tabs
      style={{
        flex: 1,
        position: 'relative',
        backgroundColor: colors.background,
      }}
    >
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <FloatingTabBar>{tabTriggers(count)}</FloatingTabBar>
      </TabList>
    </Tabs>
  );
}