import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useFavorites } from '@/state';
import { colors, radius, spacing } from '@/theme';
import type { Product } from '@/types';
import { formatPrice } from '@/utils';

/** Star row. Figma shows half-star granularity on review summaries. */
export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon
            key={n}
            name="star"
            size={size}
            color={n <= Math.round(value) ? colors.primary : colors.border}
          />
        ))}
      </View>
      <Text variant="caption" tone="secondary">
        {value.toFixed(1)}
        {count != null ? ` (${count})` : ''}
      </Text>
    </View>
  );
}

/**
 * Price with optional strike-through original.
 *
 * Figma renders the discounted original in the muted secondary token, not a
 * heavier strike treatment.
 */
export function Price({ product, size = 'body' }: { product: Product; size?: 'body' | 'title' }) {
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
}

/** Small pill label — "New", "Sale", or a membership tag. */
export function Badge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'error' | 'success' }) {
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
}

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
 */
export function ProductCard({ product, width = 172, imageHeight }: CardProps) {
  const { has, toggle } = useFavorites();
  const saved = has(product.id);
  const height = imageHeight ?? Math.round((width * 5) / 4);

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
      style={({ pressed }) => ({ width, gap: spacing.sm, opacity: pressed ? 0.7 : 1 })}
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
          transition={200}
        />

        <Pressable
          onPress={() => toggle(product.id)}
          accessibilityRole="button"
          accessibilityLabel={saved ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
          accessibilityState={{ selected: saved }}
          hitSlop={8}
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
          }}
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
}

/** Two-column grid used on Shop, Favorites and search results. */
export function ProductGrid({
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
}

/** Compact horizontal carousel row. */
export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.lg }}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} width={160} />
      ))}
    </View>
  );
}