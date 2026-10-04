import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { colors, PAGE_MARGIN, spacing } from '@/theme';

type Params = { id?: string };

/** Figma "08 Checkout / Order Success" (9:2201). */
export default function CheckoutSuccess() {
  const { id } = useLocalSearchParams<Params>();
  const orderId = Array.isArray(id) ? id[0] : id;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: PAGE_MARGIN,
        gap: spacing.xl,
      }}
    >
      <Icon name="checkCircle" size={48} />

      <View style={{ gap: spacing.sm }}>
        <Text variant="headline">Order confirmed</Text>
        <Text variant="body" tone="secondary">
          {orderId ? `Reference ${orderId}. ` : ''}
          We have emailed your receipt and will let you know when it ships.
        </Text>
      </View>

      <View style={{ gap: spacing.md }}>
        <Button label="Track order" block onPress={() => router.replace('/orders')} />
        <Button label="Continue shopping" variant="outline" block onPress={() => router.replace('/')} />
      </View>
    </View>
  );
}