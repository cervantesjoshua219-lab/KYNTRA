import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Rating } from '@/components/ProductCard';
import { SectionHeader } from '@/components/Card';
import { Text } from '@/components/Text';
import { reviews } from '@/data/content';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { useCart, useFavorites } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import type { Product } from '@/types';
import { formatPrice } from '@/utils';

type Params = { id?: string | string[] };

/**
 * Product details — Figma "07 Product Details" page 9:4756:
 *   9:1496 hero (412×915) · 9:1547 (360×800) · 9:1598 below-fold
 *   9:1708 size guide · 9:3095 reviews · 9:3180 write a review
 */
export default function ProductDetails() {
  const { id } = useLocalSearchParams<Params>();
  const productId = Array.isArray(id) ? id[0] : (id ?? '');

  const product = useAsync(() => productService.getById(productId), [productId]);
  const related = useAsync(
    () => (product.data ? productService.getRelated(product.data) : Promise.resolve([])),
    [product.data?.id],
  );

  if (product.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar back />
      </View>
    );
  }

  if (product.error || !product.data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar back />
        <View style={{ flex: 1, justifyContent: 'center', padding: PAGE_MARGIN, gap: spacing.lg }}>
          <Text variant="headline">Product unavailable</Text>
          <Text variant="body" tone="secondary">
            {product.error ?? 'We could not find that product.'}
          </Text>
          <Button label="Back to shop" onPress={() => router.replace('/shop')} />
        </View>
      </View>
    );
  }

  return <ProductBody product={product.data} related={related.data ?? []} />;
}

function ProductBody({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useCart();
  const { has, toggle } = useFavorites();

  const [color, setColor] = useState(product.colors[0]?.name ?? '');
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  const saved = has(product.id);
  const productReviews = reviews[product.id] ?? [];
  const sizeError = !size;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        back
        title={product.name}
        right={
          <IconButton
            accessibilityLabel={saved ? 'Remove from saved items' : 'Save to favourites'}
            tone="ghost"
            onPress={() => toggle(product.id)}
          >
            <Icon name="heart" size={22} color={saved ? colors.primary : colors.primary} />
          </IconButton>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl * 2 }}>
        {/* Gallery */}
        <View style={{ paddingHorizontal: PAGE_MARGIN }}>
          <View
            style={{
              width: '100%',
              aspectRatio: 4 / 5,
              borderRadius: radius.card,
              overflow: 'hidden',
              backgroundColor: colors.secondary,
            }}
          >
            {product.images[imageIndex] ? (
              <Image
                source={product.images[imageIndex]}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              /* Items added from the Inventory screen have no photograph. */
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                }}
              >
                <Icon name="package" size={28} color={colors.secondaryText} />
                <Text variant="label" tone="secondary">
                  No photo yet
                </Text>
              </View>
            )}
          </View>

          {product.images.length > 1 ? (
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
              {product.images.map((src, i) => (
                <Pressable
                  key={i}
                  onPress={() => setImageIndex(i)}
                  accessibilityRole="button"
                  accessibilityLabel={`Show image ${i + 1} of ${product.images.length}`}
                  accessibilityState={{ selected: i === imageIndex }}
                  style={{
                    width: 56,
                    height: 70,
                    borderRadius: radius.sm,
                    overflow: 'hidden',
                    borderWidth: i === imageIndex ? 2 : 1,
                    borderColor: i === imageIndex ? colors.primary : colors.border,
                  }}
                >
                  <Image source={src} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* Title block */}
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.xl, gap: spacing.sm }}>
          <Text variant="headline">{product.name}</Text>
          <Text variant="body" tone="secondary">
            {product.tagline}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.xs }}>
            <Text variant="title">
              {formatPrice(product.price)}
            </Text>
            {product.compareAtPrice ? (
              <Text variant="body" tone="secondary" style={{ textDecorationLine: 'line-through' }}>
                {formatPrice(product.compareAtPrice)}
              </Text>
            ) : null}
          </View>

          <Rating value={product.rating} count={product.reviewCount} />

          {product.stock <= 10 ? (
            <Text variant="caption" tone="error">
              Only {product.stock} left
            </Text>
          ) : null}
        </View>

        {/* Colour */}
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.xl, gap: spacing.md }}>
          <Text variant="label">Colour</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            {product.colors.map((c) => (
              <Pressable
                key={c.name}
                onPress={() => setColor(c.name)}
                accessibilityRole="radio"
                accessibilityState={{ selected: c.name === color }}
                accessibilityLabel={c.name}
                style={{
                  width: spacing.target,
                  height: spacing.target,
                  borderRadius: radius.pill,
                  backgroundColor: c.hex,
                  borderWidth: c.name === color ? 2 : 1,
                  borderColor: c.name === color ? colors.primary : colors.border,
                }}
              />
            ))}
          </View>
        </View>

        {/* Size */}
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.xl, gap: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="label">{size ? `Size ${size}` : 'Select a size'}</Text>
            <Text variant="label" tone="secondary" onPress={() => router.push('/help')}>
              Size guide
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {product.sizes.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSize(s)}
                accessibilityRole="radio"
                accessibilityState={{ selected: s === size }}
                accessibilityLabel={`Size ${s}`}
                style={{
                  minWidth: 56,
                  minHeight: spacing.target,
                  paddingHorizontal: spacing.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: radius.input,
                  borderWidth: 1,
                  borderColor: s === size ? colors.primary : colors.border,
                  backgroundColor: s === size ? colors.primary : colors.background,
                }}
              >
                <Text variant="label" style={{ color: s === size ? colors.background : colors.primary }}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quantity */}
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.xl, gap: spacing.md }}>
          <Text variant="label">Quantity</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="minus" size={16} />
            </Pressable>
            <Text variant="label" style={{ minWidth: 32, textAlign: 'center' }}>
              {quantity}
            </Text>
            <Pressable
              onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="plus" size={16} />
            </Pressable>
          </View>
        </View>

        {/* Add to bag */}
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.xl }}>
          {sizeError ? (
            <Text variant="caption" tone="error" style={{ marginBottom: spacing.sm }}>
              Choose a size to continue.
            </Text>
          ) : null}
          <Button
            label="Add to bag"
            block
            disabled={sizeError}
            onPress={() => {
              if (!size) return;
              addItem(product, size, color, quantity);
              router.navigate('/bag');
            }}
          />
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.xxl, gap: spacing.md }}>
          <SectionHeader title="Details" />
          <Text variant="body" tone="secondary">
            {product.description}
          </Text>
        </View>

        {/* Reviews */}
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.xxl, gap: spacing.lg }}>
          <SectionHeader
            title={`Reviews (${product.reviewCount})`}
            action={
              <Text variant="label" tone="secondary" onPress={() => router.push('/help')}>
                Write one
              </Text>
            }
          />

          {productReviews.length ? (
            productReviews.map((r) => (
              <View key={r.id} style={{ gap: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Text variant="label">{r.author}</Text>
                  <Text variant="caption" tone="secondary">
                    {r.relativeDate}
                  </Text>
                  {r.verified ? (
                    <Text variant="caption" tone="success">
                      Verified
                    </Text>
                  ) : null}
                </View>
                <Rating value={r.rating} />
                <Text variant="label">{r.title}</Text>
                <Text variant="body" tone="secondary">
                  {r.body}
                </Text>
                <Text variant="caption" tone="secondary">
                  {r.helpfulCount} found this helpful
                </Text>
              </View>
            ))
          ) : (
            <Text variant="body" tone="secondary">
              No reviews yet. Be the first to write one.
            </Text>
          )}
        </View>

        {/* Related */}
        {related.length ? (
          <View style={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
            <View style={{ paddingHorizontal: PAGE_MARGIN }}>
              <SectionHeader title="You might also like" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: PAGE_MARGIN }}
            >
              <View style={{ flexDirection: 'row', gap: spacing.lg }}>
                {related.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => router.replace(`/product/${p.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel={p.name}
                    style={{ width: 140, gap: spacing.sm }}
                  >
                    <View
                      style={{
                        width: 140,
                        height: 175,
                        borderRadius: radius.card,
                        overflow: 'hidden',
                        backgroundColor: colors.secondary,
                      }}
                    >
                      <Image source={p.images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                    </View>
                    <Text variant="label" lines={1}>
                      {p.name}
                    </Text>
                    <Text variant="caption" tone="secondary">
                      {formatPrice(p.price)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}