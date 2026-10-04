import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { collectionImage } from '@/data/images';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { colors, PAGE_MARGIN, spacing } from '@/theme';
import { useAuth } from '@/state';

/**
 * Onboarding carousel — Figma "03 Onboarding" frames 9:318 / 9:343 / 9:368.
 *
 * Copy is taken from the frame names in Figma. Artwork uses the collection
 * placeholders until the real illustrations are exported.
 */
const SLIDES = [
  {
    key: 'discover',
    title: 'Discover',
    body: 'Everything you need, in one place.',
    image: collectionImage(0),
  },
  {
    key: 'sport',
    title: 'Sport & everyday',
    body: 'Kit that works for the training and the hours after.',
    image: collectionImage(1),
  },
  {
    key: 'seamless',
    title: 'Seamless shopping',
    body: 'Search by photo, ask KYNTRA, or scan a barcode.',
    image: collectionImage(2),
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<(typeof SLIDES)[number]>>(null);
  const { completeOnboarding } = useAuth();

  const isLast = index === SLIDES.length - 1;

  async function goToWelcome() {
    // Persisted so a returning user is sent straight to sign-in.
    await completeOnboarding();
    router.replace('/welcome');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: PAGE_MARGIN, gap: spacing.xxl }}>
            <View
              style={{
                width: '100%',
                aspectRatio: 4 / 5,
                borderRadius: 24,
                backgroundColor: colors.secondary,
                overflow: 'hidden',
              }}
            >
              <Image source={item.image} />
            </View>
            <View style={{ gap: spacing.md }}>
              <Text variant="headline">{item.title}</Text>
              <Text variant="body" tone="secondary">
                {item.body}
              </Text>
            </View>
          </View>
        )}
      />

      <View
        style={{
          paddingHorizontal: PAGE_MARGIN,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl + insets.bottom,
          gap: spacing.xl,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing.sm,
          }}
        >
          {SLIDES.map((slide, i) => (
            <View
              key={slide.key}
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          {isLast ? null : (
            <Button label="Skip" variant="ghost" onPress={goToWelcome} accessibilityLabel="Skip onboarding" />
          )}
          <Button
            label={isLast ? 'Get started' : 'Next'}
            block
            onPress={() => {
              if (isLast) {
                void goToWelcome();
                return;
              }
              listRef.current?.scrollToIndex({ index: index + 1, animated: true });
            }}
          />
        </View>
      </View>
    </View>
  );
}