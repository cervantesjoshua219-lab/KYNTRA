import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useCart, useUser } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils';

import { CheckoutProgress } from './address';

const OPTIONS = [
  { id: 'standard', title: 'Standard', detail: '2–3 working days', cost: 0 },
  { id: 'express', title: 'Express', detail: 'Next working day', cost: 6.95 },
  { id: 'plus', title: 'KYNTRA Plus', detail: 'Next working day, included', cost: 0 },
] as const;

/** Step 2 of 4 — Figma "08 Checkout / 2 Delivery" (9:1986). */
export default function CheckoutDelivery() {
  const { membership } = useUser();
  const { subtotal } = useCart();
  const [selected, setSelected] = useState<string>('standard');

  const available = OPTIONS.filter((o) => o.id !== 'plus' || membership === 'plus');

  // Free standard delivery above the threshold; the bag screen states this too.
  const standardIsFree = subtotal >= 75;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Delivery" />
      <CheckoutProgress current={2} />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.md }}>
        {available.map((option) => {
          const cost = option.cost === 0 && option.id === 'standard' && standardIsFree ? 0 : option.cost;
          return (
            <Pressable
              key={option.id}
              onPress={() => setSelected(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selected === option.id }}
              accessibilityLabel={`${option.title}, ${option.detail}`}
              style={{
                padding: spacing.lg,
                borderRadius: radius.card,
                borderWidth: selected === option.id ? 2 : 1,
                borderColor: selected === option.id ? colors.primary : colors.border,
                gap: spacing.xs,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="label">{option.title}</Text>
                {selected === option.id ? <Icon name="checkCircle" size={20} /> : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="body" tone="secondary">
                  {option.detail}
                </Text>
                <Text variant="label">
                  {cost === 0 ? 'Free' : formatPrice(cost)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ padding: PAGE_MARGIN }}>
        <Button
          label="Continue"
          block
          onPress={() =>
            router.push({ pathname: '/checkout/payment', params: { delivery: selected } })
          }
        />
      </View>
    </View>
  );
}