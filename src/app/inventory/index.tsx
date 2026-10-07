import { useCallback, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { BottomSheet, Chip } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { InputField } from '@/components/InputField';
import { EmptyState } from '@/components/Screen';
import { Text } from '@/components/Text';
import { createProduct, deleteProduct, listCategories, searchProducts } from '@/services/db';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';
import type { Product } from '@/types';
import { formatPrice } from '@/utils';

/**
 * Inventory — Laboratory Exercise 05, the CRUD screen.
 *
 * Not a Figma screen: the file is a shopping app and has no stock-management
 * surface anywhere in it, so this is the one page added to the design. It lives
 * here as its own route rather than inside the Shop tab so the Shop grid stays
 * exactly as approved — no trash icons laid over the product cards.
 *
 * Everything on it is a live query, which is the point of the exercise:
 *
 * - the list renders `searchProducts()`, which is a parameterised `LIKE`
 * - the term is re-bound on every keystroke, so results update as you type
 * - `Add item` INSERTs and the row appears without a reload
 * - `Delete` removes the row behind a confirmation sheet
 *
 * It uses the app's own `BottomSheet` rather than `Alert.alert` for the two
 * dialogs. The lab asks for a confirmation prompt and `Alert` is a no-op on
 * react-native-web, which would have meant a delete that silently confirmed
 * itself during testing; the sheet behaves identically on Android and web.
 */
export default function Inventory() {
  const [query, setQuery] = useState('');
  // Seeded from the database on first render so the list is never blank before
  // the user has typed anything.
  const [rows, setRows] = useState<Product[]>(() => searchProducts(''));

  const [adding, setAdding] = useState(false);
  const [pending, setPending] = useState<Product | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Re-runs the query and keeps the term in step with the results.
   *
   * Deliberately not an effect: an effect that called this would be calling
   * `setState` synchronously during commit, which the React compiler rules
   * reject, and it would also lag one keystroke behind. Searching from the
   * event handler means the FlatList is already correct when it paints.
   */
  const runSearch = useCallback((term: string) => {
    setQuery(term);
    setRows(searchProducts(term));
  }, []);

  const openAdd = useCallback(() => {
    const options = listCategories();
    setCategories(options);
    setCategory(options[0] ?? '');
    setName('');
    setPrice('');
    setStock('');
    setErrors({});
    setAdding(true);
  }, []);

  const save = useCallback(() => {
    const parsedPrice = Number(price.replace(/[,\s]/g, ''));
    const parsedStock = Number(stock.replace(/[,\s]/g, ''));
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = 'Enter a name';
    if (!category) next.category = 'Choose a category';
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) next.price = 'Enter a price above 0';
    if (!Number.isInteger(parsedStock) || parsedStock < 0) next.stock = 'Enter a whole number, 0 or more';

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    createProduct({
      name: name.trim(),
      category,
      price: parsedPrice,
      stock: parsedStock,
    });

    setAdding(false);
    runSearch(query);
  }, [category, name, price, query, runSearch, stock]);

  const confirmDelete = useCallback(() => {
    if (!pending) return;
    deleteProduct(pending.id);
    setPending(null);
    runSearch(query);
  }, [pending, query, runSearch]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Inventory" />

      <View style={{ paddingHorizontal: PAGE_MARGIN, paddingBottom: spacing.md, gap: spacing.md }}>
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
            onChangeText={runSearch}
            placeholder="Search inventory"
            placeholderTextColor={colors.secondaryText}
            returnKeyType="search"
            accessibilityLabel="Search inventory"
            style={{
              flex: 1,
              minHeight: spacing.target,
              fontFamily: 'Inter_400Regular',
              fontSize: 15,
              color: colors.primary,
            }}
          />
          {query ? (
            <IconButton
              accessibilityLabel="Clear search"
              tone="ghost"
              style={{ width: 32, height: 32 }}
              onPress={() => runSearch('')}
            >
              <Icon name="close" size={18} color={colors.secondaryText} />
            </IconButton>
          ) : null}
        </View>

        <Button
          label="Add item"
          variant="secondary"
          block
          leading={<Icon name="plus" size={18} color={colors.primary} />}
          onPress={openAdd}
        />
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InventoryRow item={item} onDelete={() => setPending(item)} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: colors.border, marginLeft: PAGE_MARGIN }} />
        )}
        ListHeaderComponent={
          <Text
            variant="label"
            tone="secondary"
            style={{ paddingHorizontal: PAGE_MARGIN, paddingBottom: spacing.sm }}
          >
            {rows.length} {rows.length === 1 ? 'item' : 'items'}
            {query.trim() ? ' matching' : ''}
          </Text>
        }
        ListEmptyComponent={
          <View style={{ paddingHorizontal: PAGE_MARGIN }}>
            <EmptyState
              title={query.trim() ? 'No matches' : 'No items yet'}
              body={
                query.trim()
                  ? `Nothing in the database matches “${query.trim()}”.`
                  : 'Add an item to start building the catalogue.'
              }
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
      />

      {/* Add item — the lab's four fields, nothing invented beyond them. */}
      <BottomSheet
        visible={adding}
        onClose={() => setAdding(false)}
        title="Add item"
        footer={
          <Button label="Save item" block onPress={save} accessibilityLabel="Save item" />
        }
      >
        <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Product name"
            autoCapitalize="words"
            error={errors.name ?? null}
          />

          <View style={{ gap: spacing.sm }}>
            <Text variant="label">Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {categories.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={category === option}
                  onPress={() => setCategory(option)}
                />
              ))}
            </View>
            {errors.category ? (
              <Text variant="caption" tone="error">
                {errors.category}
              </Text>
            ) : null}
          </View>

          <InputField
            label="Price"
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            keyboardType="decimal-pad"
            error={errors.price ?? null}
          />

          <InputField
            label="Stock"
            value={stock}
            onChangeText={setStock}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.stock ?? null}
          />
        </View>
      </BottomSheet>

      {/* Delete confirmation. */}
      <BottomSheet
        visible={pending !== null}
        onClose={() => setPending(null)}
        title="Delete item"
        footer={
          <View style={{ gap: spacing.sm }}>
            <Button
              label={pending ? `Delete ${pending.name}` : 'Delete'}
              block
              onPress={confirmDelete}
              accessibilityLabel={pending ? `Confirm delete ${pending.name}` : 'Confirm delete'}
            />
            <Button label="Cancel" variant="secondary" block onPress={() => setPending(null)} />
          </View>
        }
      >
        <View style={{ paddingBottom: spacing.lg, gap: spacing.sm }}>
          <Text variant="body">This removes the row from the database.</Text>
          <Text variant="body" tone="secondary">
            Saved items and orders that reference it will drop the line the next time they are read.
          </Text>
        </View>
      </BottomSheet>
    </View>
  );
}

/**
 * One inventory row: name, then category, price and stock, with the delete
 * affordance the exercise asks for on each list card.
 */
function InventoryRow({ item, onDelete }: { item: Product; onDelete: () => void }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: 64,
        paddingHorizontal: PAGE_MARGIN,
        paddingVertical: spacing.md,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" lines={1}>
          {item.name}
        </Text>
        <Text variant="caption" tone="secondary" lines={1}>
          {item.category} · {formatPrice(item.price)} · {item.stock} in stock
          {item.images.length === 0 ? ' · no photo' : ''}
        </Text>
      </View>

      <IconButton
        accessibilityLabel={`Delete ${item.name}`}
        tone="ghost"
        onPress={onDelete}
        style={{ width: 44, height: 44 }}
      >
        <Icon name="trash" size={20} color={colors.error} />
      </IconButton>
    </View>
  );
}
