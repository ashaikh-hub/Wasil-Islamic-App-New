import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import DayCell from './DayCell';
import { isFriday, isToday, isRamadan, getIslamicEvent } from './calendarUtils';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';

const CalendarGrid = ({ data }) => {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  return (
    <View style={styles.grid}>
      {data.map((item) =>
        item.empty ? (
          <View key={item.id} style={styles.wrapper} />
        ) : (
          <DayCell
            key={item.gregorianDate}
            item={item}
            isToday={isToday(item.gregorianDate)}
            isFriday={isFriday(item.weekday)}
            isRamadan={isRamadan(item.hijriMonthNumber)}
            event={getIslamicEvent(item.hijriDate, item.hijriMonthNumber)}
            styles={styles}
          />
        ),
      )}
    </View>
  );
};

export default CalendarGrid;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.sm },
    wrapper: { width: `${100 / 7}%`, padding: 3 },
    cell: {
      aspectRatio: 0.82,
      borderRadius: Radius.sm + 2,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ramadan: { borderWidth: 1, borderColor: Colors.gold },
    today: { backgroundColor: Colors.button, borderWidth: 0 },
    greg: { fontSize: TypeScale.subtitle + 2, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    fridayText: { color: Colors.gold },
    hijri: {
      position: 'absolute',
      top: 4,
      right: 6,
      fontSize: TypeScale.caption,
      color: Colors.textSecondary,
      fontFamily: Fonts.body,
    },
    todayText: { color: Colors.onButton },
    eventDot: {
      position: 'absolute',
      bottom: 6,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.gold,
    },
    eventDotToday: { backgroundColor: Colors.onButton },
  });
};
