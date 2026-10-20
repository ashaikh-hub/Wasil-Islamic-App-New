import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Share from 'react-native-share';
import useStorehadith from '../../hadithstore';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';
import { useThemeIcons } from '../../components';

const narratorLine = (narrator = '') => {
  const n = narrator.trim();
  if (!n) return null;
  return n.toLowerCase().startsWith('narrated') ? n : `Narrated ${n}`;
};

const HadithCard = ({ hadith, index, favouriteshadith }) => {
  const { Colors } = useTheme();
  const { HeartFilled, HeartOutline, Share: ShareIcon } = useThemeIcons();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const { addhadith, deletehadith } = useStorehadith();
  const isFavourited = favouriteshadith.some(({ id }) => id === hadith.id);
  const number = hadith.hadithNumber || index + 1;
  const bookName = hadith.book?.bookName || hadith.bookSlug;

  const share = () =>
    Share.open({
      message: `Hadith ${number} — ${bookName}\n\n${hadith.hadithEnglish}\n\nWasil Islamic App | www.wasil.io`,
    }).catch(() => {});

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.number}>Hadith {number}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={share} style={styles.action} accessibilityRole="button" accessibilityLabel="Share hadith">
            <ShareIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (isFavourited ? deletehadith(hadith) : addhadith(hadith))}
            style={styles.action}
            accessibilityRole="button"
            accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}>
            {isFavourited ? <HeartFilled /> : <HeartOutline />}
          </TouchableOpacity>
        </View>
      </View>

      {hadith.hadithArabic ? <Text style={styles.arabic}>{hadith.hadithArabic}</Text> : null}
      {narratorLine(hadith.englishNarrator) ? <Text style={styles.narrator}>{narratorLine(hadith.englishNarrator)}</Text> : null}
      <Text style={styles.english}>{hadith.hadithEnglish}</Text>

      <View style={styles.meta}>
        <Text style={styles.reference}>{bookName}</Text>
        {hadith.book?.writerName ? <Text style={styles.reference}>{hadith.book.writerName}</Text> : null}
        {hadith.status ? <Text style={[styles.reference, styles.grade]}>{hadith.status}</Text> : null}
      </View>
    </View>
  );
};

export default HadithCard;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    card: {
      marginHorizontal: Spacing.lg,
      borderRadius: Radius.lg,
      overflow: 'hidden',
      backgroundColor: isLight ? Colors.white : Colors.surfaceAlt,
      borderWidth: isLight ? 1 : 0,
      borderColor: '#E6E1F0',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: Spacing.lg,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    number: { fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    actions: { flexDirection: 'row' },
    action: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
    arabic: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
      fontSize: 21,
      lineHeight: 38,
      textAlign: 'right',
      writingDirection: 'rtl',
      color: Colors.textPrimary,
      fontFamily: Fonts.arabic,
    },
    narrator: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      fontSize: TypeScale.body,
      color: Colors.gold,
      fontFamily: Fonts.bodyBold,
    },
    english: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xs,
      fontSize: TypeScale.body + 1,
      lineHeight: 23,
      color: Colors.textPrimary,
      fontFamily: Fonts.body,
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      margin: Spacing.lg,
      paddingTop: Spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isLight ? '#E6E1F0' : 'rgba(255,255,255,0.2)',
    },
    reference: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body },
    grade: { color: Colors.gold, fontFamily: Fonts.bodySemiBold },
  });
};
