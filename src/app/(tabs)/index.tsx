import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { ProductCarousel, ProductGrid } from '@/components/ProductCard';
import { SectionHeader } from '@/components/Card';
import { Text } from '@/components/Text';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { useOrders } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';

/** Height reserved at the bottom of Home so the floating tab bar never covers content. */
const TAB_BAR_CLEARANCE = 96;

/**
 * Home — Figma "04 Home" frames 9:593 (412×915), 9:655 (360×800) and 9:717
 * (complete scroll content).
 */
export default function Home() {
  const { unreadCount } = useOrders();
  const featured = useAsync(() => productService.listFeatured(), []);
  const all = useAsync(() => productService.listAll(), []);
  const categories = useAsync(() => productService.getCategories(), []);
  const collections = useAsync(() => productService.getCollections(), []);

  const newIn = all.data?.filter((p) => p.isNew) ?? [];
  const rest = all.data?.filter((p) => !p.isNew) ?? [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
    >
      <View
        style={{
          height: 64,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: PAGE_MARGIN,
        }}
      >
        <Text variant="title" style={{ flex: 1 }}>
          KYNTRA
        </Text>

        <IconButton
          accessibilityLabel={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
          tone="ghost"
          onPress={() => router.push('/notifications')}
        >
          <View>
            <Icon name="bell" size={22} />
            {unreadCount > 0 ? <Dot /> : null}
          </View>
        </IconButton>

        <IconButton
          accessibilityLabel="Bag"
          tone="ghost"
          onPress={() => router.navigate('/bag')}
        >
          <Icon name="bag" size={22} />
        </IconButton>
      </View>

      <View style={{ gap: spacing.xxl }}>
        {/* Hero */}
        <View style={{ paddingHorizontal: PAGE_MARGIN }}>
          <View
            style={{
              height: 260,
              borderRadius: radius.card,
              backgroundColor: colors.secondary,
              overflow: 'hidden',
            }}
          >
            <Image
              source={collections.data?.[0]?.image}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
          <View style={{ marginTop: spacing.lg, gap: spacing.xs }}>
            <Text variant="headline">The Everyday edit</Text>
            <Text variant="body" tone="secondary">
              Kit that works for the training and the hours after.
            </Text>
          </View>
        </View>

        {/* Categories */}
        {categories.data?.length ? (
          <View style={{ gap: spacing.lg }}>
            <View style={{ paddingHorizontal: PAGE_MARGIN }}>
              <SectionHeader
                title="Shop by category"
                action={
                  <Text variant="label" tone="secondary" onPress={() => router.navigate('/shop')}>
                    See all
                  </Text>
                }
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: PAGE_MARGIN, gap: spacing.lg }}
            >
              {categories.data.map((c) => (
                <View key={c.id} style={{ width: 120, gap: spacing.sm }}>
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: radius.card,
                      overflow: 'hidden',
                      backgroundColor: colors.secondary,
                    }}
                  >
                    <Image source={c.image} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  </View>
                  <Text variant="label" lines={1}>
                    {c.name}
                  </Text>
                  <Text variant="caption" tone="secondary">
                    {c.count} items
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Featured */}
        {featured.data?.length ? (
          <View style={{ gap: spacing.lg }}>
            <View style={{ paddingHorizontal: PAGE_MARGIN }}>
              <SectionHeader title="Featured" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: PAGE_MARGIN }}
            >
              <ProductCarousel products={featured.data} />
            </ScrollView>
          </View>
        ) : null}

        {/* New in */}
        {newIn.length ? (
          <View style={{ gap: spacing.lg }}>
            <View style={{ paddingHorizontal: PAGE_MARGIN }}>
              <SectionHeader title="New in" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: PAGE_MARGIN }}
            >
              <ProductCarousel products={newIn} />
            </ScrollView>
          </View>
        ) : null}

        {/* Collections */}
        {collections.data?.length ? (
          <View style={{ gap: spacing.lg, paddingHorizontal: PAGE_MARGIN }}>
            <SectionHeader title="Collections" />
            {collections.data.map((c) => (
              <View key={c.id} style={{ gap: spacing.md }}>
                <View
                  style={{
                    width: '100%',
                    height: 160,
                    borderRadius: radius.card,
                    overflow: 'hidden',
                    backgroundColor: colors.secondary,
                  }}
                >
                  <Image source={c.image} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
                <Text variant="section">{c.name}</Text>
                <Text variant="body" tone="secondary">
                  {c.blurb}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Everything else */}
        {rest.length ? (
          <View style={{ gap: spacing.lg }}>
            <View style={{ paddingHorizontal: PAGE_MARGIN }}>
              <SectionHeader title="All products" />
            </View>
            <ProductGrid products={rest} />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

/** Unread indicator on the notifications bell. */
function Dot() {
  return (
    <View
      style={{
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
      }}
    />
  );
}