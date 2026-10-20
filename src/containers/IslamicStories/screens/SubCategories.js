import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../../../theme';
import { ScreenState } from '../../../components';
import StoryGrid from './StoryGrid';
import { fetchStoriesByCategory, storyIdOf } from '../storiesApi';

const SubCategories = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const { Colors } = useTheme();
  const styles = useMemo(() => StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.background } }), [Colors]);
  const [stories, setStories] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setStories(await fetchStoriesByCategory(categoryId));
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load stories" onRetry={load} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <StoryGrid
        stories={stories}
        emptyText="No stories in this category yet"
        onOpen={(s) => navigation.navigate('StoryDetailScreen', { storyid: storyIdOf(s), storytitle: s.title })}
      />
    </View>
  );
};

export default SubCategories;
