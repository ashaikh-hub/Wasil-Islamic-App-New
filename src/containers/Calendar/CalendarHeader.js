import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getGregorianMonthName } from './calendarUtils';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';

const NavButton = ({ label, glyph, onPress, styles }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.navButton}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel={label}>
    <Text style={styles.navGlyph}>{glyph}</Text>
  </TouchableOpacity>
);

const CalendarHeader = ({ month, year, hijriRange, onNext, onPrev, onToday, showToday }) => {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  return (
    <View style={styles.container}>
      <NavButton label="Previous month" glyph="‹" onPress={onPrev} styles={styles} />
      <View style={styles.center} accessible accessibilityRole="header">
        <Text style={styles.gregorian}>
          {getGregorianMonthName(month)} {year}
        </Text>
        <Text style={styles.hijri} numberOfLines={1}>
          {hijriRange || ' '}
        </Text>
        {showToday ? (
          <TouchableOpacity onPress={onToday} style={styles.todayChip} accessibilityRole="button">
            <Text style={styles.todayChipText}>Back to today</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <NavButton label="Next month" glyph="›" onPress={onNext} styles={styles} />
    </View>
  );
};

export default CalendarHeader;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.lg,
    },
    center: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm },
    gregorian: { fontSize: TypeScale.title, color: Colors.heading, fontFamily: Fonts.heading },
    hijri: { marginTop: 2, fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
    navButton: {
      width: MIN_TOUCH,
      height: MIN_TOUCH,
      borderRadius: MIN_TOUCH / 2,
      borderWidth: 1,
      borderColor: Colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    navGlyph: { fontSize: 26, lineHeight: 28, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    todayChip: {
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
    },
    todayChipText: { fontSize: TypeScale.small, color: Colors.onButton, fontFamily: Fonts.bodyBold },
  });
