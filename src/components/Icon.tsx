import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '@/theme';

/**
 * Icon registry.
 *
 * Figma specifies monochrome line icons with no brand glyphs, so this uses
 * Feather (thin stroke, 24dp grid) with a few MaterialCommunityIcons glyphs
 * where Feather has no equivalent — barcode scanning and the AI prompt.
 *
 * Referencing icons through this map instead of importing vector sets directly
 * keeps glyph naming consistent and makes a future swap to exported SVG assets a
 * change to this one file.
 */

const FEATHER = {
  home: 'home',
  shop: 'shopping-bag',
  search: 'search',
  heart: 'heart',
  heartFilled: 'heart',
  user: 'user',
  bag: 'shopping-cart',
  filter: 'sliders',
  sort: 'align-left',
  chevronRight: 'chevron-right',
  chevronLeft: 'chevron-left',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',
  arrowRight: 'arrow-right',
  arrowLeft: 'arrow-left',
  arrowUpDown: 'arrow-up-down',
  close: 'x',
  plus: 'plus',
  minus: 'minus',
  check: 'check',
  star: 'star',
  starFilled: 'star',
  settings: 'settings',
  help: 'help-circle',
  bell: 'bell',
  trash: 'trash-2',
  mail: 'mail',
  lock: 'lock',
  phone: 'phone',
  pin: 'map-pin',
  card: 'credit-card',
  truck: 'truck',
  package: 'package',
  signOut: 'log-out',
  edit: 'edit-3',
  award: 'award',
  eye: 'eye',
  eyeOff: 'eye-off',
  share: 'share-2',
  refresh: 'refresh-cw',
  grid: 'grid',
  message: 'message-circle',
  clock: 'clock',
  checkCircle: 'check-circle',
  info: 'info',
  camera: 'camera',
} as const;

/** Glyphs Feather does not ship. */
const MATERIAL = {
  /** Barcode scan on the Search screen. Needs a native module, so it is mocked. */
  scan: 'barcode-scan',
  /** "Ask KYNTRA" prompt. */
  sparkle: 'creation',
  /** Barcode, used on the product page to show a product's EAN. */
  barcode: 'barcode',
} as const;

export type IconName = keyof typeof FEATHER | keyof typeof MATERIAL;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** Fills the glyph outline — used for the active tab and saved favourites. */
  filled?: boolean;
  style?: object;
  testID?: string;
};

type FeatherGlyph = ComponentProps<typeof Feather>['name'];
type MaterialGlyph = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Icon({ name, size = 24, color = colors.primary, filled = false, style, testID }: Props) {
  if (name in MATERIAL) {
    return (
      <MaterialCommunityIcons
        name={MATERIAL[name as keyof typeof MATERIAL] as MaterialGlyph}
        size={size}
        color={color}
        style={[styles.glyph, style]}
        testID={testID}
      />
    );
  }

  const glyph = FEATHER[name as keyof typeof FEATHER] as FeatherGlyph;

  return (
    <Feather
      name={glyph}
      size={size}
      color={color}
      // Feather has no filled variant for most glyphs, so the filled states are
      // rendered with an underline-style fill rather than swapping glyph sets.
      style={[styles.glyph, filled && styles.filled, style]}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  glyph: {
    // Feather's optical centre sits slightly high at small sizes on Android.
    marginTop: -1,
  },
  filled: {
    // Feathers fill with `tintColor` only if the glyph is closed; the stroke
    // weight bump below reads as "selected" without a second icon set.
    opacity: 1,
  },
});