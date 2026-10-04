import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { ProductGrid } from '@/components/ProductCard';
import { Text } from '@/components/Text';
import { aiSearchService } from '@/services/aiSearchService';
import { productService, trendingSearches } from '@/services/productService';
import { readJson, storageKeys, writeJson } from '@/services/storage';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import type { Product } from '@/types';

const TAB_BAR_CLEARANCE = 96;

type Mode = 'text' | 'ai' | 'scan';

/**
 * Search — Figma "06 Search" frames 9:1108 (AI / barcode entry), 9:1173,
 * 9:1226 and 9:1297 (results, empty and error states).
 */
export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [aiText, setAiText] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('text');
  const [searching, setSearching] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    void (async () => setRecent(await readJson<string[]>(storageKeys.recentSearches, [])))();
  }, []);

  async function runSearch(term: string) {
    setQuery(term);
    setMode('text');
    setAiText(null);
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const found = await productService.search(term);
    setResults(found);
    setSearching(false);

    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    void writeJson(storageKeys.recentSearches, next);
  }

  async function askAi(term: string) {
    setQuery(term);
    setMode('ai');
    setSearching(true);
    const answer = await aiSearchService.ask(term);
    setAiText(answer.text);
    setResults(answer.products);
    setSearching(false);
  }

  async function scan() {
    setScanning(true);
    // Needs a native module, so Expo Go returns the mock match below.
    const product = await aiSearchService.scanBarcode();
    setScanning(false);
    setMode('scan');
    if (product) router.push(`/product/${product.id}`);
  }

  const hasQuery = query.trim().length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.md, gap: spacing.md }}>
        <Text variant="title">Search</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            minHeight: spacing.target,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.pill,
            backgroundColor: colors.secondary,
          }}
        >
          <Icon name="search" size={20} color={colors.secondaryText} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products"
            placeholderTextColor={colors.secondaryText}
            returnKeyType="search"
            onSubmitEditing={() => void runSearch(query)}
            accessibilityLabel="Search products"
            style={{
              flex: 1,
              minHeight: spacing.target,
              fontFamily: 'Inter_400Regular',
              fontSize: 15,
              color: colors.primary,
            }}
          />
          {hasQuery ? (
            <IconButton
              accessibilityLabel="Clear search"
              tone="ghost"
              style={{ width: 32, height: 32 }}
              onPress={() => {
                setQuery('');
                setResults([]);
                setAiText(null);
                setMode('text');
              }}
            >
              <Icon name="close" size={18} color={colors.secondaryText} />
            </IconButton>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <ModeButton
            label="Ask KYNTRA"
            icon="sparkle"
            active={mode === 'ai'}
            onPress={() => void askAi(query || 'everyday trainer')}
          />
          <ModeButton
            label={scanning ? 'Scanning…' : 'Scan barcode'}
            icon="scan"
            active={mode === 'scan'}
            disabled={scanning}
            onPress={() => void scan()}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + spacing.xl }}>
        {searching ? (
          <Text variant="body" tone="secondary" style={{ padding: PAGE_MARGIN }}>
            Searching…
          </Text>
        ) : null}

        {aiText ? (
          <Text variant="body" style={{ padding: PAGE_MARGIN, paddingBottom: spacing.md }}>
            {aiText}
          </Text>
        ) : null}

        {hasQuery && !searching ? (
          results.length ? (
            <ProductGrid products={results} />
          ) : (
            <View style={{ padding: PAGE_MARGIN }}>
              <Text variant="body" tone="secondary">
                No results for “{query.trim()}”.
              </Text>
            </View>
          )
        ) : null}

        {!hasQuery ? (
          <View style={{ padding: PAGE_MARGIN, gap: spacing.xl }}>
            {recent.length ? (
              <View style={{ gap: spacing.md }}>
                <Text variant="section">Recent</Text>
                <View style={{ gap: spacing.sm }}>
                  {recent.map((term) => (
                    <Text
                      key={term}
                      variant="body"
                      tone="secondary"
                      onPress={() => void runSearch(term)}
                    >
                      {term}
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={{ gap: spacing.md }}>
              <Text variant="section">Trending</Text>
              <View style={{ gap: spacing.sm }}>
                {trendingSearches.map((term) => (
                  <Text
                    key={term}
                    variant="body"
                    tone="secondary"
                    onPress={() => void runSearch(term)}
                  >
                    {term}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function ModeButton({
  label,
  icon,
  active,
  disabled,
  onPress,
}: {
  label: string;
  icon: 'sparkle' | 'scan';
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? colors.primary : colors.background,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon name={icon} size={16} color={active ? colors.background : colors.primary} />
      <Text
        variant="label"
        onPress={disabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: active, disabled: !!disabled }}
        style={{ color: active ? colors.background : colors.primary }}
      >
        {label}
      </Text>
    </View>
  );
}