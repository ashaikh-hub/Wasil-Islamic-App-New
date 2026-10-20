import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStorehadith from '../../hadithstore';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { ScreenState } from '../../components';
import HadithCard from './HadithCard';
import { fetchHadiths } from './hadithApi';

const HadithsDetail = ({ route }) => {
  const { hadithchapternumber, hadithbookname } = route.params;
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const { favouriteshadith } = useStorehadith();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [status, setStatus] = useState('loading');
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(
    async (next) => {
      const res = await fetchHadiths(hadithbookname, hadithchapternumber, next);
      setItems((prev) => (next === 1 ? res.items : [...prev, ...res.items]));
      setPage(res.page);
      setLastPage(res.lastPage);
      return res;
    },
    [hadithbookname, hadithchapternumber],
  );

  const loadFirst = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await loadPage(1);
      setStatus(res.items.length ? 'ready' : 'empty');
    } catch (e) {
      setStatus('error');
    }
  }, [loadPage]);

  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  const loadMore = async () => {
    if (loadingMore || page >= lastPage) return;
    setLoadingMore(true);
    try {
      await loadPage(page + 1);
    } catch (e) {
      // keep what we have; the user can scroll again to retry
    } finally {
      setLoadingMore(false);
    }
  };

  if (status !== 'ready') {
    return <ScreenState status={status} title={status === 'empty' ? 'No hadith in this chapter' : "Couldn't load hadith"} onRetry={loadFirst} />;
  }

  const chapter = items[0]?.chapter;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: Spacing.lg, paddingBottom: insets.bottom + Spacing.xl }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        initialNumToRender={4}
        ListHeaderComponent={
          chapter ? (
            <View style={styles.header}>
              <Text style={styles.headerLabel}>Chapter {chapter.chapterNumber}</Text>
              <Text style={styles.headerTitle}>{chapter.chapterEnglish}</Text>
              {chapter.chapterArabic ? <Text style={styles.headerArabic}>{chapter.chapterArabic}</Text> : null}
            </View>
          ) : null
        }
        ListFooterComponent={loadingMore ? <ActivityIndicator color={Colors.textPrimary} style={{ marginVertical: Spacing.lg }} /> : null}
        renderItem={({ item, index }) => <HadithCard hadith={item} index={index} favouriteshadith={favouriteshadith} />}
      />
    </View>
  );
};

export default HadithsDetail;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      backgroundColor: Colors.name === 'white' ? Colors.surface : Colors.surfaceAlt,
      borderWidth: 1,
      borderColor: Colors.gold,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    headerLabel: { fontSize: TypeScale.caption, color: Colors.gold, fontFamily: Fonts.bodyBold, letterSpacing: 1, textTransform: 'uppercase' },
    headerTitle: { fontSize: TypeScale.subtitle + 1, color: Colors.white, fontFamily: Fonts.heading, textAlign: 'center' },
    headerArabic: { fontSize: 20, lineHeight: 32, color: Colors.white, fontFamily: Fonts.arabic, textAlign: 'center' },
  });
