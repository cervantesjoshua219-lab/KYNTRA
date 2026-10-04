import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { Text } from '@/components/Text';
import { useUser } from '@/state';
import { colors, PAGE_MARGIN, spacing } from '@/theme';

/** Figma "08 Checkout / Add Payment" (9:2080). */
export default function AddPayment() {
  const { addPaymentMethod } = useUser();

  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const digits = number.replace(/\D/g, '');
  const valid = digits.length >= 12 && /^\d{2}\s*\/\s*\d{2}$/.test(expiry) && cvc.length >= 3 && name.trim().length > 0;

  // Brand is derived from the leading digits, which is all this mock needs —
  // no card data leaves the device and none is stored beyond brand + last4.
  const brand = digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'Card';

  function save() {
    if (!valid) return;
    addPaymentMethod({
      brand,
      last4: digits.slice(-4),
      expiry: new Date(`20${expiry.replace(/\D/g, '').slice(0, 4)}-01`).getTime(),
      isDefault: false,
    });
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Add a card" />

      <ScrollView
        contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="body" tone="secondary">
          Only the last four digits and the brand are kept.
        </Text>

        <InputField
          label="Card number"
          value={number}
          onChangeText={(v) => setNumber(v.replace(/[^\d ]/g, '').slice(0, 19))}
          placeholder="4242 4242 4242 4242"
          keyboardType="number-pad"
        />
        <InputField
          label="Expiry"
          value={expiry}
          onChangeText={(v) => {
            const d = v.replace(/\D/g, '').slice(0, 4);
            setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
          }}
          placeholder="MM/YY"
          keyboardType="number-pad"
        />
        <InputField
          label="Security code"
          value={cvc}
          onChangeText={(v) => setCvc(v.replace(/\D/g, '').slice(0, 4))}
          placeholder="123"
          keyboardType="number-pad"
          secure
        />
        <InputField
          label="Name on card"
          value={name}
          onChangeText={setName}
          placeholder="Alex Morgan"
          autoCapitalize="words"
        />
      </ScrollView>

      <View style={{ padding: PAGE_MARGIN }}>
        <Button label="Save card" block onPress={save} disabled={!valid} />
      </View>
    </View>
  );
}