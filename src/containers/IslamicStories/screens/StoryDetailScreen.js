import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IslamicStoryPlayIconSVG, IslamicStoryReadIconSVG, IslamicStoryReadIconGSVG } from '../../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../../theme';
import { ScreenState } from '../../../components';
import StoryHero from '../StoryHero';
import { fetchStory } from '../storiesApi';

const StoryDetailScreen = ({ route, navigation }) => {
  const { storyid } = route.params;
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const ReadIcon = theme === 'green' ? IslamicStoryReadIconGSVG : IslamicStoryReadIconSVG;

  const [story, setStory] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const s = await fetchStory(storyid);
      setStory(s);
      setStatus(s ? 'ready' : 'empty');
    } catch (e) {
      setStatus('error');
    }
  }, [storyid]);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') {
    return <ScreenState status={status} title={status === 'empty' ? 'Story not found' : "Couldn't load this story"} onRetry={load} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <StoryHero story={story} />

      <View style={styles.content}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.reference}>Reference: {story.reference || 'Wasil Islamic'}</Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>{story.categoryname || 'Prophet Stories'}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Language</Text>
            <Text style={styles.metaValue}>{story.language || 'English'}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, styles.actionPrimary]}
            onPress={() => navigation.navigate('PlayStory', { storyid })}
            activeOpacity={0.85}
            accessibilityRole="button">
            <IslamicStoryPlayIconSVG />
            <Text style={[styles.actionText, styles.actionTextPrimary]}>Listen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.action}
            onPress={() => navigation.navigate('ReadStory', { story })}
            activeOpacity={0.85}
            accessibilityRole="button">
            <ReadIcon />
            <Text style={styles.actionText}>Read</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>About this story</Text>
        <Text style={styles.description}>{story.shortdescription || 'No description available.'}</Text>
      </View>
    </ScrollView>
  );
};

export default StoryDetailScreen;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingHorizontal: Spacing.lg },
    title: { textAlign: 'center', fontSize: TypeScale.title + 2, lineHeight: 28, color: Colors.heading, fontFamily: Fonts.heading },
    reference: { marginTop: Spacing.xs, textAlign: 'center', fontSize: TypeScale.small + 1, color: Colors.textSecondary, fontFamily: Fonts.body },
    meta: {
      flexDirection: 'row',
      marginTop: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: Radius.lg,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    metaItem: { flex: 1, alignItems: 'center', gap: 2 },
    metaDivider: { width: StyleSheet.hairlineWidth, backgroundColor: isLight ? '#D9D3E6' : 'rgba(255,255,255,0.25)' },
    metaLabel: { fontSize: TypeScale.caption, color: Colors.textSecondary, fontFamily: Fonts.body, textTransform: 'uppercase', letterSpacing: 1 },
    metaValue: { fontSize: TypeScale.body + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
    action: {
      flex: 1,
      flexDirection: 'row',
      gap: Spacing.sm,
      minHeight: 52,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionPrimary: { backgroundColor: Colors.button, borderColor: Colors.button },
    actionText: { fontSize: TypeScale.subtitle, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    actionTextPrimary: { color: Colors.onButton },
    sectionTitle: { marginTop: Spacing.xl, fontSize: TypeScale.subtitle + 1, color: Colors.heading, fontFamily: Fonts.heading },
    description: { marginTop: Spacing.sm, fontSize: TypeScale.body + 1, lineHeight: 23, color: Colors.textPrimary, fontFamily: Fonts.body },
  });
};
