import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Fonts, TypeScale, Spacing } from '../theme';

export default function SectionHeader({ title, actionLabel, onAction, style }) {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} hitSlop={10} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Spacing.xl,
      marginBottom: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    title: { fontSize: TypeScale.subtitle + 2, color: Colors.heading, fontFamily: Fonts.heading },
    action: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.bodySemiBold },
  });
