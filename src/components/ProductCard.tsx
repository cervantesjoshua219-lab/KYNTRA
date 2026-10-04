import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useFavorites } from '@/state';
import { colors, radius, spacing } from '@/theme';
import type { Product } from '@/types';
import { formatPrice } from '@/utils';

/**
 * Star row. Figma shows half-star granularity on review summaries.
 *
 * Memoized: it sits inside every product card and each render mounts five icon
 * glyphs, so it was one of the largest contributors to scroll jank.
 */
export const Rating = memo(function Rating({
  value,
  count,
  size = 14,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  const filled = Math.round(value);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon key={n} name="star" size={size} color={n <= filled ? colors.primary : colors.border} />
        ))}
      </View>
      <Text variant="caption" tone="secondary">
        {value.toFixed(1)}
        {count != null ? ` (${count})` : ''}
      </Text>
    </View>
  );
});

/**
 * Price with optional strike-through original.
 *
 * Figma renders the discounted original in the muted secondary token, not a
 * heavier strike treatment.
 */
export const Price = memo(function Price({
  product,
  size = 'body',
}: {
  product: Product;
  size?: 'body' | 'title';
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm }}>
      <Text variant={size} tone={product.compareAtPrice ? 'error' : 'primary'}>
        {formatPrice(product.price)}
      </Text>
      {product.compareAtPrice ? (
        <Text variant="caption" tone="secondary" style={{ textDecorationLine: 'line-through' }}>
          {formatPrice(product.compareAtPrice)}
        </Text>
      ) : null}
    </View>
  );
});

/** Small pill label — "New", "Sale", or a membership tag. */
export const Badge = memo(function Badge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'error' | 'success';
}) {
  const bg = tone === 'error' ? colors.error : tone === 'success' ? colors.success : colors.secondary;
  const fg = tone === 'neutral' ? colors.primary : colors.background;

  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        backgroundColor: bg,
      }}
    >
      <Text variant="caption" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
});

type CardProps = {
  product: Product;
  /** Fixed tile width for grids and carousels. */
  width?: number;
  /** Fixed image height. Defaults to a 4:5 ratio on the given width. */
  imageHeight?: number;
};

/**
 * Product tile.
 *
 * Image on top, then name, price, rating — the order Figma uses on Home
 * carousels, Shop grid and Favorites.
 *
 * The whole tile is one press target; the favourite toggle is a separate nested
 * target, which Android handles correctly for nested Pressables.
 *
 * Memoized on `product` identity. Catalogue objects live in a module-level
 * array so their references never change, which means a card only re-renders
 * when its own favourite state flips — not because an ancestor re-rendered.
 */
export const ProductCard = memo(function ProductCard({
  product,
  width = 172,
  imageHeight,
}: CardProps) {
  const { has, toggle } = useFavorites();
  const saved = has(product.id);
  const height = imageHeight ?? Math.round((width * 5) / 4);

  const open = useCallback(() => router.push(`/product/${product.id}`), [product.id]);
  const toggleSaved = useCallback(() => toggle(product.id), [toggle, product.id]);

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
      style={({ pressed }) => [{ width, gap: spacing.sm, opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        style={{
          width,
          height,
          borderRadius: radius.card,
          backgroundColor: colors.secondary,
          overflow: 'hidden',
        }}
      >
        <Image
          source={product.images[0]}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          // No fade: a transition on every tile keeps the surface repainting for
          // as long as the image is decoding, which is visible as stutter while
          // scrolling a freshly mounted row.
          transition={0}
          cachePolicy="memory-disk"
        />

        <Pressable
          onPress={toggleSaved}
          accessibilityRole="button"
          accessibilityLabel={saved ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
          accessibilityState={{ selected: saved }}
          hitSlop={8}
          style={FAVOURITE_BUTTON}
        >
          <Icon name="heart" size={18} color={saved ? colors.primary : colors.secondaryText} filled={saved} />
        </Pressable>

        {product.isNew || product.compareAtPrice ? (
          <View style={{ position: 'absolute', top: spacing.sm, left: spacing.sm }}>
            <Badge
              label={product.isNew ? 'New' : 'Sale'}
              tone={product.compareAtPrice ? 'error' : 'neutral'}
            />
          </View>
        ) : null}
      </View>

      <View style={{ gap: 2 }}>
        <Text variant="label" lines={1}>
          {product.name}
        </Text>
        <Price product={product} size="body" />
        <Rating value={product.rating} count={product.reviewCount} />
      </View>
    </Pressable>
  );
});

/**
 * Static two-column grid. Prefer {@link ProductGridList} on any screen that can
 * hold more than a handful of rows — this renders every tile at once.
 */
export const ProductGrid = memo(function ProductGrid({
  products,
  gap = spacing.lg,
  horizontalPadding = spacing.lg,
}: {
  products: Product[];
  gap?: number;
  horizontalPadding?: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap,
        paddingHorizontal: horizontalPadding,
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </View>
  );
});

/**
 * Virtualized two-column product grid.
 *
 * This is the version every list screen should use. The old `flexWrap` grid
 * mounted all tiles at once, so a screen with a few dozen products built the
 * whole tree up front — including five icon glyphs per tile for the star row —
 * and the user paid for all of it on the first frame and again on every scroll.
 *
 * `numColumns` with `columnWrapperStyle` reproduces the wrap layout exactly while
 * letting `FlatList` recycle rows, so only what is on screen is mounted.
 * `removeClippedSubviews` detaches off-screen tiles, which matters on Android
 * where a detached-but-mounted view still costs a layout pass.
 */
export function ProductGridList({
  products,
  gap = spacing.lg,
  horizontalPadding = spacing.lg,
  width = 172,
  onEndReached,
  ListHeaderComponent,
  ListEmptyComponent,
  ListFooterComponent,
  contentContainerStyle,
}: {
  products: Product[];
  gap?: number;
  horizontalPadding?: number;
  width?: number;
  onEndReached?: () => void;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  contentContainerStyle?: object;
}) {
  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} width={width} />,
    [width]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  // Note: no getItemLayout. With numColumns the index FlatList asks about is an
  // item index, not a row index, and every card's height depends on how many
  // text lines the name wraps to — so any hardcoded offset here desynchronises
  // scroll position. Omitting it costs a measure pass per row, which is
  // negligible next to rendering the tile, and it cannot be wrong.

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={[
        { paddingHorizontal: horizontalPadding, gap },
        contentContainerStyle,
      ]}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      removeClippedSubviews
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={7}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    />
  );
}

/**
 * Horizontal product carousel.
 *
 * Figma shows three tiles at a time with the fourth peeking. A horizontal
 * `FlatList` recycles those tiles; the previous implementation was a plain
 * `View` inside a `ScrollView`, which mounted every product in the collection.
 */
export function ProductCarousel({ products, width = 160 }: { products: Product[]; width?: number }) {
  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} width={width} />,
    [width]
  );
  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <FlatList
      horizontal
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.lg }}
      removeClippedSubviews
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={3}
    />
  );
}

const FAVOURITE_BUTTON = {
  position: 'absolute' as const,
  top: spacing.sm,
  right: spacing.sm,
  width: 32,
  height: 32,
  borderRadius: 16,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: colors.background,
};
