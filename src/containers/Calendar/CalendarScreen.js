import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StatusBar, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import WeekHeader from './WeekHeader';
import { getMonthlyCalendar } from './calendarService';
import { formatCalendarData, getHijriRange, getIslamicEvent, getGregorianMonthName } from './calendarUtils';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';

const CalendarScreen = () => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [cells, setCells] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setStatus('loading');
    try {
      const res = await getMonthlyCalendar(year, month);
      if (id !== requestId.current) return; // a newer month was requested meanwhile
      setCells(formatCalendarData(res));
      setStatus('ready');
    } catch (e) {
      if (id === requestId.current) setStatus('error');
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const shiftMonth = (delta) => {
    const d = new Date(year, month - 1 + delta, 1);
    setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
  };

  const goToday = () => {
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();

  const events = useMemo(
    () =>
      cells
        .filter((c) => !c.empty)
        .map((c) => ({ ...c, event: getIslamicEvent(c.hijriDate, c.hijriMonthNumber) }))
        .filter((c) => c.event),
    [cells],
  );
  const hasRamadan = cells.some((c) => c.hijriMonthNumber === 9);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }} showsVerticalScrollIndicator={false}>
        <CalendarHeader
          month={month}
          year={year}
          hijriRange={status === 'ready' ? getHijriRange(cells) : ''}
          onNext={() => shiftMonth(1)}
          onPrev={() => shiftMonth(-1)}
          onToday={goToday}
          showToday={!isCurrentMonth}
        />
        <WeekHeader />

        {status === 'loading' ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={Colors.textPrimary} />
          </View>
        ) : status === 'error' ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>Couldn't load this month</Text>
            <Text style={styles.stateText}>Check your internet connection and try again.</Text>
            <TouchableOpacity style={styles.retry} onPress={load} accessibilityRole="button">
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CalendarGrid data={cells} />

            <View style={styles.legend}>
              <LegendItem styles={styles} swatch={styles.swatchToday} label="Today" />
              <LegendItem styles={styles} swatch={styles.swatchEvent} label="Islamic event" />
              {hasRamadan ? <LegendItem styles={styles} swatch={styles.swatchRamadan} label="Ramadan" /> : null}
            </View>

            {events.length ? (
              <View style={styles.eventsCard}>
                <Text style={styles.eventsTitle} accessibilityRole="header">
                  This month
                </Text>
                {events.map((e) => (
                  <View key={e.gregorianDate} style={styles.eventRow}>
                    <View style={styles.eventDate}>
                      <Text style={styles.eventDay}>{e.day}</Text>
                      <Text style={styles.eventMonth}>{getGregorianMonthName(month).slice(0, 3)}</Text>
                    </View>
                    <View style={styles.eventBody}>
                      <Text style={styles.eventName}>{e.event}</Text>
                      <Text style={styles.eventHijri}>
                        {e.hijriDate} {e.hijriMonth} {e.hijriYear}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const LegendItem = ({ styles, swatch, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.swatch, swatch]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

export default CalendarScreen;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    stateBox: { minHeight: 280, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.sm },
    stateTitle: { fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading, textAlign: 'center' },
    stateText: { fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body, textAlign: 'center' },
    retry: {
      marginTop: Spacing.sm,
      minHeight: 44,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
      justifyContent: 'center',
    },
    retryText: { color: Colors.onButton, fontSize: TypeScale.body, fontFamily: Fonts.bodyBold },

    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs + 2 },
    swatch: { width: 12, height: 12, borderRadius: 3 },
    swatchToday: { backgroundColor: Colors.button },
    swatchEvent: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
    swatchRamadan: { borderWidth: 1, borderColor: Colors.gold },
    legendText: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body },

    eventsCard: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      gap: Spacing.md,
    },
    eventsTitle: { fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading },
    eventRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    eventDate: {
      width: 48,
      height: 48,
      borderRadius: Radius.sm,
      borderWidth: 1,
      borderColor: Colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    eventDay: { fontSize: TypeScale.subtitle, lineHeight: 18, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    eventMonth: { fontSize: TypeScale.caption, color: Colors.textSecondary, fontFamily: Fonts.body },
    eventBody: { flex: 1 },
    eventName: { fontSize: TypeScale.body + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    eventHijri: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
