import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { IconButton } from '@/components/IconButton';
import { ListGroup, ListRow } from '@/components/ListRow';
import { Text } from '@/components/Text';
import { sizeGuideRows } from '@/data/content';
import { useUser } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';

/**
 * Settings — Figma "12 Settings" page 9:4761, frame 9:2745
 * ("Preferences — static dark mode toggle").
 *
 * The dark-mode toggle is wired to persisted state, but Figma defines no dark
 * palette, so it does not currently repaint the UI. Inventing dark tokens would
 * mean redesigning the system, which the brief forbids. `userInterfaceStyle` is
 * pinned to "light" in app.json to match.
 */
export default function Settings() {
  const { preferences, setPreference, addresses, paymentMethods, removeAddress } = useUser();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Settings" />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.xl, paddingBottom: spacing.xxxl }}>
        <View style={{ gap: spacing.md }}>
          <Text variant="section">Appearance</Text>
          <ListGroup>
            <ListRow
              label="Dark mode"
              detail="Not available in this release"
              value={preferences.darkMode}
              onValueChange={(next) => setPreference('darkMode', next)}
            />
          </ListGroup>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Notifications</Text>
          <ListGroup>
            <ListRow
              label="Push notifications"
              value={preferences.pushNotifications}
              onValueChange={(next) => setPreference('pushNotifications', next)}
            />
            <ListRow
              label="Email"
              value={preferences.emailNotifications}
              onValueChange={(next) => setPreference('emailNotifications', next)}
            />
            <ListRow
              label="Order SMS"
              value={preferences.orderSms}
              onValueChange={(next) => setPreference('orderSms', next)}
            />
          </ListGroup>
        </View>

        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="section">Addresses</Text>
            <IconButton
              accessibilityLabel="Add address"
              tone="ghost"
              onPress={() => router.push('/checkout/address')}
            >
              <Text variant="title" tone="secondary">+</Text>
            </IconButton>
          </View>
          <ListGroup>
            {addresses.map((a) => (
              <ListRow
                key={a.id}
                label={a.label}
                detail={`${a.line1}, ${a.city}, ${a.postcode}`}
                icon="pin"
                onPress={() => removeAddress(a.id)}
              />
            ))}
          </ListGroup>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Payment methods</Text>
          <ListGroup>
            {paymentMethods.map((m) => (
              <ListRow
                key={m.id}
                label={`${m.brand} ··${m.last4}`}
                detail={`Expires ${new Date(m.expiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`}
                icon="card"
              />
            ))}
            <ListRow
              label="Add a card"
              icon="plus"
              onPress={() => router.push('/checkout/add-payment')}
            />
          </ListGroup>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="section">Size guides</Text>
          <ListGroup>
            <SizeGuideTable title="Footwear" guide={sizeGuideRows.Footwear} />
            <SizeGuideTable title="Apparel" guide={sizeGuideRows.Apparel} />
          </ListGroup>
        </View>
      </ScrollView>
    </View>
  );
}

/** Figma "07 Product Details / Size guide" (9:1708). */
function SizeGuideTable({
  title,
  guide,
}: {
  title: string;
  guide: { columns: readonly string[]; rows: readonly (readonly string[])[] };
}) {
  return (
    <View style={{ padding: spacing.lg, gap: spacing.md }}>
      <Text variant="label">{title}</Text>
      <View style={{ borderRadius: radius.sm, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', backgroundColor: colors.background }}>
          {guide.columns.map((c) => (
            <Text
              key={c}
              variant="caption"
              style={{ flex: 1, padding: spacing.sm, color: colors.primary }}
            >
              {c}
            </Text>
          ))}
        </View>
        {guide.rows.map((row, i) => (
          <View
            key={row[0]}
            style={{
              flexDirection: 'row',
              backgroundColor: i % 2 === 0 ? colors.background : colors.secondary,
            }}
          >
            {row.map((cell) => (
              <Text key={cell} variant="caption" tone="secondary" style={{ flex: 1, padding: spacing.sm }}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}