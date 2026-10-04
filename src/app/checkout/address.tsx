import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { InputField } from '@/components/InputField';
import { Text } from '@/components/Text';
import { useUser } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import type { Address } from '@/types';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  line1: '',
  line2: '',
  city: '',
  postcode: '',
};

/** Step 1 of 4 — Figma "08 Checkout / 1 Address" (9:1932). */
export default function CheckoutAddress() {
  const { addresses, addAddress, setDefaultAddress, removeAddress } = useUser();

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const selected = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
  const formValid = Boolean(form.line1 && form.city && form.postcode);

  function set(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function saveAddress() {
    if (!formValid) return;
    addAddress({
      label: 'New address',
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      postcode: form.postcode,
      country: 'United Kingdom',
      isDefault: false,
    });
    setForm(EMPTY_FORM);
    setFormOpen(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Delivery address" />
      <CheckoutProgress current={1} />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.xl }}>
        <View style={{ gap: spacing.md }}>
          {addresses.map((a) => (
            <AddressRow
              key={a.id}
              address={a}
              selected={a.id === selected?.id}
              onSelect={() => setDefaultAddress(a.id)}
              onRemove={() => removeAddress(a.id)}
            />
          ))}
        </View>

        <Pressable
          onPress={() => setFormOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel={formOpen ? 'Cancel adding an address' : 'Add a new address'}
        >
          <Text variant="label" tone="secondary">
            {formOpen ? 'Cancel' : '+ Add a new address'}
          </Text>
        </Pressable>

        {formOpen ? (
          <View style={{ gap: spacing.lg }}>
            <InputField label="First name" value={form.firstName} onChangeText={(v) => set('firstName', v)} autoCapitalize="words" />
            <InputField label="Last name" value={form.lastName} onChangeText={(v) => set('lastName', v)} autoCapitalize="words" />
            <InputField label="Address line 1" value={form.line1} onChangeText={(v) => set('line1', v)} autoCapitalize="words" />
            <InputField label="Address line 2 (optional)" value={form.line2} onChangeText={(v) => set('line2', v)} autoCapitalize="words" />
            <InputField label="City" value={form.city} onChangeText={(v) => set('city', v)} autoCapitalize="words" />
            <InputField label="Postcode" value={form.postcode} onChangeText={(v) => set('postcode', v)} autoCapitalize="characters" />
            <Button label="Save address" block onPress={saveAddress} disabled={!formValid} />
          </View>
        ) : null}
      </ScrollView>

      <View style={{ padding: PAGE_MARGIN }}>
        <Button
          label="Continue"
          block
          disabled={!selected}
          onPress={() => router.push('/checkout/delivery')}
        />
      </View>
    </View>
  );
}

/** Four-step progress rail shown at the top of each checkout step. */
export function CheckoutProgress({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = ['Address', 'Delivery', 'Payment', 'Review'];

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.xs,
        paddingHorizontal: PAGE_MARGIN,
        paddingBottom: spacing.lg,
      }}
    >
      {steps.map((label, i) => (
        <View key={label} style={{ flex: 1, gap: spacing.xs }}>
          <View
            style={{
              height: 3,
              borderRadius: 2,
              backgroundColor: i < current ? colors.primary : colors.border,
            }}
          />
          <Text variant="caption" tone={i === current - 1 ? 'primary' : 'secondary'}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function AddressRow({
  address,
  selected,
  onSelect,
  onRemove,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`Deliver to ${address.line1}, ${address.city}`}
      style={{
        padding: spacing.lg,
        paddingRight: spacing.xxxl,
        borderRadius: radius.card,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.primary : colors.border,
        gap: spacing.xs,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="label">{address.label}</Text>
        {selected ? <Icon name="checkCircle" size={20} /> : null}
      </View>
      <Text variant="body" tone="secondary">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
      </Text>
      <Text variant="body" tone="secondary">
        {address.city}, {address.postcode}
      </Text>

      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${address.label} address`}
        hitSlop={10}
        style={{ position: 'absolute', right: spacing.md, bottom: spacing.md }}
      >
        <Icon name="trash" size={18} color={colors.secondaryText} />
      </Pressable>
    </Pressable>
  );
}