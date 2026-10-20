import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, StatusBar, RefreshControl } from 'react-native';
import axios from 'axios';
import { SvgUri } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WasilGreetingAdBannerSVG } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import { ScreenState, SectionHeader } from '../../components';

const API = 'https://islamicapp.vercel.app/api';
const NEW_WINDOW_DAYS = 31;
const NEW_MAX = 12;

// Most recently added cards: everything within a month of the newest upload.
const pickNewest = (cards) => {
  const dated = cards.filter((c) => c.createdAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (!dated.length) return cards.slice(0, NEW_MAX);
  const cutoff = new Date(dated[0].createdAt).getTime() - NEW_WINDOW_DAYS * 24 * 3600 * 1000;
  return dated.filter((c) => new Date(c.createdAt).getTime() >= cutoff).slice(0, NEW_MAX);
};

export default function GreetingsNew({ navigation }) {
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [categories, setCategories] = useState([]);
  const [newest, setNewest] = useState([]);
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [cats, all] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/allgreetings`).catch(() => ({ data: [] })), // the "new" rail is optional
      ]);
      setCategories(Array.isArray(cats.data) ? cats.data : []);
      setNewest(pickNewest(Array.isArray(all.data) ? all.data : []));
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (status !== 'ready') {
    return (
      <ScreenState
        status={status}
        title="Couldn't load greeting cards"
        onRetry={() => {
          setStatus('loading');
          load();
        }}
      />
    );
  }

  const columns = width >= 600 ? 5 : 3;
  const tileWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.textPrimary} />}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />

      <SectionHeader title="Categories" style={styles.firstHeader} />
      <View style={styles.grid}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() =>
              navigation.navigate('GreetingCardListNew', { cardid: item._id, categoryname: item.name, name: item.name })
            }
            style={[styles.tile, { width: tileWidth }]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} cards`}>
            {item.imagenew ? <SvgUri width={36} height={36} uri={item.imagenew} /> : null}
            <Text style={styles.tileText} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {newest.length ? (
        <>
          <SectionHeader title="New This Month" />
          <FlatList
            data={newest}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item._id || String(index)}
            contentContainerStyle={styles.rail}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.newCard}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.name || 'greeting'} card`}
                onPress={() =>
                  navigation.navigate('GreetingCardShare', { cardimage: item.path, catname: item.name, name: 'Share Greetings' })
                }>
                <Image source={{ uri: item.path }} style={styles.newImage} />
              </TouchableOpacity>
            )}
          />
        </>
      ) : null}

      <View style={styles.banner}>
        <WasilGreetingAdBannerSVG />
      </View>
    </ScrollView>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    firstHeader: { marginTop: Spacing.lg },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, paddingHorizontal: Spacing.lg },
    tile: {
      minHeight: 100,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      borderWidth: 1,
      borderColor: isLight ? 'transparent' : Colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    tileText: { fontSize: TypeScale.small, lineHeight: 16, textAlign: 'center', color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    rail: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    newCard: { width: 140, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    newImage: { width: 140, aspectRatio: 4 / 5, resizeMode: 'cover' },
    banner: { alignItems: 'center', marginTop: Spacing.xl },
  });
};
