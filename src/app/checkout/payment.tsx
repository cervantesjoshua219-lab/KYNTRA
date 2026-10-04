import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useUser } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';

import { CheckoutProgress } from './address';

type Params = { delivery?: string };

/** Step 3 of 4 — Figma "08 Checkout / 3 Payment" (9:2030). */
export default function CheckoutPayment() {
  const { delivery } = useLocalSearchParams<Params>();
  const { paymentMethods, setDefaultPaymentMethod, removePaymentMethod } = useUser();
  const [selected, setSelected] = useState<string | null>(
    paymentMethods.find((p) => p.isDefault)?.id ?? null,
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Payment" />
      <CheckoutProgress current={3} />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.md }}>
        {paymentMethods.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => {
              setSelected(m.id);
              setDefaultPaymentMethod(m.id);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === m.id }}
            accessibilityLabel={`${m.brand} ending ${m.last4}`}
            style={{
              padding: spacing.lg,
              paddingRight: spacing.xxxl,
              borderRadius: radius.card,
              borderWidth: selected === m.id ? 2 : 1,
              borderColor: selected === m.id ? colors.primary : colors.border,
              gap: spacing.xs,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="label">
                {m.brand} ··{m.last4}
              </Text>
              {selected === m.id ? <Icon name="checkCircle" size={20} /> : null}
            </View>
            <Text variant="caption" tone="secondary">
              Expires {new Date(m.expiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </Text>

            <Pressable
              onPress={() => removePaymentMethod(m.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${m.brand} ending ${m.last4}`}
              hitSlop={10}
              style={{ position: 'absolute', right: spacing.md, bottom: spacing.md }}
            >
              <Icon name="trash" size={18} color={colors.secondaryText} />
            </Pressable>
          </Pressable>
        ))}

        <Pressable
          onPress={() => router.push('/checkout/add-payment')}
          accessibilityRole="button"
          accessibilityLabel="Add a new card"
        >
          <Text variant="label" tone="secondary">
            + Add a new card
          </Text>
        </Pressable>
      </ScrollView>

      <View style={{ padding: PAGE_MARGIN }}>
        <Button
          label="Review order"
          block
          disabled={!selected}
          onPress={() =>
            router.push({
              pathname: '/checkout/review',
              params: { payment: selected, delivery: delivery ?? 'standard' },
            })
          }
        />
      </View>
    </View>
  );
}