import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import moment from 'moment';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { HOME_ART } from './homeAssets';
import { prayerWindow, formatTime12 } from './prayerTimes';

const RING = 104;
const STROKE = 6;
const R = (RING - STROKE) / 2;
const C = 2 * Math.PI * R;

const pad = (n) => String(n).padStart(2, '0');

// Prayer status card at the top of Home: location, dates, current/next prayer and a live countdown.
export default function PrayerHeader({ timings, hijriDate, gregorianDate, address, onLocationPress, locating, onViewAll }) {
  const { Colors, theme } = useTheme();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const art = HOME_ART[theme] || HOME_ART.white;
  const [now, setNow] = useState(moment());

  useEffect(() => {
    const id = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(id);
  }, []);

  const win = prayerWindow(timings, now);
  if (!win) return null;
  const remaining = Math.max(win.next.at.diff(now, 'seconds'), 0);
  const span = Math.max(win.next.at.diff(win.current.at, 'seconds'), 1);
  const progress = 1 - remaining / span;
  const countdown = `${pad(Math.floor(remaining / 3600))}:${pad(Math.floor((remaining % 3600) / 60))}:${pad(remaining % 60)}`;

  return (
    <ImageBackground source={art.banner} style={s.card} imageStyle={s.cardImage}>
      <LinearGradient colors={['rgba(10,6,30,0.65)', 'rgba(10,6,30,0.15)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <View style={s.row}>
        <View style={s.left}>
          <TouchableOpacity
            style={s.location}
            onPress={onLocationPress}
            disabled={locating}
            accessibilityRole="button"
            accessibilityLabel={`Location ${address || 'unknown'}. Tap to update`}>
            {locating ? <ActivityIndicator size="small" color={Colors.inkAccent} /> : <art.LocationIcon />}
            <Text style={s.locationText} numberOfLines={1}>
              {address || 'Set location'}
            </Text>
          </TouchableOpacity>
          <Text style={s.hijri}>{hijriDate}</Text>
          <Text style={s.gregorian}>{gregorianDate}</Text>
          <Text style={s.nowLabel}>Now · {win.current.name}</Text>
          <Text style={s.nowTime}>{formatTime12(win.current.time)}</Text>
          <Text style={s.next}>
            Next: {win.next.name} at {formatTime12(win.next.time)}
          </Text>
        </View>

        <View style={s.ring} accessible accessibilityLabel={`${countdown} until ${win.next.name}`}>
          <Svg width={RING} height={RING}>
            <Circle cx={RING / 2} cy={RING / 2} r={R} stroke="rgba(255,255,255,0.25)" strokeWidth={STROKE} fill="rgba(0,0,0,0.15)" />
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              stroke={Colors.gold}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              rotation={-90}
              origin={`${RING / 2}, ${RING / 2}`}
            />
          </Svg>
          <View style={s.ringLabel}>
            <Text style={s.countdown}>{countdown}</Text>
            <Text style={s.until}>until {win.next.name}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={s.viewAll} onPress={onViewAll} accessibilityRole="button">
        <Text style={s.viewAllText}>View all prayer times</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    card: { marginHorizontal: Spacing.lg, marginTop: Spacing.md, padding: Spacing.lg, borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.surface },
    cardImage: { borderRadius: Radius.lg, resizeMode: 'cover' },
    row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    left: { flex: 1 },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      maxWidth: '100%',
      gap: Spacing.xs,
      minHeight: 32,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.pill,
      backgroundColor: '#FFFFFF',
      marginBottom: Spacing.sm,
    },
    locationText: { flexShrink: 1, fontSize: TypeScale.small + 1, color: Colors.inkAccent, fontFamily: Fonts.bodySemiBold },
    hijri: { fontSize: TypeScale.body + 1, color: '#FFFFFF', fontFamily: Fonts.bodySemiBold },
    gregorian: { fontSize: TypeScale.small, color: 'rgba(255,255,255,0.8)', fontFamily: Fonts.body },
    nowLabel: { marginTop: Spacing.sm, fontSize: TypeScale.small, color: 'rgba(255,255,255,0.85)', fontFamily: Fonts.body },
    nowTime: { fontSize: TypeScale.display, lineHeight: 34, color: '#FFFFFF', fontFamily: Fonts.heading },
    next: { fontSize: TypeScale.small, color: 'rgba(255,255,255,0.85)', fontFamily: Fonts.body },
    ring: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
    ringLabel: { position: 'absolute', alignItems: 'center' },
    countdown: { fontSize: TypeScale.body, color: '#FFFFFF', fontFamily: Fonts.bodyBold, fontVariant: ['tabular-nums'] },
    until: { fontSize: TypeScale.caption, color: 'rgba(255,255,255,0.8)', fontFamily: Fonts.body },
    viewAll: {
      alignSelf: 'flex-start',
      marginTop: Spacing.md,
      minHeight: 36,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      backgroundColor: Colors.gold,
      justifyContent: 'center',
    },
    viewAllText: { fontSize: TypeScale.small + 1, color: '#1F1A2E', fontFamily: Fonts.bodyBold },
  });
