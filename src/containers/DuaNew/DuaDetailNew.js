import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, StatusBar } from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DuaCard from './DuaCard';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import { ScreenState } from '../../components';

const CARD_SPACING = 12;

const DuaDetailNew = ({ route }) => {
  const { duacategoryid, startIndex = 0, duaName } = route.params;
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const cardWidth = Math.min(width * 0.88, 520);
  const snap = cardWidth + CARD_SPACING;
  const sidePadding = (width - cardWidth) / 2 - CARD_SPACING / 2;

  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [duas, setDuas] = useState([]);
  const [status, setStatus] = useState('loading');
  const [current, setCurrent] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await axios.get(`https://islamicapp.vercel.app/api/duaversebycategory?duacategoryId=${duacategoryid}`);
      const list = Array.isArray(res.data) ? res.data : [];
      setDuas(list);
      setStatus(list.length ? 'ready' : 'empty');
    } catch (e) {
      setStatus('error');
    }
  }, [duacategoryid]);

  useEffect(() => {
    load();
  }, [load]);

  // Open on the dua that was tapped in the list.
  const initialIndex = useMemo(() => {
    const byName = duaName ? duas.findIndex((d) => d.duanameenglish === duaName) : -1;
    if (byName >= 0) return byName;
    return Math.min(Math.max(startIndex, 0), Math.max(duas.length - 1, 0));
  }, [duas, duaName, startIndex]);

  useEffect(() => {
    if (status === 'ready') setCurrent(initialIndex);
  }, [status, initialIndex]);

  if (status !== 'ready') {
    return <ScreenState status={status} title={status === 'empty' ? 'No duas in this category yet' : "Couldn't load duas"} onRetry={load} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={styles.pager} onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}>
        {pageHeight ? (
          <Animated.FlatList
            ref={listRef}
            data={duas}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snap}
            decelerationRate="fast"
            disableIntervalMomentum
            keyExtractor={(item, index) => item._id || String(index)}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({ length: snap, offset: snap * index, index })}
            contentContainerStyle={{ paddingHorizontal: sidePadding, alignItems: 'center' }}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
            onMomentumScrollEnd={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / snap))}
            renderItem={({ item, index }) => (
              <DuaCard
                dua={item}
                index={index}
                scrollX={scrollX}
                width={cardWidth}
                height={pageHeight - Spacing.xl * 2}
                spacing={CARD_SPACING}
              />
            )}
          />
        ) : null}
      </View>

      <View style={[styles.pagination, { marginBottom: insets.bottom + Spacing.md }]} accessibilityLabel={`Dua ${current + 1} of ${duas.length}`}>
        <Text style={styles.paginationText}>
          {current + 1} / {duas.length}
        </Text>
      </View>
    </View>
  );
};

export default DuaDetailNew;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    pager: { flex: 1 },
    pagination: {
      alignSelf: 'center',
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xs + 2,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
    },
    paginationText: { fontSize: TypeScale.body, color: Colors.onButton, fontFamily: Fonts.bodyBold },
  });
