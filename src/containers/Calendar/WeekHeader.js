import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Fonts, TypeScale, Spacing } from '../../theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeekHeader = () => {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      {DAYS.map((day) => (
        <Text key={day} style={[styles.day, day === 'Fri' && styles.friday]}>
          {day}
        </Text>
      ))}
    </View>
  );
};

export default WeekHeader;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flexDirection: 'row', paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm },
    day: {
      flex: 1,
      textAlign: 'center',
      fontSize: TypeScale.small,
      color: Colors.textSecondary,
      fontFamily: Fonts.bodyBold,
    },
    friday: { color: Colors.gold },
  });
