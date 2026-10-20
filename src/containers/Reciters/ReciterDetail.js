import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Pressable, StatusBar } from 'react-native';
import TrackPlayer, { useTrackPlayerEvents, Event, State, useProgress } from 'react-native-track-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SURAH_NAMES } from './surahNames';
import {
  WasilNewRecitersBTPlayIcon,
  WasilNewRecitersBTPauseIcon,
  SearchSVG,
  IslamicStoryPlayPreviousSVG,
  IslamicStoryPlayNextSVG,
  IslamicStoryPlayRewindSVG,
  IslamicStoryPlayForwardSVG,
  IslamicStoryPlayBTAudioSVG,
  IslamicStoryPauseBTAudioSVG,
  IslamicStoryPlayAudioSVG,
  IslamicStoryPauseAudioSVG,
} from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';
import { ScreenState } from '../../components';
import { savePlayerState } from './playerStorage';

const ARTWORK = 'https://res.cloudinary.com/daof5pne5/image/upload/v1786029254/notificationbg.png';

const formatTime = (sec = 0) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function ReciterDetail({ route }) {
  const { reciterId } = route.params;
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const PlayBig = theme === 'white' ? IslamicStoryPlayAudioSVG : IslamicStoryPlayBTAudioSVG;
  const PauseBig = theme === 'white' ? IslamicStoryPauseAudioSVG : IslamicStoryPauseBTAudioSVG;

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [currentChapter, setCurrentChapter] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const { position, duration } = useProgress(500);
  const listRef = useRef(null);
  const userScrolling = useRef(false);

  // Only surahs we can name and play. The player queue is built from this exact list,
  // so a chapter's queue index is its index here.
  const playable = useMemo(
    () => files.filter((f) => f.audio_url && SURAH_NAMES[f.chapter_id]).sort((a, b) => a.chapter_id - b.chapter_id),
    [files],
  );

  const query = search.trim().toLowerCase();
  const visible = useMemo(
    () =>
      query
        ? playable.filter((f) => {
            const s = SURAH_NAMES[f.chapter_id];
            return s.english.toLowerCase().includes(query) || s.meaning.toLowerCase().includes(query) || String(f.chapter_id) === query;
          })
        : playable,
    [playable, query],
  );

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setFiles(json.audio_files || []);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, [reciterId]);

  // Pick up whatever this reciter is already playing (e.g. from the mini player).
  const syncFromPlayer = useCallback(async () => {
    try {
      const active = await TrackPlayer.getActiveTrack();
      if (active?.reciterId === reciterId) {
        setCurrentChapter(active.chapterId);
        setIsPlaying((await TrackPlayer.getState()) === State.Playing);
      } else {
        setCurrentChapter(null);
        setIsPlaying(false);
      }
    } catch (e) {
      // player not initialised yet
    }
  }, [reciterId]);

  useEffect(() => {
    load();
    syncFromPlayer();
  }, [load, syncFromPlayer]);

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged, Event.PlaybackState], (event) => {
    if (event.type === Event.PlaybackActiveTrackChanged) {
      const track = event.track;
      if (track?.reciterId === reciterId) {
        setCurrentChapter(track.chapterId);
        const idx = visible.findIndex((f) => f.chapter_id === track.chapterId);
        if (idx >= 0 && !userScrolling.current) {
          listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.4 });
        }
      } else {
        setCurrentChapter(null);
      }
      savePlayerState();
    }
    if (event.type === Event.PlaybackState) {
      setIsPlaying(event.state === State.Playing);
      if (event.state === State.Paused) savePlayerState();
    }
  });

  const startQueueAt = async (chapterId) => {
    setBusy(true);
    try {
      const index = playable.findIndex((f) => f.chapter_id === chapterId);
      if (index < 0) return;
      const active = await TrackPlayer.getActiveTrack();
      if (active?.reciterId !== reciterId) {
        await TrackPlayer.reset();
        await TrackPlayer.add(
          playable.map((f) => ({
            id: `${reciterId}-${f.chapter_id}`,
            url: f.audio_url,
            title: SURAH_NAMES[f.chapter_id].english,
            artist: 'Wasil Islamic App',
            artwork: ARTWORK,
            reciterId,
            chapterId: f.chapter_id,
            type: 'reciter',
          })),
        );
      }
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      setCurrentChapter(chapterId);
    } catch (e) {
      // leave the UI as it was; the user can tap again
    } finally {
      setBusy(false);
    }
  };

  const togglePlayPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) await TrackPlayer.pause();
    else await TrackPlayer.play();
  };

  const onPressSurah = (chapterId) => (chapterId === currentChapter ? togglePlayPause() : startQueueAt(chapterId));

  const seekBy = async (delta) => {
    const pos = await TrackPlayer.getPosition();
    const dur = await TrackPlayer.getDuration();
    await TrackPlayer.seekTo(Math.min(Math.max(0, pos + delta), dur || pos + delta));
  };

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load recitations" onRetry={load} />;

  const progress = duration ? Math.min(position / duration, 1) : 0;
  const current = currentChapter ? SURAH_NAMES[currentChapter] : null;
  const PLAYER_HEIGHT = 190;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={styles.searchBox}>
        <SearchSVG />
        <TextInput
          placeholder="Search surah"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={Colors.textSecondary}
          returnKeyType="search"
          accessibilityLabel="Search surah"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Clear search">
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        ref={listRef}
        data={visible}
        keyExtractor={(item) => String(item.chapter_id)}
        keyboardShouldPersistTaps="handled"
        onScrollToIndexFailed={() => {}}
        onScrollBeginDrag={() => (userScrolling.current = true)}
        onMomentumScrollEnd={() => (userScrolling.current = false)}
        contentContainerStyle={[styles.list, { paddingBottom: (current ? PLAYER_HEIGHT : 0) + insets.bottom + Spacing.lg }]}
        ListEmptyComponent={<Text style={styles.noMatch}>No surah matches “{search}”</Text>}
        renderItem={({ item }) => {
          const surah = SURAH_NAMES[item.chapter_id];
          const active = item.chapter_id === currentChapter;
          return (
            <TouchableOpacity
              style={[styles.row, active && styles.rowActive]}
              activeOpacity={0.85}
              onPress={() => onPressSurah(item.chapter_id)}
              accessibilityRole="button"
              accessibilityLabel={`${active && isPlaying ? 'Pause' : 'Play'} ${surah.english}`}>
              <View style={[styles.badge, active && styles.badgeActive]}>
                <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{item.chapter_id}</Text>
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.english} numberOfLines={1}>
                  {surah.english.replace(/^Surah\s+/, '')}
                </Text>
                <Text style={styles.meaning} numberOfLines={1}>
                  {surah.meaning}
                </Text>
              </View>
              <Text style={styles.arabic} numberOfLines={1}>
                {surah.arabic}
              </Text>
              <View style={styles.playIcon}>{active && isPlaying ? <WasilNewRecitersBTPauseIcon /> : <WasilNewRecitersBTPlayIcon />}</View>
            </TouchableOpacity>
          );
        }}
      />

      {current ? (
        <View style={[styles.player, { paddingBottom: insets.bottom + Spacing.md }]}>
          <Text style={styles.playerTitle} numberOfLines={1}>
            {current.english}
          </Text>
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
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <View style={styles.controlRow}>
            <Pressable onPress={() => TrackPlayer.skipToPrevious().catch(() => {})} style={styles.control} accessibilityLabel="Previous surah">
              <IslamicStoryPlayPreviousSVG />
            </Pressable>
            <Pressable onPress={() => seekBy(-10)} style={styles.control} accessibilityLabel="Back 10 seconds">
              <IslamicStoryPlayRewindSVG />
            </Pressable>
            <Pressable onPress={togglePlayPause} disabled={busy} style={styles.control} accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
              {busy ? <ActivityIndicator color={Colors.inkAccent} /> : isPlaying ? <PauseBig /> : <PlayBig />}
            </Pressable>
            <Pressable onPress={() => seekBy(10)} style={styles.control} accessibilityLabel="Forward 10 seconds">
              <IslamicStoryPlayForwardSVG />
            </Pressable>
            <Pressable onPress={() => TrackPlayer.skipToNext().catch(() => {})} style={styles.control} accessibilityLabel="Next surah">
              <IslamicStoryPlayNextSVG />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      minHeight: 48,
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: isLight ? '#D9D9D9' : Colors.accent,
    },
    searchInput: { flex: 1, paddingVertical: Spacing.sm, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.body },
    clear: { fontSize: 16, color: Colors.textSecondary },
    list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, gap: Spacing.sm },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      minHeight: 68,
      paddingLeft: Spacing.md,
      borderRadius: Radius.md,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    rowActive: { borderColor: Colors.gold },
    badge: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    badgeActive: { backgroundColor: Colors.gold },
    badgeText: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    badgeTextActive: { color: '#1F1A2E' },
    rowBody: { flex: 1 },
    english: { fontSize: TypeScale.body + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    meaning: { marginTop: 2, fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body },
    arabic: { maxWidth: 96, fontSize: 30, color: Colors.textPrimary, fontFamily: 'sura_names', textAlign: 'right' },
    playIcon: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.xs },
    noMatch: { marginTop: Spacing.xxl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },

    player: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      backgroundColor: Colors.white,
      borderTopLeftRadius: Radius.lg + 4,
      borderTopRightRadius: Radius.lg + 4,
      shadowColor: '#000000',
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 12,
    },
    playerTitle: { textAlign: 'center', fontSize: TypeScale.subtitle, color: Colors.inkAccent, fontFamily: Fonts.heading },
    progressHit: { marginTop: Spacing.md, paddingVertical: Spacing.sm, justifyContent: 'center' },
    progressTrack: { height: 4, borderRadius: 2, backgroundColor: '#E6E1F0', overflow: 'hidden' },
    progressFill: { height: 4, backgroundColor: Colors.inkAccent },
    progressThumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.inkAccent },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    timeText: { fontSize: TypeScale.small, color: '#6B6680', fontFamily: Fonts.body, fontVariant: ['tabular-nums'] },
    controlRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: Spacing.sm },
    control: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
  });
};
