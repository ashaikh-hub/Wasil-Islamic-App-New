import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { getStorageItem } from '../Quran/mmkvStorage/storeData';
import { HOME_ART } from './homeAssets';

const parse = (raw) => {
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    return null;
  }
};

// "Continue reading" / "Continue listening" shortcuts into the Quran, shown once the user has history.
export default function ContinueCards() {
  const { Colors, theme } = useTheme();
  const navigation = useNavigation();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const { ReadIcon, ListenIcon } = HOME_ART[theme] || HOME_ART.white;
  const [lastRead, setLastRead] = useState(null);
  const [lastListen, setLastListen] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const read = parse(getStorageItem('lastReadSurah'));
      setLastRead(read?.id ? read : null);
      const listen = parse(getStorageItem('lastListening'));
      setLastListen(listen?.SurahItem && (listen?.AyahItem || listen?.completed) ? listen : null);
    }, []),
  );

  if (!lastRead && !lastListen) return null;

  const openRead = () =>
    navigation.navigate('SurahDetailPage', {
      selectedSurahItems: lastRead,
      surahNumber: lastRead.id,
      fromqc: 'qurancompletion',
      headersurahname: lastRead.transliteratedName,
    });

  const openListen = () =>
    navigation.navigate('SurahDetailPage', {
      selectedSurahItems: lastListen.SurahItem,
      selectedAyahItems: lastListen.completed ? null : lastListen.AyahItem,
      ayahIdFromBookmark: lastListen.completed ? null : lastListen.AyahItem.id,
      continuePlaying: !lastListen.completed,
      fromqc: 'qurancompletion',
      surahNumber: lastListen.SurahItem.id,
      headersurahname: lastListen.SurahItem.transliteratedName,
    });

  const Card = ({ Icon, title, subtitle, onPress, disabled }) => (
    <TouchableOpacity style={[s.card, disabled && s.disabled]} onPress={onPress} disabled={disabled} activeOpacity={0.85} accessibilityRole="button">
      <View style={s.icon}>
        <Icon />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.row}>
      <Card Icon={ReadIcon} title="Continue Reading" subtitle={lastRead ? lastRead.transliteratedName : 'No recent surah'} onPress={openRead} disabled={!lastRead} />
      <Card
        Icon={ListenIcon}
        title="Continue Listening"
        subtitle={lastListen ? lastListen.SurahItem.transliteratedName : 'No recent surah'}
        onPress={openListen}
        disabled={!lastListen}
      />
    </View>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    row: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginTop: Spacing.md },
    card: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      minHeight: 64,
      padding: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    disabled: { opacity: 0.5 },
    icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    subtitle: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
