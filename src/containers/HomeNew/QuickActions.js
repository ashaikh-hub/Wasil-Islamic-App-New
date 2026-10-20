import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import { quickTiles } from './homeAssets';

// Grid of feature shortcuts. 5 per row on phones, 4 on very narrow screens, more on tablets.
export default function QuickActions({ navigation }) {
  const { Colors, theme } = useTheme();
  const { width } = useScreen();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const tiles = quickTiles(theme);
  const columns = width >= 700 ? 8 : width < 350 ? 4 : 5;
  const gap = Spacing.sm;
  const tileWidth = (width - Spacing.lg * 2 - gap * (columns - 1)) / columns;

  return (
    <View style={s.grid}>
      {tiles.map(({ label, screen, Icon }) => (
        <TouchableOpacity
          key={label}
          style={[s.tile, { width: tileWidth }]}
          onPress={() => navigation.navigate(screen)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={label}>
          <View style={s.icon}>
            <Icon />
          </View>
          <Text style={s.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
    tile: {
      minHeight: 80,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    icon: { height: 38, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: TypeScale.caption, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
  });
};
