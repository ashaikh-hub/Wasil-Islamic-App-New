import React, { useMemo } from 'react';
import { StatusBar, StyleSheet, View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStorehadith from '../../hadithstore';
import { FavouriteEmptySVG } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing } from '../../theme';
import HadithCard from './HadithCard';

const HadithsFavourites = () => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const { favouriteshadith } = useStorehadith();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        data={favouriteshadith}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          { gap: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: insets.bottom + Spacing.xl },
          favouriteshadith.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FavouriteEmptySVG />
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptyText}>Tap the heart on any hadith to save it here.</Text>
          </View>
        }
        renderItem={({ item, index }) => <HadithCard hadith={item} favouriteshadith={favouriteshadith} index={index} />}
      />
    </View>
  );
};

export default HadithsFavourites;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    emptyContainer: { flexGrow: 1, justifyContent: 'center' },
    empty: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.xl },
    emptyTitle: { marginTop: Spacing.md, fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading },
    emptyText: { fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body, textAlign: 'center' },
  });
