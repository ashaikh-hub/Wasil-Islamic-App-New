import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Spacing, Radius, useScreen } from '../../theme';
import { ScreenState } from '../../components';

const GreetingCardListNew = ({ route, navigation }) => {
  const { cardid, categoryname } = route.params;
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await axios.get(`https://islamicapp.vercel.app/api/greetings?categoryId=${cardid}`);
      setCards(Array.isArray(response.data) ? response.data : []);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, [cardid]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (status !== 'ready' || cards.length === 0) {
    return (
      <ScreenState
        status={status === 'ready' ? 'empty' : status}
        title={status === 'ready' ? 'No cards in this category yet' : "Couldn't load cards"}
        onRetry={() => {
          setStatus('loading');
          load();
        }}
      />
    );
  }

  const columns = width >= 600 ? 3 : 2;
  const cardWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        key={columns}
        data={cards}
        numColumns={columns}
        keyExtractor={(item, index) => item._id || String(index)}
        columnWrapperStyle={{ gap: Spacing.md }}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.textPrimary} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Open ${categoryname} card`}
            onPress={() =>
              navigation.navigate('GreetingCardShare', { cardimage: item.path, catname: categoryname, name: categoryname })
            }>
            <Image style={styles.image} source={{ uri: item.path }} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GreetingCardListNew;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.lg, gap: Spacing.md },
    card: {
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: Colors.name === 'white' ? Colors.surfaceAlt : Colors.surface,
    },
    image: { width: '100%', aspectRatio: 4 / 5, resizeMode: 'cover' },
  });
