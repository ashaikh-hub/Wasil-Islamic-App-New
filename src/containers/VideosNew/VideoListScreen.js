import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Spacing, useScreen } from '../../theme';
import { ScreenState } from '../../components';
import VideoCard from './VideoCard';
import { fetchByChannel, fetchBySpeaker } from './videoApi';

// Videos of one channel (route param `channelname`) or one speaker (`speakerid`).
// `layout` is 'grid' or 'list'.
export default function VideoListScreen({ route, navigation, layout = 'list' }) {
  const { channelname, speakerid, speakername } = route.params || {};
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = speakerid ? await fetchBySpeaker(speakerid) : await fetchByChannel(channelname);
      setVideos(Array.isArray(data) ? data : []);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, [channelname, speakerid]);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready' || videos.length === 0) {
    return (
      <ScreenState
        status={status === 'ready' ? 'empty' : status}
        title={status === 'ready' ? 'No videos yet' : "Couldn't load videos"}
        onRetry={() => {
          setStatus('loading');
          load();
        }}
      />
    );
  }

  const open = (v) =>
    speakerid
      ? navigation.navigate('SpeakersVideosPlayingNew', { videosid: v.videoLink, videotitle: v.videoTitle, summary: v.summary, speakerid, speakername })
      : navigation.navigate('VideoPlayingNew', { videosid: v.videoLink, videotitle: v.videoTitle, summary: v.summary, videochannelname: v.videochannelname });

  const columns = layout === 'grid' ? (width >= 600 ? 3 : 2) : 1;
  const itemWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        key={columns}
        data={videos}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { gap: Spacing.md } : undefined}
        keyExtractor={(item, index) => item._id || String(index)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={Colors.textPrimary}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
          />
        }
        renderItem={({ item }) =>
          columns > 1 ? (
            <VideoCard video={item} variant="grid" width={itemWidth} onPress={() => open(item)} />
          ) : (
            <VideoCard video={item} variant="row" onPress={() => open(item)} />
          )
        }
      />
    </View>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.lg, gap: Spacing.md },
  });
