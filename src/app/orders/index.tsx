import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Badge } from '@/components/ProductCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/Screen';
import { Text } from '@/components/Text';
import { listProducts } from '@/services/db';
import { useOrders } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import type { OrderStatus } from '@/types';
import { formatPrice, relativeTime } from '@/utils';

/** Status chip colours, drawn from the Figma palette. */
const STATUS_TONE: Record<OrderStatus, 'neutral' | 'success' | 'error'> = {
  confirmed: 'neutral',
  processing: 'neutral',
  shipped: 'neutral',
  delivered: 'success',
  cancelled: 'error',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

/** Figma "09 Orders" page 9:4758, frame 9:2533. */
export default function Orders() {
  const { orders, hydrating } = useOrders();

  if (hydrating) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  // One query per render, not one per order line: `listProducts()` is a SQL
  // read, and the flatMap below would otherwise issue it once per item.
  const catalogue = listProducts();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: PAGE_MARGIN, paddingVertical: spacing.lg }}>
        <Text variant="title">Orders</Text>
      </View>

      {orders.length ? (
        orders.map((order) => {
          // Order lines reference products by id; skip any that no longer exist.
          const items = order.items.flatMap((item) => {
            const product = catalogue.find((p) => p.id === item.productId);
            return product ? [{ ...item, product }] : [];
          });

          return (
            <View
              key={order.id}
              style={{
                paddingHorizontal: PAGE_MARGIN,
                paddingVertical: spacing.lg,
                gap: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ gap: 2 }}>
                  <Text variant="label">{order.id}</Text>
                  <Text variant="caption" tone="secondary">
                    {relativeTime(order.placedAt)} · {formatPrice(order.totals.total)}
                  </Text>
                </View>
                <Badge label={STATUS_LABEL[order.status]} tone={STATUS_TONE[order.status]} />
              </View>

              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                {items.slice(0, 4).map((item) => (
                  <View
                    key={item.id}
                    style={{
                      width: 56,
                      height: 70,
                      borderRadius: radius.sm,
                      overflow: 'hidden',
                      backgroundColor: colors.secondary,
                    }}
                  >
                    <Image
                      source={item.product.images[0]}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  </View>
                ))}
                {items.length > 4 ? (
                  <Text variant="caption" tone="secondary" style={{ alignSelf: 'center' }}>
                    +{items.length - 4}
                  </Text>
                ) : null}
              </View>

              <Button
                label="View order"
                variant="outline"
                onPress={() => router.push(`/orders/${order.id}`)}
              />
            </View>
          );
        })
      ) : (
        <EmptyState
          title="No orders yet"
          body="Orders you place will appear here with tracking."
          action={<Button label="Start shopping" onPress={() => router.navigate('/shop')} />}
        />
      )}
    </ScrollView>
  );
}