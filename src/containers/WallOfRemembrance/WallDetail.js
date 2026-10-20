import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { ScreenState } from '../../components';
import { fetchRemembrance, isFemale } from './remembranceApi';

const PHOTO = 150;

const WallDetail = ({ route }) => {
  const { wallOfRememberId } = route.params || {};
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const [person, setPerson] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    if (!wallOfRememberId) {
      setStatus('empty');
      return;
    }
    setStatus('loading');
    try {
      const p = await fetchRemembrance(wallOfRememberId);
      setPerson(p);
      setStatus(p ? 'ready' : 'empty');
    } catch (e) {
      setStatus('error');
    }
  }, [wallOfRememberId]);

  useEffect(() => {
    load();
  }, [load]);

  if (status !== 'ready') {
    return <ScreenState status={status} title={status === 'empty' ? 'Remembrance not found' : "Couldn't load this remembrance"} onRetry={load} />;
  }

  const name = person.lovedOneName || 'Unnamed';
  const female = isFemale(person);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={s.hero}>
        <View style={s.photoRing}>
          {person.photo?.url ? (
            <Image source={{ uri: person.photo.url }} style={s.photo} />
          ) : (
            <View style={[s.photo, s.noPhoto]}>
              <Text style={s.initial}>{name.trim()[0]?.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={s.name}>{name}</Text>
        {person.relationship ? <Text style={s.relation}>{person.relationship}</Text> : null}
        <Text style={s.arabic}>{female ? 'رَحِمَهَا اللهُ' : 'رَحِمَهُ اللهُ'}</Text>
        <Text style={s.dua}>
          May Allah grant {female ? 'her' : 'him'} Jannatul Firdaus and bless {female ? 'her' : 'him'} with eternal peace.
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>In loving memory of {name}</Text>
        {person.description || person.shortdescription ? <Text style={s.cardText}>{person.description || person.shortdescription}</Text> : null}
      </View>
    </ScrollView>
  );
};

export default WallDetail;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    hero: { alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, gap: Spacing.xs },
    photoRing: { width: PHOTO + 8, height: PHOTO + 8, borderRadius: (PHOTO + 8) / 2, padding: 4, backgroundColor: Colors.gold, marginBottom: Spacing.md },
    photo: { width: PHOTO, height: PHOTO, borderRadius: PHOTO / 2 },
    noPhoto: { alignItems: 'center', justifyContent: 'center', backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    initial: { fontSize: 56, color: Colors.gold, fontFamily: Fonts.heading },
    name: { fontSize: TypeScale.headline, textAlign: 'center', color: Colors.heading, fontFamily: Fonts.heading },
    relation: { fontSize: TypeScale.small, color: Colors.gold, fontFamily: Fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1 },
    arabic: { marginTop: Spacing.md, fontSize: 26, lineHeight: 42, color: Colors.textPrimary, fontFamily: Fonts.arabic },
    dua: { maxWidth: 300, textAlign: 'center', fontSize: TypeScale.body, lineHeight: 21, color: Colors.textSecondary, fontFamily: Fonts.body },
    card: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      gap: Spacing.sm,
    },
    cardTitle: { fontSize: TypeScale.subtitle + 1, color: Colors.heading, fontFamily: Fonts.heading },
    cardText: { fontSize: TypeScale.body + 1, lineHeight: 23, color: Colors.textPrimary, fontFamily: Fonts.body },
  });
};
