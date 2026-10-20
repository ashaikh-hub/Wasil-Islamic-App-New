import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, useScreen } from '../../theme';
import VideoCard from './VideoCard';
import { fetchByChannel, fetchBySpeaker, youtubeId } from './videoApi';

// Plays one video and lists more from the same channel or speaker.
export default function VideoPlayerScreen({ route, navigation }) {
  const { videosid, videotitle, summary, videochannelname, speakerid, speakername } = route.params;
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [more, setMore] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = speakerid ? await fetchBySpeaker(speakerid) : await fetchByChannel(videochannelname);
      setMore((Array.isArray(data) ? data : []).filter((v) => v.videoLink !== videosid));
    } catch (e) {
      setMore([]);
    }
  }, [speakerid, videochannelname, videosid]);

  useEffect(() => {
    load();
  }, [load]);

  const playerHeight = Math.round((width * 9) / 16);

  const openNext = (v) =>
    navigation.replace(speakerid ? 'SpeakersVideosPlayingNew' : 'VideoPlayingNew', {
      videosid: v.videoLink,
      videotitle: v.videoTitle,
      summary: v.summary,
      videochannelname: v.videochannelname,
      speakerid,
      speakername,
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={{ width, height: playerHeight, backgroundColor: '#000000' }}>
        <YoutubePlayer width={width} height={playerHeight} play videoId={youtubeId(videosid)} />
      </View>
      <FlatList
        data={more}
        keyExtractor={(item, index) => item._id || String(index)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        ListHeaderComponent={
          <View style={styles.info}>
            <Text style={styles.title}>{videotitle}</Text>
            {speakername ? <Text style={styles.meta}>{speakername}</Text> : null}
            {summary ? (
              <TouchableOpacity onPress={() => setExpanded((e) => !e)} activeOpacity={0.8} accessibilityRole="button">
                <Text style={styles.summary} numberOfLines={expanded ? undefined : 3}>
                  {summary}
                </Text>
                <Text style={styles.more}>{expanded ? 'Show less' : 'Show more'}</Text>
              </TouchableOpacity>
            ) : null}
            {more.length ? <Text style={styles.section}>More videos</Text> : null}
          </View>
        }
        renderItem={({ item }) => <VideoCard video={item} variant="row" onPress={() => openNext(item)} />}
      />
    </View>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    info: { paddingTop: Spacing.lg, gap: Spacing.xs },
    title: { fontSize: TypeScale.subtitle + 2, lineHeight: 24, color: Colors.heading, fontFamily: Fonts.heading },
    meta: { fontSize: TypeScale.small + 1, color: Colors.gold, fontFamily: Fonts.bodySemiBold },
    summary: { marginTop: Spacing.xs, fontSize: TypeScale.body, lineHeight: 20, color: Colors.textSecondary, fontFamily: Fonts.body },
    more: { marginTop: 2, fontSize: TypeScale.small, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    section: { marginTop: Spacing.xl, marginBottom: Spacing.xs, fontSize: TypeScale.subtitle + 1, color: Colors.heading, fontFamily: Fonts.heading },
  });
