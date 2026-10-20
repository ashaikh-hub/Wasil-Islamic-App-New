import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../../theme';
import { ScreenState, SectionHeader } from '../../../components';
import StoryCard from '../StoryCard';
import { fetchAllStories, fetchCategories, isFlag, storyIdOf } from '../storiesApi';

const RAILS = [
  { key: 'free', title: 'Picks For You', flag: 'isfree', filter: 'free' },
  { key: 'top', title: 'Top Choices', flag: 'topchoice', filter: 'popular' },
  { key: 'new', title: 'New Arrivals', flag: 'newarrival', filter: 'latest' },
];

const IslamicStoriesScreen = ({ navigation }) => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [all, cats] = await Promise.all([fetchAllStories(), fetchCategories().catch(() => [])]);
      setStories(all);
      setCategories(cats);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load stories" onRetry={load} />;

  const open = (story) => navigation.navigate('StoryDetailScreen', { storyid: storyIdOf(story), storytitle: story.title });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
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

      <SectionHeader title="Categories" actionLabel="Browse all" onAction={() => navigation.navigate('AllSubCategories')} />
      <View style={styles.chips}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c._id}
            style={styles.chip}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SubCategories', { categoryId: c._id, name: c.categoryname })}
            accessibilityRole="button">
            <Text style={styles.chipText}>{c.categoryname}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {RAILS.map((rail) => {
        const items = stories.filter((s) => isFlag(s[rail.flag]));
        if (!items.length) return null;
        return (
          <View key={rail.key}>
            <SectionHeader title={rail.title} actionLabel="See all" onAction={() => navigation.navigate('AllSubCategories', { filter: rail.filter })} />
            <FlatList
              data={items}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => String(storyIdOf(item) || index)}
              contentContainerStyle={styles.rail}
              renderItem={({ item }) => <StoryCard story={item} width={132} onPress={() => open(item)} />}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default IslamicStoriesScreen;

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
  });
};
