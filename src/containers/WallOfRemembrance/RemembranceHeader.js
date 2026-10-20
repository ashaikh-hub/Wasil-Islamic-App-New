import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';

// Verse card shown at the top of the wall and the form.
export default function RemembranceHeader({ arabic, translation, reference, title, subtitle }) {
  const { Colors } = useTheme();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <LinearGradient colors={[Colors.surface, Colors.name === 'white' ? Colors.accent : Colors.surfaceAlt]} style={s.card}>
      {title ? <Text style={s.title}>{title}</Text> : null}
      {arabic ? <Text style={s.arabic}>{arabic}</Text> : null}
      {translation ? <Text style={s.translation}>{translation}</Text> : null}
      {subtitle ? <Text style={s.translation}>{subtitle}</Text> : null}
      {reference ? <Text style={s.reference}>{reference}</Text> : null}
    </LinearGradient>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xl,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.gold,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    title: { fontSize: TypeScale.title + 2, color: '#FFFFFF', fontFamily: Fonts.heading, textAlign: 'center' },
    arabic: { fontSize: 22, lineHeight: 38, color: '#FFFFFF', fontFamily: Fonts.arabic, textAlign: 'center' },
    translation: { fontSize: TypeScale.small + 1, lineHeight: 19, color: 'rgba(255,255,255,0.85)', fontFamily: Fonts.body, textAlign: 'center' },
    reference: { fontSize: TypeScale.caption, color: Colors.gold, fontFamily: Fonts.bodySemiBold, letterSpacing: 0.5 },
  });
