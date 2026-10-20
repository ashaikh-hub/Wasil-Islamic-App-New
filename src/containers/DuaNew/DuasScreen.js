import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, StatusBar } from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DuaCategoryCard from './DuaCategoryCard';
import { useTheme, Spacing } from '../../theme';
import { ScreenState } from '../../components';

const DuasScreen = ({ navigation }) => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await axios.get('https://islamicapp.vercel.app/api/duacategories');
      setCategories(Array.isArray(response.data) ? response.data : []);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load duas" onRetry={load} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        data={categories}
        keyExtractor={(item, index) => item._id || String(index)}
        numColumns={2}
        columnWrapperStyle={{ gap: Spacing.md }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        renderItem={({ item }) => (
          <DuaCategoryCard
            item={item}
            onPress={(c) => navigation.navigate('DuaCategoryDetail', { duacategoryid: c._id, duacategorytitle: c.title, name: c.title })}
          />
        )}
      />
    </View>
  );
};

export default DuasScreen;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.lg, gap: Spacing.md },
  });
