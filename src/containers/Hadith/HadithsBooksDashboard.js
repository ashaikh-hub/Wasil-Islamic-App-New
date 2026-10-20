import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { ScreenState, SectionHeader } from '../../components';
import { fetchHadithBooks, fetchChapters, shortChapterTitle } from './hadithApi';
import { hadithImages, defaultChapterImage } from './hadithImages';

const FEATURED = [
  { slug: 'sahih-bukhari', title: 'Sahih al-Bukhari' },
  { slug: 'sunan-nasai', title: "Sunan an-Nasa'i" },
];
const RAIL_SIZE = 6;

const HadithsBooksDashboard = ({ navigation }) => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [books, setBooks] = useState([]);
  const [rails, setRails] = useState({});
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [bookList, ...chapterLists] = await Promise.all([
        fetchHadithBooks(),
        ...FEATURED.map((f) => fetchChapters(f.slug).catch(() => [])),
      ]);
      setBooks(bookList);
      setRails(Object.fromEntries(FEATURED.map((f, i) => [f.slug, chapterLists[i].slice(0, RAIL_SIZE)])));
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load hadith books" onRetry={load} />;

  const openBook = (book) => navigation.navigate('HadithBooksDetail', { hadithbookname: book.bookSlug, name: book.bookName });
  const openChapter = (chapter) =>
    navigation.navigate('HadithsDetail', {
      hadithchapternumber: chapter.chapterNumber,
      hadithchaptername: chapter.chapterEnglish,
      hadithbookname: chapter.bookSlug,
      name: chapter.chapterEnglish,
    });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={Colors.textPrimary}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />

      <SectionHeader title="Books" actionLabel="See all" onAction={() => navigation.navigate('HadithBooksScreen')} />
      <View style={styles.chips}>
        {books.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={styles.chip}
            activeOpacity={0.8}
            onPress={() => openBook(book)}
            accessibilityRole="button">
            <Text style={styles.chipText} numberOfLines={1}>
              {book.bookName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {FEATURED.map((f) =>
        rails[f.slug]?.length ? (
          <View key={f.slug}>
            <SectionHeader
              title={f.title}
              actionLabel="All chapters"
              onAction={() => navigation.navigate('HadithBooksDetail', { hadithbookname: f.slug, name: f.title })}
            />
            <FlatList
              data={rails[f.slug]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.rail}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => openChapter(item)} accessibilityRole="button">
                  <Image source={hadithImages[item.id] || defaultChapterImage} style={styles.cardImage} />
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {shortChapterTitle(item.chapterEnglish)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null,
      )}
    </ScrollView>
  );
};

export default HadithsBooksDashboard;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
    chip: {
      minHeight: 40,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
      backgroundColor: isLight ? Colors.surfaceAlt : 'transparent',
      justifyContent: 'center',
    },
    chipText: { fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    rail: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    card: { width: 150 },
    cardImage: { width: 150, aspectRatio: 0.85, borderRadius: Radius.md, resizeMode: 'cover', backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    cardTitle: { marginTop: Spacing.sm, fontSize: TypeScale.body, lineHeight: 19, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
  });
};
