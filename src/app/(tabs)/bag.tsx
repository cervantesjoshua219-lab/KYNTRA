import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { EmptyState } from '@/components/Screen';
import { Text } from '@/components/Text';
import { useCart } from '@/state';
import type { CartLine } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import { clamp, formatPrice } from '@/utils';
import { FREE_SHIPPING_THRESHOLD } from '@/state/CartProvider';

const TAB_BAR_CLEARANCE = 96;

/**
 * Bag — Figma "08 Bag & Checkout" frames 9:1837 and 9:1865.
 *
 * Checkout itself lives in `/checkout`, so this screen only shows lines and a
 * running total.
 */
export default function Bag() {
  const { lines, count, totals, setQuantity, removeItem, isEmpty, hydrating, subtotal } = useCart();

  if (hydrating) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: PAGE_MARGIN, paddingVertical: spacing.lg }}>
        <Text variant="title">Bag</Text>
        {!isEmpty ? (
          <Text variant="caption" tone="secondary" style={{ marginTop: spacing.xs }}>
            {count} {count === 1 ? 'item' : 'items'}
          </Text>
        ) : null}
      </View>

      {isEmpty ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            title="Your bag is empty"
            body="Saved items will appear here when you add something to your bag."
            action={<Button label="Start shopping" onPress={() => router.navigate('/shop')} />}
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
            {lines.map((line) => (
              <BagLine
                key={line.id}
                line={line}
                onQuantity={(q) => setQuantity(line.id, q)}
                onRemove={() => removeItem(line.id)}
              />
            ))}
          </ScrollView>

          <View
            style={{
              paddingHorizontal: PAGE_MARGIN,
              paddingTop: spacing.lg,
              paddingBottom: TAB_BAR_CLEARANCE,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              gap: spacing.md,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="body">Subtotal</Text>
              <Text variant="body">{formatPrice(totals.subtotal)}</Text>
            </View>
            <Text variant="caption" tone="secondary">
              Delivery is calculated at checkout.
            </Text>
            {subtotal < FREE_SHIPPING_THRESHOLD ? (
              <Text variant="caption" tone="secondary">
                Spend {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                free delivery.
              </Text>
            ) : null}

            <Button
              label="Checkout"
              block
              onPress={() => router.push('/checkout/address')}
            />
          </View>
        </>
      )}
    </View>
  );
}

function BagLine({
  line,
  onQuantity,
  onRemove,
}: {
  line: CartLine;
  onQuantity: (q: number) => void;
  onRemove: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.lg,
        paddingHorizontal: PAGE_MARGIN,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Pressable
        onPress={() => router.push(`/product/${line.productId}`)}
        accessibilityRole="button"
        accessibilityLabel={`${line.product.name}, ${line.size}, ${line.color}`}
        style={{
          width: 96,
          height: 120,
          borderRadius: radius.card,
          overflow: 'hidden',
          backgroundColor: colors.secondary,
        }}
      >
        <Image source={line.product.images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </Pressable>

      <View style={{ flex: 1, gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
          <Text variant="label" lines={1} style={{ flex: 1 }}>
            {line.product.name}
          </Text>
          <Text variant="label">
            {formatPrice(line.product.price * line.quantity)}
          </Text>
        </View>

        <Text variant="caption" tone="secondary">
          {line.size} · {line.color}
        </Text>

        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Stepper
            value={line.quantity}
            onChange={(next) => onQuantity(clamp(next, 1, Math.min(10, line.product.stock)))}
            label={`Quantity for ${line.product.name}`}
          />

          <Pressable
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${line.product.name} from bag`}
            hitSlop={8}
            style={{ marginLeft: 'auto' }}
          >
            <Icon name="trash" size={18} color={colors.secondaryText} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** Minus / value / plus, sized so both ends meet the 48dp touch target. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Pressable
        onPress={() => onChange(value - 1)}
        disabled={value <= min}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        hitSlop={8}
        style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon name="minus" size={16} color={value <= min ? colors.border : colors.primary} />
      </Pressable>

      <Text variant="label" style={{ minWidth: 24, textAlign: 'center' }} accessibilityLabel={label}>
        {value}
      </Text>

      <Pressable
        onPress={() => onChange(value + 1)}
        disabled={value >= max}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        hitSlop={8}
        style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon name="plus" size={16} color={value >= max ? colors.border : colors.primary} />
      </Pressable>
    </View>
  );
}