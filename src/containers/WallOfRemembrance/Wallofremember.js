import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity, Text, Image, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import { ScreenState } from '../../components';
import RemembranceHeader from './RemembranceHeader';
import { fetchApproved } from './remembranceApi';

const Wallofremember = ({ navigation }) => {
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const [people, setPeople] = useState([]);
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setPeople(await fetchApproved());
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load the wall" onRetry={load} />;

  const columns = width >= 600 ? 3 : 2;
  const cardWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <View style={s.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        key={columns}
        data={people}
        numColumns={columns}
        keyExtractor={(item, index) => item._id || String(index)}
        columnWrapperStyle={{ gap: Spacing.md, paddingHorizontal: Spacing.lg }}
        contentContainerStyle={{ gap: Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }}
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
        ListHeaderComponent={
          <View style={{ gap: Spacing.md, marginBottom: Spacing.sm }}>
            <RemembranceHeader
              arabic="رَبَّنَا ٱغْفِرْ لِي وَلِوَٰلِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ ٱلْحِسَابُ"
              translation="Our Lord! Forgive me, my parents, and the believers the Day when the judgment will come to pass."
              reference="SURAH IBRAHIM 14:41"
            />
            <TouchableOpacity style={s.addButton} onPress={() => navigation.navigate('RemembranceForm')} accessibilityRole="button">
              <Text style={s.addText}>＋  Add a beloved soul</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={<Text style={s.empty}>No remembrances yet. Be the first to add one.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[s.card, { width: cardWidth }]}
            accessibilityRole="button"
            accessibilityLabel={`In memory of ${item.lovedOneName || 'a loved one'}`}
            onPress={() => navigation.navigate('WallofrememberDetail', { wallOfRememberId: item._id })}>
            {item.photo?.url ? (
              <Image source={{ uri: item.photo.url }} style={s.photo} />
            ) : (
              <View style={[s.photo, s.noPhoto]}>
                <Text style={s.initial}>{(item.lovedOneName || '?').trim()[0]?.toUpperCase()}</Text>
              </View>
            )}
            <View style={s.info}>
              <Text numberOfLines={2} style={s.name}>
                {item.lovedOneName || 'Unnamed'}
              </Text>
              {item.relationship ? <Text style={s.relation}>{item.relationship}</Text> : null}
              {item.shortdescription ? (
                <Text numberOfLines={3} style={s.desc}>
                  {item.shortdescription}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Wallofremember;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    addButton: {
      marginHorizontal: Spacing.lg,
      minHeight: 48,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: { fontSize: TypeScale.subtitle - 1, color: Colors.onButton, fontFamily: Fonts.bodyBold },
    card: { borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    photo: { width: '100%', aspectRatio: 1, resizeMode: 'cover' },
    noPhoto: { alignItems: 'center', justifyContent: 'center', backgroundColor: isLight ? '#E4DCF3' : Colors.surfaceAlt },
    initial: { fontSize: 40, color: Colors.gold, fontFamily: Fonts.heading },
    info: { padding: Spacing.md, gap: 2 },
    name: { fontSize: TypeScale.body + 1, color: Colors.heading, fontFamily: Fonts.heading },
    relation: { fontSize: TypeScale.caption, color: Colors.gold, fontFamily: Fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 0.5 },
    desc: { marginTop: Spacing.xs, fontSize: TypeScale.small, lineHeight: 16, color: Colors.textSecondary, fontFamily: Fonts.body },
    empty: { marginTop: Spacing.xl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
