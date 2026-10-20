import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, ImageBackground, StyleSheet } from 'react-native';
import axios from 'axios';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import { SectionHeader } from '../../components';
import { HOME_ART } from './homeAssets';

const AUTO_ADVANCE_MS = 5000;

// Auto-advancing "Did you know?" facts. Hidden entirely when the feed fails or is empty.
export default function DidYouKnow() {
  const { Colors, theme } = useTheme();
  const { width } = useScreen();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const art = HOME_ART[theme] || HOME_ART.white;
  const [facts, setFacts] = useState([]);
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const cardWidth = width - Spacing.lg * 2;

  useEffect(() => {
    let alive = true;
    axios
      .get('https://islamicapp.vercel.app/api/didyouknow')
      .then(({ data }) => alive && setFacts((Array.isArray(data) ? data : []).filter((f) => f?.content)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (facts.length < 2) return undefined;
    const id = setTimeout(() => {
      const next = (index + 1) % facts.length;
      listRef.current?.scrollToOffset({ offset: next * (cardWidth + Spacing.md), animated: true });
      setIndex(next);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [index, facts.length, cardWidth]);

  if (!facts.length) return null;

  return (
    <View>
      <SectionHeader title="Did you know?" />
      <FlatList
        ref={listRef}
        data={facts}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + Spacing.md}
        decelerationRate="fast"
        contentContainerStyle={s.rail}
        keyExtractor={(item, i) => String(item._id || i)}
        getItemLayout={(_, i) => ({ length: cardWidth + Spacing.md, offset: (cardWidth + Spacing.md) * i, index: i })}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / (cardWidth + Spacing.md)))}
        renderItem={({ item }) => (
          <ImageBackground source={art.didYouKnowBg} style={[s.card, { width: cardWidth }]} imageStyle={s.cardImage}>
            <View style={s.iconRow}>
              <art.DidYouKnowIcon />
            </View>
            <Text style={s.fact}>{item.content}</Text>
          </ImageBackground>
        )}
      />
      {facts.length > 1 ? (
        <View style={s.dots}>
          {facts.map((f, i) => (
            <View key={String(f._id || i)} style={[s.dot, i === index && s.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    rail: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    card: {
      minHeight: 140,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      overflow: 'hidden',
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.cardBorder,
    },
    cardImage: { borderRadius: Radius.lg, opacity: isLight ? 0.35 : 0.5 },
    iconRow: { marginBottom: Spacing.sm },
    fact: { fontSize: TypeScale.body + 1, lineHeight: 22, color: Colors.textPrimary, fontFamily: Fonts.body },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Spacing.md },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textSecondary, opacity: 0.4 },
    dotActive: { width: 18, backgroundColor: Colors.accent, opacity: 1 },
  });
};
