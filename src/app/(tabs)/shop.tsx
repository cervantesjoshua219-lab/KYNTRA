import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { BottomSheet, Chip, FilterGroup } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { ProductGrid } from '@/components/ProductCard';
import { Text } from '@/components/Text';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { colors, PAGE_MARGIN, spacing } from '@/theme';

const TAB_BAR_CLEARANCE = 96;

const CATEGORIES = ['All', 'Footwear', 'Apparel', 'Outerwear', 'Accessories'] as const;
const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'XS', 'S', 'M', 'L', 'XL'] as const;

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Most relevant' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
] as const;

/**
 * Shop — Figma "05 Shop" frames 9:928 (all products), 9:1008 (category),
 * 9:1338 (filters, selected state) and 9:1437 (sort sheet).
 */
export default function Shop() {
  const [category, setCategory] = useState<string>('All');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['id']>('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);

  const all = useAsync(() => productService.listAll(), []);

  const filtered = (all.data ?? [])
    .filter((p) => category === 'All' || p.category === category)
    .filter((p) => sizes.length === 0 || sizes.some((s) => p.sizes.includes(s)))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  const activeFilters = (category !== 'All' ? 1 : 0) + sizes.length;

  function toggleSize(size: string) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          height: 64,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          paddingHorizontal: PAGE_MARGIN,
        }}
      >
        <Text variant="title" style={{ flex: 1 }}>
          Shop
        </Text>
        <IconButton accessibilityLabel="Filters" tone="ghost" onPress={() => setFiltersOpen(true)}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="filter" size={22} />
            {activeFilters > 0 ? (
              <Text variant="caption" style={{ fontSize: 10, marginTop: -2 }}>
                {activeFilters}
              </Text>
            ) : null}
          </View>
        </IconButton>
        <IconButton accessibilityLabel="Sort" tone="ghost" onPress={() => setSortOpen(true)}>
          <Icon name="sort" size={22} />
        </IconButton>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: PAGE_MARGIN, gap: spacing.sm, paddingBottom: spacing.lg }}
      >
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + spacing.xl }}>
        <View style={{ paddingHorizontal: PAGE_MARGIN, paddingBottom: spacing.lg }}>
          <Text variant="caption" tone="secondary">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} ·{' '}
            {SORT_OPTIONS.find((s) => s.id === sort)?.label}
          </Text>
        </View>

        {filtered.length ? (
          <ProductGrid products={filtered} />
        ) : (
          <View style={{ padding: PAGE_MARGIN }}>
            <Text variant="body" tone="secondary">
              Nothing matches those filters.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Button
              label="Clear all"
              variant="outline"
              onPress={() => {
                setCategory('All');
                setSizes([]);
              }}
            />
            <Button
              label={`Show ${filtered.length}`}
              block
              onPress={() => setFiltersOpen(false)}
            />
          </View>
        }
      >
        <FilterGroup
          title="Category"
          options={CATEGORIES}
          selected={category === 'All' ? [] : [category]}
          onToggle={(value) => setCategory(category === value ? 'All' : value)}
        />
        <FilterGroup title="Size" options={SIZES} selected={sizes} onToggle={toggleSize} />
      </BottomSheet>

      <BottomSheet visible={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        <View style={{ gap: spacing.sm, paddingBottom: spacing.lg }}>
          {SORT_OPTIONS.map((o) => (
            <Chip
              key={o.id}
              label={o.label}
              selected={sort === o.id}
              onPress={() => {
                setSort(o.id);
                setSortOpen(false);
              }}
            />
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}