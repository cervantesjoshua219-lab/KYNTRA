import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { Chip } from '@/components/BottomSheet';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { ProductCarousel } from '@/components/ProductCard';
import { SectionHeader } from '@/components/Card';
import { Text } from '@/components/Text';
import { useAsync } from '@/hooks/useAsync';
import { membershipImage } from '@/data/images';
import { productService } from '@/services/productService';
import { useAuth, useOrders } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import type { Product } from '@/types';

/** Height reserved at the bottom so the floating tab bar never covers content. */
const TAB_BAR_CLEARANCE = 96;

/**
 * Home — Figma "04 Home" frames 9:593 (412x915), 9:655 (360x800) and 9:717
 * (complete scroll content).
 *
 * Section order follows 9:717 exactly:
 *
 *   greeting + search bar          9:729, 9:731
 *   editorial campaign (hero)      9:735  scrimmed, 3 page indicators
 *   Featured                       9:748  -> 9:751
 *   Shop your movement + chips     9:774  -> 9:777-9:783
 *   editorial campaign             9:785
 *   New arrivals                   9:794  -> 9:797
 *   Best sellers                   9:822  -> 9:825
 *   KYNTRA Pass card               9:846  -> 9:850
 *   Recommended for you            9:852  -> 9:855
 *   editorial campaign             9:878
 *   Last chance / Sale             9:887  -> 9:890
 *   free-shipping card             9:911
 *
 * The whole page is one `FlatList` of heterogeneous rows. It was previously a
 * `ScrollView` with three horizontal `ScrollView`s nested inside it, which
 * mounted every tile in every carousel up front and made Android fight over
 * scroll gestures between parent and child.
 */

type Row =
  | { kind: 'intro'; key: string }
  | { kind: 'hero'; key: string }
  | { kind: 'section'; key: string; title: string; action?: string; products: Product[] }
  | { kind: 'chips'; key: string }
  | { kind: 'campaign'; key: string; index: number }
  | { kind: 'pass'; key: string }
  | { kind: 'shipping'; key: string };

export default function Home() {
  const { unreadCount } = useOrders();
  const { session } = useAuth();
  const [sport, setSport] = useState<string | null>(null);
  const [campaign, setCampaign] = useState(0);

  const all = useAsync(() => productService.listAll(), []);
  const categories = useAsync(() => productService.getCategories(), []);
  const collections = useAsync(() => productService.getCollections(), []);

  const firstName =
    session?.firstName?.trim() || session?.email?.split('@')[0] || 'there';

  // `?? []` would mint a new array on every render, which invalidates `rows`,
  // `renderRow` and every memoised tile below them. FlatList re-runs renderItem
  // whenever its identity changes, so an unstable array here defeats the whole
  // point of memoising ProductCard.
  const products = useMemo(() => all.data ?? [], [all.data]);
  const campaigns = useMemo(() => collections.data ?? [], [collections.data]);

  const bySport = useCallback(
    (name: string | null) => (name ? products.filter((p) => p.sport === name) : products),
    [products]
  );

  const rows = useMemo<Row[]>(() => {
    const sale = products.filter((p) => p.compareAtPrice);
    const bestSellers = [...products].sort((a, b) => b.reviewCount - a.reviewCount);
    const out: Row[] = [];

    out.push({ kind: 'intro', key: 'intro' });
    if (campaigns.length) out.push({ kind: 'hero', key: 'hero' });

    const featured = bySport(sport).filter((p) => p.featured);
    if (featured.length) {
      out.push({ kind: 'section', key: 'featured', title: 'Featured', products: featured });
    }

    if (categories.data?.length) out.push({ kind: 'chips', key: 'chips' });
    if (campaigns[1]) out.push({ kind: 'campaign', key: 'campaign-2', index: 1 });

    const fresh = bySport(sport).filter((p) => p.isNew);
    if (fresh.length) out.push({ kind: 'section', key: 'new', title: 'New arrivals', products: fresh });

    if (bestSellers.length) {
      out.push({ kind: 'section', key: 'best', title: 'Best sellers', products: bestSellers });
    }

    out.push({ kind: 'pass', key: 'pass' });

    if (bySport(sport).length) {
      out.push({ kind: 'section', key: 'rec', title: 'Recommended for you', products: bySport(sport) });
    }

    if (campaigns[2]) out.push({ kind: 'campaign', key: 'campaign-3', index: 2 });

    if (sale.length) {
      out.push({
        kind: 'section',
        key: 'sale',
        title: 'Last chance / Sale',
        action: 'Shop Sale',
        products: sale,
      });
    }

    out.push({ kind: 'shipping', key: 'shipping' });
    return out;
  }, [products, campaigns, categories.data, sport, bySport]);

  const renderRow = useCallback(
    ({ item }: { item: Row }) => {
      switch (item.kind) {
        case 'intro':
          return <Intro firstName={firstName} />;
        case 'hero':
          return (
            <Campaign
              campaign={campaigns[campaign]}
              eyebrow={campaigns[campaign]?.eyebrow ?? ''}
              headline={campaigns[campaign]?.name ?? ''}
              blurb={campaigns[campaign]?.blurb ?? ''}
              index={campaign}
              total={campaigns.length}
              onSelect={setCampaign}
            />
          );
        case 'section':
          return (
            <View style={{ gap: spacing.lg }}>
              <View style={{ paddingHorizontal: PAGE_MARGIN }}>
                <SectionHeader
                  title={item.title}
                  action={
                    item.action ? (
                      <Text
                        variant="label"
                        tone="secondary"
                        onPress={() => router.navigate('/shop')}
                      >
                        {item.action}
                      </Text>
                    ) : undefined
                  }
                />
              </View>
              <View style={{ paddingLeft: PAGE_MARGIN }}>
                <ProductCarousel products={item.products} />
              </View>
            </View>
          );
        case 'chips':
          return (
            <View style={{ gap: spacing.lg }}>
              <View style={{ paddingHorizontal: PAGE_MARGIN }}>
                <SectionHeader title="Shop your movement" />
              </View>
              <View style={{ paddingLeft: PAGE_MARGIN }}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories.data ?? []}
                  keyExtractor={(c) => c.id}
                  contentContainerStyle={{ gap: spacing.sm, paddingRight: PAGE_MARGIN }}
                  renderItem={({ item: c }) => (
                    <Chip
                      label={c.name}
                      selected={sport === c.name}
                      onPress={() => setSport((prev) => (prev === c.name ? null : c.name))}
                    />
                  )}
                />
              </View>
            </View>
          );
        case 'campaign':
          return (
            <Campaign
              campaign={campaigns[item.index]}
              eyebrow={campaigns[item.index]?.eyebrow ?? ''}
              headline={campaigns[item.index]?.name ?? ''}
              blurb={campaigns[item.index]?.blurb ?? ''}
            />
          );
        case 'pass':
          return <PassCard />;
        case 'shipping':
          return <ShippingCard />;
        default:
          return null;
      }
    },
    [campaigns, campaign, categories.data, sport, firstName]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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

        <IconButton accessibilityLabel="Bag" tone="ghost" onPress={() => router.navigate('/bag')}>
          <Icon name="bag" size={22} />
        </IconButton>
      </View>

      <FlatList
        data={rows}
        renderItem={renderRow}
        keyExtractor={(r) => r.key}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE, gap: spacing.xxl }}
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/** Greeting and search entry — Figma `9:729` / `9:731`. */
function Intro({ firstName }: { firstName: string }) {
  return (
    <View style={{ paddingHorizontal: PAGE_MARGIN, gap: spacing.lg }}>
      <Text variant="headline">Good morning, {firstName}.</Text>
      <Pressable
        onPress={() => router.navigate('/search')}
        accessibilityRole="search"
        accessibilityLabel="Search products"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          height: 48,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.input,
          backgroundColor: colors.secondary,
        }}
      >
        <Icon name="search" size={20} color={colors.secondaryText} />
        <Text variant="body" tone="secondary">
          Search products, sports &amp; more
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Editorial campaign — Figma `9:735`.
 *
 * Includes the `Image scrim` and `Page indicators` layers from the design, which
 * the earlier revision omitted: without the scrim the white headline is
 * unreadable over the photograph.
 */
function Campaign({
  campaign,
  eyebrow,
  headline,
  blurb,
  index = 0,
  total,
  onSelect,
}: {
  campaign?: { image: unknown };
  eyebrow: string;
  headline: string;
  blurb: string;
  index?: number;
  total?: number;
  onSelect?: (i: number) => void;
}) {
  if (!campaign) return null;

  return (
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
          source={campaign.image as never}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="memory-disk"
          // The hero is the first thing on screen, so it should not queue behind
          // the carousels below it. The mid-page campaigns sit far down the
          // scroll, so they are explicitly deprioritised.
          priority={index === 0 ? 'high' : 'low'}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: spacing.lg,
            gap: spacing.xs,
            backgroundColor: 'rgba(17,17,17,0.45)',
          }}
        >
          <Text variant="caption" style={{ color: '#FFFFFF', letterSpacing: 1 }}>
            {eyebrow}
          </Text>
          <Text variant="section" style={{ color: '#FFFFFF' }}>
            {headline}
          </Text>
          {blurb ? (
            <Text variant="caption" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {blurb}
            </Text>
          ) : null}
        </View>
      </View>

      {total && total > 1 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing.xs,
            marginTop: spacing.md,
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <Pressable
              key={i}
              onPress={() => onSelect?.(i)}
              accessibilityRole="button"
              accessibilityLabel={`Campaign ${i + 1}`}
              hitSlop={8}
              style={{
                width: i === index ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** KYNTRA Pass promo — Figma `9:846`, copy verbatim. */
function PassCard() {
  return (
    <View style={{ paddingHorizontal: PAGE_MARGIN }}>
      <View
        style={{
          borderRadius: radius.card,
          overflow: 'hidden',
          backgroundColor: colors.secondary,
        }}
      >
        <Image
          source={membershipImage(0)}
          style={{ width: '100%', height: 160 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          <Text variant="caption" style={{ letterSpacing: 1 }}>
            THE MEMBERS&apos; ADVANTAGE
          </Text>
          <Text variant="section">{'Your movement.\nYour rewards.'}</Text>
          <Text variant="body" tone="secondary">
            Early access, exclusive events and points on every purchase.
          </Text>
          <Pressable
            onPress={() => router.push('/membership')}
            accessibilityRole="button"
            style={{
              marginTop: spacing.sm,
              height: 48,
              borderRadius: radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary,
            }}
          >
            <Text variant="label" style={{ color: '#FFFFFF' }}>
              Explore KYNTRA Pass
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** Free-shipping reassurance — Figma `9:911`. */
function ShippingCard() {
  return (
    <View style={{ paddingHorizontal: PAGE_MARGIN }}>
      <View
        style={{
          padding: spacing.lg,
          borderRadius: radius.card,
          gap: spacing.xs,
          backgroundColor: colors.secondary,
        }}
      >
        <Text variant="label">Free shipping on orders over &#8369;8,000</Text>
        <Text variant="body" tone="secondary">
          Easy 30-day returns. Secure local payments. Made to keep you moving.
        </Text>
      </View>
    </View>
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
