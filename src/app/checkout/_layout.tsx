import { Stack } from 'expo-router';

import { colors } from '@/theme';

/**
 * Checkout — Figma "08 Bag & Checkout" is a five-step linear flow:
 *   9:1932 address · 9:1986 delivery · 9:2030 payment
 *   9:2080 add payment · 9:2132 review · 9:2201 success
 *
 * Rendered as a stack rather than tabs because each step is a forward
 * transition; the hardware back button walks the steps in reverse.
 */
export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="address" />
      <Stack.Screen name="delivery" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="add-payment" />
      <Stack.Screen name="review" />
      <Stack.Screen name="success" options={{ gestureEnabled: false }} />
    </Stack>
  );
}