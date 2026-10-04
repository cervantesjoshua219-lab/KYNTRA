import { Image } from 'expo-image';
import { ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { SectionHeader } from '@/components/Card';
import { Text } from '@/components/Text';
import { collectionImage, productImage } from '@/data/images';
import { membershipTiers } from '@/data/content';
import { useUser } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';

/** Figma "14 Membership" page 9:4763, frames 9:2941, 9:3024 and 9:3061. */
export default function Membership() {
  const { membership, setMembership } = useUser();
  const plus = membershipTiers.find((t) => t.id === 'plus')!;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Membership" />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.xl, paddingBottom: spacing.xxxl }}>
        <View
          style={{
            height: 200,
            borderRadius: radius.card,
            overflow: 'hidden',
            backgroundColor: colors.secondary,
          }}
        >
          <Image source={collectionImage(2)} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text variant="headline">KYNTRA Plus</Text>
          <Text variant="body" tone="secondary">
            {plus.price} {plus.period}. Cancel any time.
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          {plus.benefits.map((benefit) => (
            <View key={benefit} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Icon name="check" size={18} />
              <Text variant="body">{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={{ gap: spacing.md }}>
          <SectionHeader title="Included with Plus" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: spacing.lg }}>
              {[productImage(0), productImage(4), productImage(1)].map((src, i) => (
                <View
                  key={i}
                  style={{
                    width: 120,
                    height: 150,
                    borderRadius: radius.card,
                    overflow: 'hidden',
                    backgroundColor: colors.secondary,
                  }}
                >
                  <Image source={src} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ gap: spacing.md }}>
          {membership === 'plus' ? (
            <Button
              label="Manage membership"
              variant="outline"
              block
              onPress={() => setMembership('member')}
            />
          ) : (
            <Button label="Join KYNTRA Plus" block onPress={() => setMembership('plus')} />
          )}
          <Text variant="caption" tone="secondary" align="center">
            Demo only — no payment is taken.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}