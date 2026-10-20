import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, RefreshControl } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { ScreenState, SectionHeader } from '../../components';
import VideoCard from './VideoCard';
import { fetchChannels, fetchSpeakers, fetchByChannel, channelRoute } from './videoApi';

const RAILS = [
  { key: 'docs', title: 'Islamic Documentaries', channel: 'Islamic Documentaries' },
  { key: 'kids', title: 'Kids', channel: 'Kids' },
];
const RAIL_SIZE = 8;

const VideoDashboard = ({ navigation }) => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [channels, setChannels] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [rails, setRails] = useState({});
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [ch, sp, ...videos] = await Promise.all([
        fetchChannels(),
        fetchSpeakers().catch(() => []),
        ...RAILS.map((r) => fetchByChannel(r.channel).catch(() => [])),
      ]);
      setChannels(ch);
      setSpeakers(sp);
      setRails(Object.fromEntries(RAILS.map((r, i) => [r.key, videos[i].slice(0, RAIL_SIZE)])));
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load videos" onRetry={load} />;

  const play = (v) =>
    navigation.navigate('VideoPlayingNew', {
      videosid: v.videoLink,
      videotitle: v.videoTitle,
      summary: v.summary,
      videochannelname: v.videochannelname,
    });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      showsVerticalScrollIndicator={false}
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
      }>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />

      <SectionHeader title="Categories" />
      <View style={styles.chips}>
        {channels.map((c, i) => (
          <TouchableOpacity
            key={c._id || c.id || i}
            style={styles.chip}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(...channelRoute(c.videochannelname))}
            accessibilityRole="button">
            <Text style={styles.chipText}>{c.videochannelname}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {speakers.length ? (
        <>
          <SectionHeader title="Durs & Podcast" actionLabel="See all" onAction={() => navigation.navigate('BySpeakersNew')} />
          <FlatList
            data={speakers.slice(0, RAIL_SIZE)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.rail}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.speaker}
                activeOpacity={0.85}
                accessibilityRole="button"
                onPress={() => navigation.navigate('SpeakersDetailNew', { name: item.speakerName, speakerid: item._id, speakername: item.speakerName })}>
                <View style={styles.speakerImage}>{item.coverImage ? <SvgUri uri={item.coverImage} width="100%" height="100%" /> : null}</View>
                <Text style={styles.speakerName} numberOfLines={2}>
                  {item.speakerName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : null}

      {RAILS.map((r) =>
        rails[r.key]?.length ? (
          <View key={r.key}>
            <SectionHeader
              title={r.title}
              actionLabel="See all"
              onAction={() => navigation.navigate('ChannelsDetailNew', { channelname: r.channel, name: r.title })}
            />
            <FlatList
              data={rails[r.key]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item._id || String(index)}
              contentContainerStyle={styles.rail}
              renderItem={({ item }) => <VideoCard video={item} width={220} onPress={() => play(item)} />}
            />
          </View>
        ) : null,
      )}
    </ScrollView>
  );
};

export default VideoDashboard;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
    chip: {
      minHeight: 40,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
      backgroundColor: isLight ? Colors.surfaceAlt : 'transparent',
      justifyContent: 'center',
    },
    chipText: { fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    rail: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    speaker: { width: 128 },
    speakerImage: { width: 128, height: 160, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    speakerName: { marginTop: Spacing.sm, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
  });
};
