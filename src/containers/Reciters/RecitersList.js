import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchSVG } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import reciters from './newreciters';
import ReciterAvatar from './ReciterAvatar';

const RecitersList = ({ navigation }) => {
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const visible = useMemo(() => (query ? reciters.filter((r) => r.name.toLowerCase().includes(query)) : reciters), [query]);

  const columns = width >= 600 ? 3 : 2;
  const cardWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        key={columns}
        data={visible}
        keyExtractor={(item) => String(item.id)}
        numColumns={columns}
        columnWrapperStyle={{ gap: Spacing.md }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.searchBox}>
            <SearchSVG />
            <TextInput
              placeholder="Search reciter"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              placeholderTextColor={Colors.textSecondary}
              returnKeyType="search"
              accessibilityLabel="Search reciter"
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Clear search">
                <Text style={styles.clear}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
        ListEmptyComponent={<Text style={styles.noMatch}>No reciter matches “{search}”</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.style?.name}`}
            onPress={() => navigation.navigate('ReciterDetail', { name: item.name, reciterId: item.id, reciterName: item.name })}>
            <ReciterAvatar reciter={item} size={Math.min(96, cardWidth - Spacing.xl * 2)} />
            <Text numberOfLines={2} style={styles.name}>
              {item.name.replace(/`/g, "'")}
            </Text>
            {item.style?.name ? (
              <View style={styles.styleTag}>
                <Text style={styles.styleText}>{item.style.name}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RecitersList;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      minHeight: 48,
      marginTop: Spacing.lg,
      marginBottom: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: isLight ? '#D9D9D9' : Colors.accent,
    },
    searchInput: { flex: 1, paddingVertical: Spacing.sm, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.body },
    clear: { fontSize: 16, color: Colors.textSecondary },
    card: {
      alignItems: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.lg,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    name: { textAlign: 'center', fontSize: TypeScale.body, lineHeight: 19, color: Colors.textPrimary, fontFamily: Fonts.heading },
    styleTag: { paddingHorizontal: Spacing.sm + 2, paddingVertical: 2, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.gold },
    styleText: { fontSize: TypeScale.caption, color: Colors.gold, fontFamily: Fonts.bodySemiBold },
    noMatch: { marginTop: Spacing.xxl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
