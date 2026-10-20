import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, TouchableOpacity, StatusBar } from 'react-native';
import TrackPlayer, { useProgress, State, useTrackPlayerEvents, Event } from 'react-native-track-player';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IslamicStoryPlayPreviousBTSVG,
  IslamicStoryPlayRewindBTSVG,
  IslamicStoryPlayForwardBTSVG,
  IslamicStoryPlayNextBTSVG,
  IslamicStoryPlayPreviousSVG,
  IslamicStoryPlayRewindSVG,
  IslamicStoryPlayForwardSVG,
  IslamicStoryPlayNextSVG,
  IslamicStoryPlayAudioSVG,
  IslamicStoryPauseAudioSVG,
  IslamicStoryGPlayAudioSVG,
  IslamicStoryGPauseAudioSVG,
} from '../../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../../theme';
import { ScreenState } from '../../../components';
import StoryHero from '../StoryHero';
import { fetchStory, fetchStoryAudios } from '../storiesApi';

const SPEEDS = [1, 1.25, 1.5, 2];

const ICONS = {
  blue: { Prev: IslamicStoryPlayPreviousBTSVG, Rewind: IslamicStoryPlayRewindBTSVG, Forward: IslamicStoryPlayForwardBTSVG, Next: IslamicStoryPlayNextBTSVG, Play: IslamicStoryPlayAudioSVG, Pause: IslamicStoryPauseAudioSVG },
  green: { Prev: IslamicStoryPlayPreviousBTSVG, Rewind: IslamicStoryPlayRewindBTSVG, Forward: IslamicStoryPlayForwardBTSVG, Next: IslamicStoryPlayNextBTSVG, Play: IslamicStoryGPlayAudioSVG, Pause: IslamicStoryGPauseAudioSVG },
  white: { Prev: IslamicStoryPlayPreviousSVG, Rewind: IslamicStoryPlayRewindSVG, Forward: IslamicStoryPlayForwardSVG, Next: IslamicStoryPlayNextSVG, Play: IslamicStoryPlayAudioSVG, Pause: IslamicStoryPauseAudioSVG },
};

const formatTime = (sec) => {
  if (!sec || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const PlayStory = ({ route }) => {
  const { storyid } = route.params;
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const { Prev, Rewind, Forward, Next, Play, Pause } = ICONS[theme] || ICONS.white;

  const [story, setStory] = useState(null);
  const [audios, setAudios] = useState([]);
  const [status, setStatus] = useState('loading');
  const [queueReady, setQueueReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const { position, duration } = useProgress(500);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [s, a] = await Promise.all([fetchStory(storyid), fetchStoryAudios(storyid)]);
      setStory(s);
      setAudios(Array.isArray(a) ? a.filter((x) => x.audiourl) : []);
      setStatus(s ? 'ready' : 'empty');
    } catch (e) {
      setStatus('error');
    }
  }, [storyid]);

  useEffect(() => {
    load();
  }, [load]);

  // Build this story's queue once its audio list is known. The player itself is set up at app start.
  useEffect(() => {
    if (status !== 'ready' || !audios.length) return;
    let cancelled = false;
    (async () => {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.add(
          audios.map((a, i) => ({
            id: String(a._id ?? i),
            url: a.audiourl,
            title: a.title || story?.title || `Part ${i + 1}`,
            artist: story?.reference || 'Islamic Story',
            artwork: story?.path || undefined,
            type: 'story',
          })),
        );
        await TrackPlayer.setRate(SPEEDS[speedIndex]).catch(() => {});
        if (!cancelled) setQueueReady(true);
      } catch (e) {
        if (!cancelled) setQueueReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // speedIndex is applied on change separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, audios, story]);

  // Stories stop when the user leaves the player.
  useFocusEffect(
    useCallback(
      () => () => {
        TrackPlayer.stop().catch(() => {});
      },
      [],
    ),
  );

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackActiveTrackChanged, Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackState) setIsPlaying(event.state === State.Playing);
    if (event.type === Event.PlaybackActiveTrackChanged && typeof event.index === 'number') setActiveIndex(event.index);
    if (event.type === Event.PlaybackQueueEnded) {
      await TrackPlayer.skip(0).catch(() => {});
      await TrackPlayer.pause().catch(() => {});
    }
  });

  const togglePlay = async () => {
    if (!queueReady) return;
    const state = await TrackPlayer.getState();
    if (state === State.Playing) await TrackPlayer.pause();
    else await TrackPlayer.play();
  };

  const seekBy = async (delta) => {
    const pos = await TrackPlayer.getPosition();
    const dur = await TrackPlayer.getDuration();
    await TrackPlayer.seekTo(Math.min(Math.max(0, pos + delta), dur || pos + delta));
  };

  const cycleSpeed = async () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    await TrackPlayer.setRate(SPEEDS[next]).catch(() => {});
  };

  const playPart = async (index) => {
    await TrackPlayer.skip(index).catch(() => {});
    await TrackPlayer.play().catch(() => {});
  };

  if (status !== 'ready') {
    return <ScreenState status={status} title={status === 'empty' ? 'Story not found' : "Couldn't load this story"} onRetry={load} />;
  }

  const progress = duration ? Math.min(position / duration, 1) : 0;
  const hasAudio = audios.length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <StoryHero story={story} coverWidth={200} />

      <View style={styles.content}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.subtitle}>
          {audios.length > 1 ? `Part ${activeIndex + 1} of ${audios.length}` : story.reference || 'Wasil Islamic'}
        </Text>

        {hasAudio ? (
          <View style={styles.player}>
            <Pressable
              style={styles.progressHit}
              onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
              onPress={(e) => duration && barWidth && TrackPlayer.seekTo((e.nativeEvent.locationX / barWidth) * duration)}
              accessibilityRole="adjustable"
              accessibilityLabel="Playback position">
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <View style={[styles.progressThumb, { left: Math.max(0, progress * barWidth - 8) }]} />
            </Pressable>
            <View style={styles.timeRow}>
              <Text style={styles.time}>{formatTime(position)}</Text>
              <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.controls}>
              <Pressable onPress={() => TrackPlayer.skipToPrevious().catch(() => {})} style={styles.control} accessibilityLabel="Previous part">
                <Prev />
              </Pressable>
              <Pressable onPress={() => seekBy(-10)} style={styles.control} accessibilityLabel="Back 10 seconds">
                <Rewind />
              </Pressable>
              <Pressable onPress={togglePlay} disabled={!queueReady} style={styles.control} accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
                {!queueReady ? <ActivityIndicator color={Colors.textPrimary} /> : isPlaying ? <Pause /> : <Play />}
              </Pressable>
              <Pressable onPress={() => seekBy(10)} style={styles.control} accessibilityLabel="Forward 10 seconds">
                <Forward />
              </Pressable>
              <Pressable onPress={() => TrackPlayer.skipToNext().catch(() => {})} style={styles.control} accessibilityLabel="Next part">
                <Next />
              </Pressable>
            </View>

            <TouchableOpacity style={styles.speed} onPress={cycleSpeed} accessibilityRole="button" accessibilityLabel="Playback speed">
              <Text style={styles.speedText}>{SPEEDS[speedIndex]}×</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noAudio}>Audio for this story isn't available yet.</Text>
        )}

        {audios.length > 1 ? (
          <View style={styles.parts}>
            <Text style={styles.partsTitle}>Parts</Text>
            {audios.map((a, i) => {
              const active = i === activeIndex;
              return (
                <TouchableOpacity
                  key={a._id ?? i}
                  style={[styles.part, active && styles.partActive]}
                  onPress={() => playPart(i)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}>
                  <Text style={[styles.partNumber, active && styles.partNumberActive]}>{i + 1}</Text>
                  <Text style={styles.partTitle} numberOfLines={1}>
                    {a.title || `Part ${i + 1}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default PlayStory;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  const tile = isLight ? Colors.surfaceAlt : Colors.surface;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingHorizontal: Spacing.lg },
    title: { textAlign: 'center', fontSize: TypeScale.title + 2, lineHeight: 28, color: Colors.heading, fontFamily: Fonts.heading },
    subtitle: { marginTop: Spacing.xs, textAlign: 'center', fontSize: TypeScale.small + 1, color: Colors.textSecondary, fontFamily: Fonts.body },
    player: { marginTop: Spacing.xl, padding: Spacing.lg, borderRadius: Radius.lg, backgroundColor: tile },
    progressHit: { paddingVertical: Spacing.sm, justifyContent: 'center' },
    progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: isLight ? '#DCD5EA' : 'rgba(255,255,255,0.2)' },
    progressFill: { height: 4, backgroundColor: Colors.gold },
    progressThumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.gold },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    time: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body, fontVariant: ['tabular-nums'] },
    controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
    control: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
    speed: {
      alignSelf: 'center',
      marginTop: Spacing.md,
      minHeight: 32,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
      justifyContent: 'center',
    },
    speedText: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    noAudio: { marginTop: Spacing.xl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
    parts: { marginTop: Spacing.xl, gap: Spacing.sm },
    partsTitle: { fontSize: TypeScale.subtitle + 1, color: Colors.heading, fontFamily: Fonts.heading, marginBottom: Spacing.xs },
    part: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      minHeight: 52,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      backgroundColor: tile,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    partActive: { borderColor: Colors.gold },
    partNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      textAlign: 'center',
      lineHeight: 28,
      overflow: 'hidden',
      fontSize: TypeScale.small,
      color: Colors.textPrimary,
      borderWidth: 1,
      borderColor: Colors.gold,
      fontFamily: Fonts.bodyBold,
    },
    partNumberActive: { backgroundColor: Colors.gold, color: '#1F1A2E' },
    partTitle: { flex: 1, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
  });
};
