import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, useScreen } from '../../../theme';
import StoryCard from '../StoryCard';
import { isFlag, storyIdOf } from '../storiesApi';

// Responsive grid of story covers. Extra props are passed to FlatList.
export default function StoryGrid({ stories, onOpen, emptyText = 'No stories found', ...listProps }) {
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const columns = width >= 600 ? 4 : width >= 400 ? 3 : 2;
  const itemWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <FlatList
      key={columns}
      data={stories}
      numColumns={columns}
      keyExtractor={(item, index) => String(storyIdOf(item) || index)}
      columnWrapperStyle={{ gap: Spacing.md }}
      contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
      renderItem={({ item }) => (
        <StoryCard story={item} width={itemWidth} badge={isFlag(item.isfree) ? 'FREE' : null} onPress={() => onOpen(item)} />
      )}
      {...listProps}
    />
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.lg },
    empty: { marginTop: Spacing.xxl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
