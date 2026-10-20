import React, { useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FavouriteEmptySVG } from '../../assets/icons';
import useStore from '../../store';
import { useTheme, Fonts, TypeScale, Spacing } from '../../theme';
import DuaCard from './DuaCard';

const DuaNewFavourites = () => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const favourites = useStore((state) => state.favourites) || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        data={favourites}
        keyExtractor={(item, index) => item._id?.toString() || String(index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          favourites.length === 0 && styles.listEmpty,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FavouriteEmptySVG />
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptyText}>Tap the heart on any dua to save it here.</Text>
          </View>
        }
        renderItem={({ item }) => <DuaCard dua={item} />}
      />
    </View>
  );
};

export default DuaNewFavourites;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.lg, gap: Spacing.lg },
    listEmpty: { flexGrow: 1, justifyContent: 'center' },
    empty: { alignItems: 'center', gap: Spacing.sm },
    emptyTitle: { marginTop: Spacing.md, fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading },
    emptyText: { fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body, textAlign: 'center' },
  });
