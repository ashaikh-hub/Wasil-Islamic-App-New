import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';

// A video thumbnail with its title. `variant`: 'rail' (fixed width), 'grid' (fills its column), 'row' (list row).
export default function VideoCard({ video, onPress, variant = 'rail', width }) {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const thumb = (
    <View style={[styles.thumbWrap, variant === 'row' && styles.thumbRow]}>
      <Image source={{ uri: video.thumbnail }} style={styles.thumb} />
      <View style={styles.playBadge}>
        <Text style={styles.playGlyph}>▶</Text>
      </View>
    </View>
  );

  if (variant === 'row') {
    return (
      <TouchableOpacity style={styles.row} activeOpacity={0.85} onPress={onPress} accessibilityRole="button" accessibilityLabel={video.videoTitle}>
        {thumb}
        <View style={styles.rowBody}>
          <Text style={styles.title} numberOfLines={2}>
            {video.videoTitle}
          </Text>
          {video.summary ? (
            <Text style={styles.summary} numberOfLines={2}>
              {video.summary}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={{ width }} activeOpacity={0.85} onPress={onPress} accessibilityRole="button" accessibilityLabel={video.videoTitle}>
      {thumb}
      <Text style={[styles.title, styles.titleBelow]} numberOfLines={2}>
        {video.videoTitle}
      </Text>
    </TouchableOpacity>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    thumbWrap: { width: '100%', aspectRatio: 16 / 9, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    thumbRow: { width: 136 },
    thumb: { width: '100%', height: '100%', resizeMode: 'cover' },
    playBadge: {
      position: 'absolute',
      right: Spacing.sm,
      bottom: Spacing.sm,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playGlyph: { color: '#FFFFFF', fontSize: 11, marginLeft: 2 },
    row: {
      flexDirection: 'row',
      gap: Spacing.md,
      padding: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    rowBody: { flex: 1, justifyContent: 'center' },
    title: { fontSize: TypeScale.body, lineHeight: 19, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    titleBelow: { marginTop: Spacing.sm },
    summary: { marginTop: Spacing.xs, fontSize: TypeScale.small, lineHeight: 16, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
