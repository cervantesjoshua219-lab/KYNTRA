import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { ProductGridList } from '@/components/ProductCard';
import { EmptyState } from '@/components/Screen';
import { Text } from '@/components/Text';
import { listProducts } from '@/services/db';
import { useTabBarClearance } from '@/components/TabBar';
import { useFavorites } from '@/state';
import { colors, PAGE_MARGIN, spacing } from '@/theme';


/**
 * Favorites — Figma "10 Favorites" page 9:4759, frames 9:2242 (populated) and
 * 9:2302 (empty).
 *
 * The grid is virtualized because a saved list has no upper bound — it grows
 * one tap at a time and is the screen most likely to hold dozens of tiles.
 */
export default function Favorites() {
  const TAB_BAR_CLEARANCE = useTabBarClearance();
  const { ids, hydrating } = useFavorites();

  // ids are stored most-recent-first, so map in order rather than filtering the
  // catalogue — that keeps the saved order stable across launches.
  // Memoised on `ids` because the provider hands back a stable array reference;
  // without this a new array identity each render would re-render every tile.
  const saved = useMemo(() => {
    const catalogue = listProducts();
    return ids
      .map((id) => catalogue.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p != null);
  }, [ids]);

  if (hydrating) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProductGridList
        products={saved}
        horizontalPadding={0}
        width={172}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: PAGE_MARGIN, paddingVertical: spacing.lg }}>
            <Text variant="title">Saved</Text>
            {saved.length ? (
              <Text variant="caption" tone="secondary" style={{ marginTop: spacing.xs }}>
                {saved.length} {saved.length === 1 ? 'item' : 'items'}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nothing saved yet"
            body="Tap the heart on any product to keep it here for later."
            action={
              <Button label="Browse products" onPress={() => router.navigate('/shop')} />
            }
          />
        }
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + spacing.xl }}
      />
    </View>
  );
}