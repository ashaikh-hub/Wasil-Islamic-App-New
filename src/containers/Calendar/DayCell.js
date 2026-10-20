import React from 'react';
import { View, Text } from 'react-native';

const DayCell = ({ item, isToday, isFriday, isRamadan, event, styles }) => {
  const label = `${item.weekday} ${item.day}, ${item.hijriDate} ${item.hijriMonth}${event ? `, ${event}` : ''}${
    isToday ? ', today' : ''
  }`;
  return (
    <View style={styles.wrapper} accessible accessibilityLabel={label}>
      <View style={[styles.cell, isRamadan && styles.ramadan, isToday && styles.today]}>
        <Text style={[styles.hijri, isToday && styles.todayText]}>{item.hijriDate}</Text>
        <Text style={[styles.greg, isFriday && styles.fridayText, isToday && styles.todayText]}>{item.day}</Text>
        {event ? <View style={[styles.eventDot, isToday && styles.eventDotToday]} /> : null}
      </View>
    </View>
  );
};

export default React.memo(DayCell);
