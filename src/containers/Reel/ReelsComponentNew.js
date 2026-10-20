import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShortsNew from './ShortsNew';
import { Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';

// Reels are full-bleed video, so this screen is dark in every theme.
const ReelsComponentNew = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch('https://islamicapp.vercel.app/api/reels');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const renderBody = () => {
    if (status === 'loading') {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }
    if (status === 'error' || items.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.message}>{status === 'error' ? "Couldn't load reels" : 'No reels yet'}</Text>
          <Text style={styles.subMessage}>
            {status === 'error' ? 'Check your internet connection and try again.' : 'Please check back later.'}
          </Text>
          <TouchableOpacity style={styles.retry} onPress={load} accessibilityRole="button">
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <ShortsNew items={items} onRefresh={load} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {renderBody()}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + Spacing.sm }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  backButton: {
    position: 'absolute',
    left: Spacing.md,
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#FFFFFF', fontSize: 30, lineHeight: 32, marginTop: -2 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  message: { color: '#FFFFFF', fontSize: TypeScale.subtitle, fontFamily: Fonts.heading, textAlign: 'center' },
  subMessage: { color: 'rgba(255,255,255,0.7)', fontSize: TypeScale.body, fontFamily: Fonts.body, textAlign: 'center' },
  retry: {
    marginTop: Spacing.sm,
    minHeight: MIN_TOUCH,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
  },
  retryText: { color: '#FFFFFF', fontSize: TypeScale.body, fontFamily: Fonts.bodyBold },
});

export default ReelsComponentNew;
