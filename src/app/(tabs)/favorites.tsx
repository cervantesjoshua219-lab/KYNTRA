import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/Button';
import { ProductGrid } from '@/components/ProductCard';
import { EmptyState } from '@/components/Screen';
import { Text } from '@/components/Text';
import { products } from '@/data/products';
import { useFavorites } from '@/state';
import { colors, PAGE_MARGIN, spacing } from '@/theme';

const TAB_BAR_CLEARANCE = 96;

/**
 * Favorites — Figma "10 Favorites" page 9:4759, frames 9:2242 (populated) and
 * 9:2302 (empty).
 */
export default function Favorites() {
  const { ids, hydrating } = useFavorites();

  // ids are stored most-recent-first, so map in order rather than filtering the
  // catalogue — that keeps the saved order stable across launches.
  const saved = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  if (hydrating) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + spacing.xl }}
    >
      <View style={{ paddingHorizontal: PAGE_MARGIN, paddingVertical: spacing.lg }}>
        <Text variant="title">Saved</Text>
        {saved.length ? (
          <Text variant="caption" tone="secondary" style={{ marginTop: spacing.xs }}>
            {saved.length} {saved.length === 1 ? 'item' : 'items'}
          </Text>
        ) : null}
      </View>

      {saved.length ? (
        <ProductGrid products={saved} />
      ) : (
        <EmptyState
          title="Nothing saved yet"
          body="Tap the heart on any product to keep it here for later."
          action={
            <Button label="Browse products" onPress={() => router.navigate('/shop')} />
          }
        />
      )}
    </ScrollView>
  );
}