import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Screen';
import { Text } from '@/components/Text';
import { useCart, useOrders, useUser } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils';

import { CheckoutProgress } from './address';

type Params = { payment?: string; delivery?: string };

/** Step 4 of 4 — Figma "08 Checkout / 4 Review" (9:2132). */
export default function CheckoutReview() {
  const { payment, delivery } = useLocalSearchParams<Params>();
  const { lines, totals, items, clear } = useCart();
  const { addresses, paymentMethods } = useUser();
  const { placeOrder } = useOrders();
  const [placing, setPlacing] = useState(false);

  const address = addresses.find((a) => a.id === (addresses.find((x) => x.isDefault)?.id ?? '')) ?? addresses[0];
  const method = paymentMethods.find((m) => m.id === payment) ?? null;

  const deliveryLabels: Record<string, string> = {
    standard: 'Standard · 2–3 working days',
    express: 'Express · next working day',
    plus: 'KYNTRA Plus · next working day',
  };

  function confirm() {
    if (!address || !method) return;
    setPlacing(true);
    const order = placeOrder({ items, totals, address, payment: method });
    clear();
    router.replace({ pathname: '/checkout/success', params: { id: order.id } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Review order" />
      <CheckoutProgress current={4} />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.xl }}>
        <View style={{ gap: spacing.md }}>
          <Text variant="section">Items</Text>
          {lines.map((line) => (
            <View key={line.id} style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
              <View
                style={{
                  width: 64,
                  height: 80,
                  borderRadius: radius.card,
                  overflow: 'hidden',
                  backgroundColor: colors.secondary,
                }}
              >
                <Image source={line.product.images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="label" lines={1}>
                  {line.product.name}
                </Text>
                <Text variant="caption" tone="secondary">
                  {line.size} · {line.color} · Qty {line.quantity}
                </Text>
              </View>
              <Text variant="label">
                {formatPrice(line.product.price * line.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Delivery</Text>
          {address ? (
            <Text variant="body" tone="secondary">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.postcode}
            </Text>
          ) : null}
          <Text variant="body" tone="secondary">
            {deliveryLabels[delivery ?? 'standard']}
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Payment</Text>
          {method ? (
            <Text variant="body" tone="secondary">
              {method.brand} ··{method.last4}
            </Text>
          ) : null}
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Total</Text>
          <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
          <Row
            label="Delivery"
            value={totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
          />
          <Divider />
          <Row label="Total" value={formatPrice(totals.total)} emphasise />
        </View>
      </ScrollView>

      <View style={{ padding: PAGE_MARGIN, gap: spacing.md }}>
        <Button
          label={`Pay ${formatPrice(totals.total)}`}
          block
          loading={placing}
          disabled={!address || !method}
          onPress={confirm}
        />
        <Text variant="caption" tone="secondary" align="center">
          This is a demo — no payment is taken.
        </Text>
      </View>
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