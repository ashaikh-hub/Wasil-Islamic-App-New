import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SearchSVG } from '../../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../../theme';
import { ScreenState } from '../../../components';
import StoryGrid from './StoryGrid';
import { fetchStoryLibrary, fetchCategories, isFlag, storyIdOf } from '../storiesApi';

const TYPE_FILTERS = [
  { key: null, label: 'All' },
  { key: 'free', label: 'Free', flag: 'isfree' },
  { key: 'popular', label: 'Popular', flag: 'topchoice' },
  { key: 'latest', label: 'Latest', flag: 'newarrival' },
];

const Chip = ({ label, active, onPress, styles }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const AllSubCategories = ({ navigation, route }) => {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [type, setType] = useState(route?.params?.filter ?? null);
  const [category, setCategory] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [library, cats] = await Promise.all([fetchStoryLibrary(), fetchCategories().catch(() => [])]);
      setStories(library);
      setCategories(cats);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const flag = TYPE_FILTERS.find((t) => t.key === type)?.flag;
    return stories.filter(
      (s) => (!category || s.categoryId === category) && (!flag || isFlag(s[flag])) && (!q || s.title?.toLowerCase().includes(q)),
    );
  }, [stories, search, type, category]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load stories" onRetry={load} />;

  const header = (
    <View style={styles.header}>
      <View style={styles.searchBox}>
        <SearchSVG />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stories"
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          accessibilityLabel="Search stories"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Clear search">
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {TYPE_FILTERS.map((t) => (
          <Chip key={t.label} label={t.label} active={type === t.key} onPress={() => setType(t.key)} styles={styles} />
        ))}
      </ScrollView>
      {categories.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <Chip label="All categories" active={!category} onPress={() => setCategory(null)} styles={styles} />
          {categories.map((c) => (
            <Chip key={c._id} label={c.categoryname} active={category === c._id} onPress={() => setCategory(c._id)} styles={styles} />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <StoryGrid
        stories={visible}
        ListHeaderComponent={header}
        emptyText="No stories match these filters"
        onOpen={(s) => navigation.navigate('StoryDetailScreen', { storyid: storyIdOf(s), storytitle: s.title })}
      />
    </View>
  );
};

export default AllSubCategories;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { gap: Spacing.md, marginHorizontal: -Spacing.lg, paddingBottom: Spacing.xs },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      minHeight: 48,
      marginHorizontal: Spacing.lg,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: isLight ? '#D9D9D9' : Colors.accent,
    },
    searchInput: { flex: 1, paddingVertical: Spacing.sm, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.body },
    clear: { fontSize: 16, color: Colors.textSecondary },
    chipRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
    chip: {
      minHeight: 36,
      paddingHorizontal: Spacing.md + 2,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
      justifyContent: 'center',
    },
    chipActive: { backgroundColor: Colors.button, borderColor: Colors.button },
    chipText: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    chipTextActive: { color: Colors.onButton },
  });
};
