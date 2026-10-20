import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchSVG } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import { ScreenState } from '../../components';
import { SPEAKER_DESCRIPTION } from './SpeakerDescription';
import { fetchSpeakers } from './videoApi';

const BySpeakersNew = ({ navigation }) => {
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [speakers, setSpeakers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setSpeakers(await fetchSpeakers());
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const query = search.trim().toLowerCase();
  const visible = useMemo(() => (query ? speakers.filter((s) => s.speakerName?.toLowerCase().includes(query)) : speakers), [speakers, query]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load speakers" onRetry={load} />;

  const columns = width >= 600 ? 3 : 2;
  const cardWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        key={columns}
        data={visible}
        keyExtractor={(item) => item._id}
        numColumns={columns}
        columnWrapperStyle={{ gap: Spacing.md }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
        ListHeaderComponent={
          <View style={styles.searchBox}>
            <SearchSVG />
            <TextInput
              placeholder="Search speaker"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              placeholderTextColor={Colors.textSecondary}
              returnKeyType="search"
              accessibilityLabel="Search speaker"
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Clear search">
                <Text style={styles.clear}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
        ListEmptyComponent={<Text style={styles.noMatch}>No speaker matches “{search}”</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            activeOpacity={0.85}
            accessibilityRole="button"
            onPress={() => navigation.navigate('SpeakersDetailNew', { name: item.speakerName, speakerid: item._id, speakername: item.speakerName })}>
            <View style={styles.image}>{item.coverImage ? <SvgUri uri={item.coverImage} width="100%" height="100%" /> : null}</View>
            <Text numberOfLines={1} style={styles.name}>
              {item.speakerName}
            </Text>
            {SPEAKER_DESCRIPTION[item.speakerName] ? (
              <Text numberOfLines={3} style={styles.desc}>
                {SPEAKER_DESCRIPTION[item.speakerName]}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BySpeakersNew;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      minHeight: 48,
      marginTop: Spacing.lg,
      marginBottom: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: isLight ? '#D9D9D9' : Colors.accent,
    },
    searchInput: { flex: 1, paddingVertical: Spacing.sm, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.body },
    clear: { fontSize: 16, color: Colors.textSecondary },
    card: { padding: Spacing.sm, paddingBottom: Spacing.md, borderRadius: Radius.lg, backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    image: { width: '100%', aspectRatio: 0.85, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: isLight ? Colors.white : Colors.surfaceAlt },
    name: { marginTop: Spacing.sm, fontSize: TypeScale.body + 1, color: Colors.textPrimary, fontFamily: Fonts.heading },
    desc: { marginTop: Spacing.xs, fontSize: TypeScale.small, lineHeight: 16, color: Colors.textSecondary, fontFamily: Fonts.body },
    noMatch: { marginTop: Spacing.xxl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
