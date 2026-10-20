import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';

// Book-style story cover (3:4) with its title underneath.
export default function StoryCard({ story, width, onPress, badge }) {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity style={{ width }} activeOpacity={0.85} onPress={onPress} accessibilityRole="button" accessibilityLabel={story.title}>
      <View style={styles.cover}>
        {story.path ? <Image source={{ uri: story.path }} style={styles.image} /> : null}
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {story.title}
      </Text>
    </TouchableOpacity>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    cover: {
      width: '100%',
      aspectRatio: 3 / 4,
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: Colors.name === 'white' ? Colors.surfaceAlt : Colors.surface,
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    badge: {
      position: 'absolute',
      top: Spacing.sm,
      left: Spacing.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: Radius.pill,
      backgroundColor: Colors.gold,
    },
    badgeText: { fontSize: TypeScale.caption, color: '#1F1A2E', fontFamily: Fonts.bodyBold },
    title: { marginTop: Spacing.sm, fontSize: TypeScale.body, lineHeight: 19, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
  });
