import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HadithBookCard from './HadithBookCard';
import { fetchHadithBooks } from './hadithApi';
import { BOOK_IMAGES } from './HadithbookImages';
import { BOOK_DESCRIPTION } from './HadithBookDescription';
import { useTheme, Spacing } from '../../theme';
import { ScreenState } from '../../components';

const HadithBooksScreen = () => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setBooks(await fetchHadithBooks());
      setStatus('ready');
    } catch (error) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load hadith books" onRetry={load} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        renderItem={({ item }) => (
          <HadithBookCard
            title={item.bookName}
            name={item.bookName}
            hadithbookname={item.bookSlug}
            description={BOOK_DESCRIPTION[item.bookSlug]}
            image={BOOK_IMAGES[item.bookSlug]}
          />
        )}
      />
    </View>
  );
};

export default HadithBooksScreen;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.lg, gap: Spacing.md },
  });
