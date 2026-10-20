import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HijriAdjustSVG } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';

const KEY = 'HIJRI_OFFSET';
const OFFSETS = [-2, -1, 0, 1, 2];

const statusText = (offset) =>
  offset === 0 ? 'Same day as Saudi Arabia' : `${Math.abs(offset)} day${Math.abs(offset) > 1 ? 's' : ''} ${offset < 0 ? 'behind' : 'ahead of'} Saudi Arabia`;

export default function HijriDates({ navigation }) {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const [saved, setSaved] = useState(0);
  const [selected, setSelected] = useState(0);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(KEY)
        .then((v) => {
          const n = parseInt(v, 10) || 0;
          setSaved(n);
          setSelected(n);
        })
        .catch(() => {});
    }, []),
  );

  const save = async () => {
    await AsyncStorage.setItem(KEY, String(selected)).catch(() => {});
    navigation.navigate('GuestNew', { refresh: true });
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={[s.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={s.art}>
        <HijriAdjustSVG />
      </View>
      <Text style={s.title}>Hijri Date Adjustment</Text>
      <Text style={s.description}>
        Islamic months begin with moon sightings 🌙 which may vary from country to country. You can shift the Hijri date to match your
        local moon sighting or stay with Saudi Arabia.
      </Text>

      <View style={s.selector} accessibilityRole="radiogroup">
        {OFFSETS.map((value) => {
          const active = value === selected;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => setSelected(value)}
              style={[s.option, active && s.optionActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              accessibilityLabel={statusText(value)}>
              <Text style={[s.optionText, active && s.optionTextActive]}>{value > 0 ? `+${value}` : value}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={s.status}>{statusText(selected)}</Text>

      <TouchableOpacity
        style={[s.save, selected === saved && s.saveMuted]}
        onPress={save}
        accessibilityRole="button">
        <Text style={s.saveText}>{selected === saved ? 'Done' : 'Save adjustment'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md },
    art: { marginBottom: Spacing.lg },
    title: { fontSize: TypeScale.headline, textAlign: 'center', color: Colors.heading, fontFamily: Fonts.heading },
    description: { fontSize: TypeScale.body, lineHeight: 21, textAlign: 'center', color: Colors.textSecondary, fontFamily: Fonts.body },
    selector: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginTop: Spacing.md,
      padding: Spacing.sm,
      borderRadius: Radius.pill,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    option: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
    optionActive: { backgroundColor: Colors.button },
    optionText: { fontSize: TypeScale.subtitle, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    optionTextActive: { color: Colors.onButton, fontFamily: Fonts.bodyBold },
    status: { fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    save: {
      marginTop: Spacing.lg,
      minHeight: MIN_TOUCH + 4,
      minWidth: 220,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveMuted: { opacity: 0.85 },
    saveText: { fontSize: TypeScale.subtitle, color: Colors.onButton, fontFamily: Fonts.bodyBold },
  });
};
