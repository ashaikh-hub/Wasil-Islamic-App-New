import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchSVG } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { ScreenState } from '../../components';
import { fetchChapters } from './hadithApi';

const HadithBooksDetail = ({ navigation, route }) => {
  const { hadithbookname } = route.params;
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [chapters, setChapters] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setChapters(await fetchChapters(hadithbookname));
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, [hadithbookname]);

  useEffect(() => {
    load();
  }, [load]);

  const query = search.trim().toLowerCase();
  const visible = useMemo(
    () => (query ? chapters.filter((c) => c.chapterEnglish?.toLowerCase().includes(query) || String(c.chapterNumber) === query) : chapters),
    [chapters, query],
  );

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load chapters" onRetry={load} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={styles.searchBox}>
        <SearchSVG />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chapters"
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          accessibilityLabel="Search chapters"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Clear search">
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        ListEmptyComponent={<Text style={styles.noMatch}>No chapters match “{search}”</Text>}
        initialNumToRender={15}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.85}
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('HadithsDetail', {
                hadithchapternumber: item.chapterNumber,
                hadithchaptername: item.chapterEnglish,
                hadithbookname: item.bookSlug,
                name: item.chapterEnglish,
              })
            }>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.chapterNumber}</Text>
            </View>
            <Text style={styles.english} numberOfLines={2}>
              {item.chapterEnglish}
            </Text>
            {item.chapterArabic ? (
              <Text style={styles.arabic} numberOfLines={1}>
                {item.chapterArabic}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HadithBooksDetail;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      minHeight: 48,
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: isLight ? '#D9D9D9' : Colors.accent,
    },
    searchInput: { flex: 1, paddingVertical: Spacing.sm, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.body },
    clear: { fontSize: 16, color: Colors.textSecondary },
    list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, gap: Spacing.sm },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      minHeight: 64,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    badge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    english: { flex: 1, fontSize: TypeScale.body, lineHeight: 19, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    arabic: { maxWidth: '35%', fontSize: 18, color: Colors.textSecondary, fontFamily: Fonts.arabic, textAlign: 'right' },
    noMatch: { marginTop: Spacing.xxl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
