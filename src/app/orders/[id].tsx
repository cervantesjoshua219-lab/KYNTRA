import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Badge } from '@/components/ProductCard';
import { Divider, EmptyState } from '@/components/Screen';
import { Text } from '@/components/Text';
import { products } from '@/data/products';
import { useOrders } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import { formatPrice, relativeTime } from '@/utils';

type Params = { id?: string };

/** Figma "09 Orders" detail frame 9:2635. */
export default function OrderDetail() {
  const { id } = useLocalSearchParams<Params>();
  const orderId = Array.isArray(id) ? id[0] : (id ?? '');
  const { getById, cancelOrder } = useOrders();
  const order = getById(orderId);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar back title="Order" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            title="Order not found"
            body={`We could not find order ${orderId}.`}
            action={<Button label="Back to orders" onPress={() => router.replace('/orders')} />}
          />
        </View>
      </View>
    );
  }

  const items = order.items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });

  const cancellable = order.status !== 'delivered' && order.status !== 'cancelled';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title={order.id} />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.xl }}>
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="section">Status</Text>
            <Badge label={order.status} tone={order.status === 'cancelled' ? 'error' : 'neutral'} />
          </View>
          <Text variant="body" tone="secondary">
            Placed {relativeTime(order.placedAt)}
          </Text>

          {order.tracking ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Icon name="truck" size={20} />
              <View style={{ gap: 2 }}>
                <Text variant="label">{order.tracking.carrier}</Text>
                <Text variant="caption" tone="secondary">
                  {order.tracking.number}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Items</Text>
          {items.map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
              <View
                style={{
                  width: 64,
                  height: 80,
                  borderRadius: radius.card,
                  overflow: 'hidden',
                  backgroundColor: colors.secondary,
                }}
              >
                <Image source={item.product.images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="label" lines={1}>
                  {item.product.name}
                </Text>
                <Text variant="caption" tone="secondary">
                  {item.size} · {item.color} · Qty {item.quantity}
                </Text>
              </View>
              <Text variant="label">
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Totals</Text>
          <Row label="Subtotal" value={formatPrice(order.totals.subtotal)} />
          <Row
            label="Delivery"
            value={order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}
          />
          <Divider />
          <Row label="Total" value={formatPrice(order.totals.total)} emphasise />
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Delivery address</Text>
          <Text variant="body" tone="secondary">
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ''}
          </Text>
          <Text variant="body" tone="secondary">
            {order.address.city}, {order.address.postcode}
          </Text>
        </View>

        {cancellable ? (
          <Button label="Cancel order" variant="outline" block onPress={() => cancelOrder(order.id)} />
        ) : null}
      </ScrollView>
    </View>
  );
}

function Row({ label, value, emphasise }: { label: string; value: string; emphasise?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text variant={emphasise ? 'label' : 'body'}>{label}</Text>
      <Text variant={emphasise ? 'label' : 'body'}>{value}</Text>
    </View>
  );
}