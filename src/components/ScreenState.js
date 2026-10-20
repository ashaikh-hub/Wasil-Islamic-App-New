import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../theme';

const DEFAULTS = {
  error: { title: "Something went wrong", message: 'Check your internet connection and try again.' },
  empty: { title: 'Nothing here yet', message: 'Please check back later.' },
};

// Full-area loading / error / empty placeholder that follows the active theme.
export default function ScreenState({ status, title, message, onRetry, retryLabel = 'Try Again', style }) {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  if (status === 'loading') {
    return (
      <View style={[styles.box, style]} accessibilityLabel="Loading">
        <ActivityIndicator size="large" color={Colors.textPrimary} />
      </View>
    );
  }
  const copy = DEFAULTS[status] || DEFAULTS.error;
  return (
    <View style={[styles.box, style]}>
      <Text style={styles.title}>{title || copy.title}</Text>
      <Text style={styles.message}>{message || copy.message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.button} onPress={onRetry} accessibilityRole="button">
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    box: { flex: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.sm, backgroundColor: Colors.background },
    title: { fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading, textAlign: 'center' },
    message: { fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body, textAlign: 'center' },
    button: {
      marginTop: Spacing.sm,
      minHeight: MIN_TOUCH,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
      justifyContent: 'center',
    },
    buttonText: { color: Colors.onButton, fontSize: TypeScale.body, fontFamily: Fonts.bodyBold },
  });
