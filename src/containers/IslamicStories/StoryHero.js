import React from 'react';
import { Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, Spacing, Radius } from '../../theme';

const FALLBACK = require('../../images/musa.png');

// Story cover centred on a gradient that fades into the screen background.
export default function StoryHero({ story, coverWidth = 180 }) {
  const { Colors } = useTheme();
  return (
    <LinearGradient colors={[Colors.surface, Colors.background]} style={styles.hero}>
      <Image
        source={story?.path ? { uri: story.path } : FALLBACK}
        style={[styles.cover, { width: coverWidth, height: coverWidth * (4 / 3) }]}
        accessibilityIgnoresInvertColors
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: Spacing.xl, paddingBottom: Spacing.lg },
  cover: {
    borderRadius: Radius.lg,
    resizeMode: 'cover',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
