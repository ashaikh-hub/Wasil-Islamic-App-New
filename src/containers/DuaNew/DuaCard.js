import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import Share from 'react-native-share';
import useStore from '../../store';
import { DuaDetailBismillah, DuaDetailBismillahWhite } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';
import { useThemeIcons } from '../../components';

const MODES = [
  { key: 'arabic', label: 'Arabic' },
  { key: 'transliteration', label: 'Transliteration' },
  { key: 'translation', label: 'Translation' },
];

const arabicFontSize = (text = '') => {
  const len = text.length;
  if (len < 120) return 32;
  if (len < 180) return 28;
  if (len < 250) return 26;
  return 23;
};

// One dua with Arabic / transliteration / translation tabs, share and favourite.
// When `scrollX` is given the card scales and fades as it moves in a horizontal pager.
const DuaCard = ({ dua, width = '100%', height, spacing = 0, index = 0, scrollX }) => {
  const { Colors, theme } = useTheme();
  const { HeartFilled, HeartOutline, Share: ShareIcon } = useThemeIcons();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const favourites = useStore((state) => state.favourites);
  const { addMovie, deleteMovie } = useStore.getState();
  const [mode, setMode] = useState('arabic');
  const isFavourite = favourites?.some((item) => item._id === dua._id);
  const Bismillah = theme === 'white' ? DuaDetailBismillahWhite : DuaDetailBismillah;

  let animated = null;
  if (scrollX && typeof width === 'number') {
    const step = width + spacing;
    const inputRange = [(index - 1) * step, index * step, (index + 1) * step];
    animated = {
      opacity: scrollX.interpolate({ inputRange, outputRange: [0.6, 1, 0.6], extrapolate: 'clamp' }),
      transform: [
        { translateY: scrollX.interpolate({ inputRange, outputRange: [20, 0, 20], extrapolate: 'clamp' }) },
        { scale: scrollX.interpolate({ inputRange, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' }) },
      ],
    };
  }

  const onShare = () =>
    Share.open({
      message: [dua.duanameenglish, dua.duainarabic, dua.duatranslation, dua.duareferrence, 'Wasil Islamic App']
        .filter(Boolean)
        .join('\n\n'),
    }).catch(() => {});

  const body =
    mode === 'arabic' ? (
      <Text style={[styles.arabic, { fontSize: arabicFontSize(dua.duainarabic), lineHeight: arabicFontSize(dua.duainarabic) * 1.8 }]}>
        {dua.duainarabic}
      </Text>
    ) : (
      <Text style={styles.translation}>{mode === 'translation' ? dua.duatranslation : dua.duatransliteration}</Text>
    );

  return (
    <View style={{ width, marginHorizontal: spacing / 2 }}>
      <Animated.View style={[styles.card, height ? { height } : null, animated]}>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={onShare} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Share dua">
            <ShareIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (isFavourite ? deleteMovie(dua) : addMovie(dua))}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
            {isFavourite ? <HeartFilled /> : <HeartOutline />}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flexGrow: height ? 1 : 0 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          bounces={false}>
          <Text style={styles.title}>{dua.duanameenglish}</Text>

          <View style={styles.segment} accessibilityRole="tablist">
            {MODES.map((m) => {
              const active = mode === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.segmentItem, active && styles.segmentItemActive]}
                  onPress={() => setMode(m.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}>
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]} numberOfLines={1} adjustsFontSizeToFit>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.bismillah}>
            <Bismillah />
          </View>
          {body}
          {dua.duareferrence ? <Text style={styles.reference}>{dua.duareferrence}</Text> : null}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default DuaCard;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    card: {
      width: '100%',
      borderRadius: Radius.lg + 8,
      borderWidth: 2,
      borderColor: isLight ? Colors.surface : Colors.accent,
      backgroundColor: isLight ? Colors.white : Colors.surfaceAlt,
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      overflow: 'hidden',
    },
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm },
    iconButton: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
    scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
    title: { fontSize: TypeScale.title + 2, textAlign: 'center', color: isLight ? Colors.heading : Colors.gold, fontFamily: Fonts.heading },
    segment: {
      flexDirection: 'row',
      marginTop: Spacing.lg,
      marginBottom: Spacing.lg,
      padding: 3,
      borderRadius: Radius.md,
      backgroundColor: isLight ? Colors.surfaceAlt : 'rgba(255,255,255,0.08)',
    },
    segmentItem: { flex: 1, minHeight: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
    segmentItemActive: { backgroundColor: Colors.button },
    segmentText: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.bodySemiBold },
    segmentTextActive: { color: Colors.onButton },
    bismillah: { alignItems: 'center', marginBottom: Spacing.md },
    arabic: { textAlign: 'center', writingDirection: 'rtl', color: Colors.textPrimary, fontFamily: Fonts.arabic },
    translation: { fontSize: TypeScale.subtitle + 1, lineHeight: 30, textAlign: 'center', color: Colors.textPrimary, fontFamily: Fonts.body },
    reference: { marginTop: Spacing.xl, fontSize: TypeScale.small + 1, textAlign: 'center', color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
