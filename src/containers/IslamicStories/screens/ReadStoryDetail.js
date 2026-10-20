import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import RenderHTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH, useScreen } from '../../../theme';

const CHARS_PER_PAGE = 1700;
const FONT_SIZES = [15, 17, 19, 22];
const FONT_KEY = 'story_reader_font_size';
const stripTags = (html) => html.replace(/<\/?[^>]+(>|$)/g, '');

// Splits story HTML into pages of roughly CHARS_PER_PAGE visible characters, breaking on paragraphs.
const paginate = (html) => {
  if (!html) return ['<p>No story content available.</p>'];
  const paragraphs = html
    .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '')
    .trim()
    .split(/<\/p\s*>/i)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `${p}</p>`);

  const pages = [];
  let current = '';
  paragraphs.forEach((para) => {
    const len = stripTags(para).length;
    if (stripTags(current).length + len < CHARS_PER_PAGE) {
      current += para;
      return;
    }
    if (current) pages.push(current);
    current = '';
    if (len <= CHARS_PER_PAGE) {
      current = para;
      return;
    }
    // A single very long paragraph: cut at sentence or word boundaries.
    const text = stripTags(para);
    let start = 0;
    while (start < text.length) {
      let end = start + CHARS_PER_PAGE;
      if (end < text.length) {
        const safe = Math.max(text.lastIndexOf(' ', end), text.lastIndexOf('.', end));
        if (safe > start + 500) end = safe + 1;
      }
      pages.push(`<p>${text.slice(start, end).trim()}</p>`);
      start = end;
    }
  });
  if (current) pages.push(current);
  return pages.length ? pages : ['<p>No story content available.</p>'];
};

const ReadStoryDetail = ({ route }) => {
  const { story } = route.params || {};
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const pages = useMemo(() => paginate(story?.longdescription), [story]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(FONT_KEY)
      .then((v) => v !== null && setSizeIndex(Math.min(Math.max(Number(v) || 0, 0), FONT_SIZES.length - 1)))
      .catch(() => {});
  }, []);

  const changeSize = (delta) => {
    const next = Math.min(Math.max(sizeIndex + delta, 0), FONT_SIZES.length - 1);
    setSizeIndex(next);
    AsyncStorage.setItem(FONT_KEY, String(next)).catch(() => {});
  };

  const fontSize = FONT_SIZES[sizeIndex];
  const tagsStyles = useMemo(
    () => ({
      p: { marginTop: 0, marginBottom: Spacing.md },
      h1: { fontSize: fontSize + 8, color: Colors.heading, fontFamily: Fonts.heading },
      h2: { fontSize: fontSize + 4, color: Colors.heading, fontFamily: Fonts.heading },
      strong: { fontFamily: Fonts.bodyBold },
      blockquote: { borderLeftWidth: 3, borderLeftColor: Colors.gold, paddingLeft: Spacing.md, fontStyle: 'italic' },
    }),
    [fontSize, Colors],
  );

  const goTo = (index) => listRef.current?.scrollToIndex({ index, animated: true });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <Animated.FlatList
        ref={listRef}
        data={pages}
        keyExtractor={(_, idx) => String(idx)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        onMomentumScrollEnd={(e) => setCurrentPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        scrollEventThrottle={16}
        initialNumToRender={1}
        windowSize={3}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp' });
          return (
            <View style={{ width }}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
                <Animated.View style={[styles.page, { opacity }]}>
                  {index === 0 && story?.title ? <Text style={styles.storyTitle}>{story.title}</Text> : null}
                  <RenderHTML
                    contentWidth={width - Spacing.lg * 2 - Spacing.xl * 2}
                    source={{ html: item }}
                    baseStyle={{ fontSize, lineHeight: fontSize * 1.65, color: Colors.textPrimary, fontFamily: Fonts.body }}
                    tagsStyles={tagsStyles}
                    systemFonts={[Fonts.body, Fonts.bodyBold, Fonts.heading]}
                  />
                </Animated.View>
              </ScrollView>
            </View>
          );
        }}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          onPress={() => goTo(Math.max(currentPage - 1, 0))}
          disabled={currentPage === 0}
          style={[styles.footerButton, currentPage === 0 && styles.disabled]}
          accessibilityRole="button"
          accessibilityLabel="Previous page">
          <Text style={styles.footerGlyph}>‹</Text>
        </TouchableOpacity>

        <View style={styles.progressBlock}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((currentPage + 1) / pages.length) * 100}%` }]} />
          </View>
          <Text style={styles.pageText}>
            Page {currentPage + 1} of {pages.length}
          </Text>
        </View>

        <View style={styles.sizeGroup}>
          <TouchableOpacity onPress={() => changeSize(-1)} style={styles.footerButton} accessibilityLabel="Smaller text">
            <Text style={[styles.footerGlyph, { fontSize: 15 }]}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeSize(1)} style={styles.footerButton} accessibilityLabel="Larger text">
            <Text style={[styles.footerGlyph, { fontSize: 22 }]}>A</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => goTo(Math.min(currentPage + 1, pages.length - 1))}
          disabled={currentPage >= pages.length - 1}
          style={[styles.footerButton, currentPage >= pages.length - 1 && styles.disabled]}
          accessibilityRole="button"
          accessibilityLabel="Next page">
          <Text style={styles.footerGlyph}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReadStoryDetail;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    pageScroll: { padding: Spacing.lg },
    page: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xl,
      borderRadius: Radius.lg,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    storyTitle: { marginBottom: Spacing.lg, fontSize: TypeScale.title + 2, color: Colors.heading, fontFamily: Fonts.heading },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      paddingTop: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isLight ? '#E6E1F0' : 'rgba(255,255,255,0.15)',
    },
    footerButton: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
    footerGlyph: { fontSize: 28, color: Colors.textPrimary, fontFamily: Fonts.heading },
    disabled: { opacity: 0.3 },
    progressBlock: { flex: 1, gap: Spacing.xs },
    progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: isLight ? '#E6E1F0' : 'rgba(255,255,255,0.15)' },
    progressFill: { height: 4, backgroundColor: Colors.gold },
    pageText: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body },
    sizeGroup: { flexDirection: 'row', alignItems: 'baseline' },
  });
};
