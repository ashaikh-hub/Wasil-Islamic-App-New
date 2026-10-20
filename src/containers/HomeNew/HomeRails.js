import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { SectionHeader } from '../../components';
import reciters from '../Reciters/newreciters';
import ReciterAvatar from '../Reciters/ReciterAvatar';
import { fetchApproved } from '../WallOfRemembrance/remembranceApi';

const useCardStyles = () => {
  const { Colors } = useTheme();
  return useMemo(() => {
    const isLight = Colors.name === 'white';
    const tile = isLight ? Colors.surfaceAlt : Colors.surface;
    return StyleSheet.create({
      rail: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
      cover: { width: 120, height: 160, borderRadius: Radius.md, backgroundColor: tile },
      square: { width: 120, height: 120, borderRadius: Radius.md, backgroundColor: tile },
      caption: { width: 120, marginTop: Spacing.xs, fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
      sub: { width: 120, fontSize: TypeScale.caption, color: Colors.textSecondary, fontFamily: Fonts.body },
      reciter: { width: 104, alignItems: 'center', gap: Spacing.xs },
      reciterName: { textAlign: 'center', fontSize: TypeScale.small, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
      initial: { fontSize: 36, color: Colors.gold, fontFamily: Fonts.heading },
      placeholder: { alignItems: 'center', justifyContent: 'center' },
    });
  }, [Colors]);
};

// Fetches once; renders nothing if the request fails or comes back empty, so one bad section never blanks Home.
const useOptionalList = (loader) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let alive = true;
    loader()
      .then((list) => alive && setItems(Array.isArray(list) ? list : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return items;
};

export function StoriesRail({ navigation }) {
  const s = useCardStyles();
  const categories = useOptionalList(async () => (await axios.get('https://islamicapp.vercel.app/api/islamiccategories')).data);
  if (!categories.length) return null;
  return (
    <View>
      <SectionHeader title="Islamic Stories" actionLabel="See all" onAction={() => navigation.navigate('AllSubCategories')} />
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={s.rail}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('SubCategories', { categoryId: item._id, name: item.categoryname })} accessibilityRole="button">
            {item.path ? <Image source={{ uri: item.path }} style={s.cover} /> : <View style={s.cover} />}
            <Text style={s.caption} numberOfLines={1}>
              {item.categoryname}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export function RecitersRail({ navigation }) {
  const s = useCardStyles();
  return (
    <View>
      <SectionHeader title="Reciters" actionLabel="See all" onAction={() => navigation.navigate('RecitersList')} />
      <FlatList
        data={reciters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={s.rail}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.reciter}
            onPress={() => navigation.navigate('ReciterDetail', { name: item.name, reciterId: item.id, reciterName: item.name })}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.style?.name}`}>
            <ReciterAvatar reciter={item} size={84} />
            <Text style={s.reciterName} numberOfLines={2}>
              {item.name.replace(/`/g, "'")}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export function RemembranceRail({ navigation }) {
  const s = useCardStyles();
  const people = useOptionalList(fetchApproved);
  return (
    <View>
      <SectionHeader title="Wall of Remembrance" actionLabel="See all" onAction={() => navigation.navigate('Wallofremember')} />
      <FlatList
        data={[{ add: true }, ...people.slice(0, 10)]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => (item.add ? 'add' : item._id || String(i))}
        contentContainerStyle={s.rail}
        renderItem={({ item }) =>
          item.add ? (
            <TouchableOpacity onPress={() => navigation.navigate('RemembranceForm')} accessibilityRole="button" accessibilityLabel="Add a loved one">
              <View style={[s.square, s.placeholder]}>
                <Text style={s.initial}>＋</Text>
              </View>
              <Text style={s.caption}>Add a loved one</Text>
              <Text style={s.sub}>Sadaqah jariyah</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('WallofrememberDetail', { wallOfRememberId: item._id })} accessibilityRole="button">
              {item.photo?.url ? (
                <Image source={{ uri: item.photo.url }} style={s.square} />
              ) : (
                <View style={[s.square, s.placeholder]}>
                  <Text style={s.initial}>{(item.lovedOneName || '?').trim()[0]?.toUpperCase()}</Text>
                </View>
              )}
              <Text style={s.caption} numberOfLines={1}>
                {item.lovedOneName}
              </Text>
              {item.relationship ? (
                <Text style={s.sub} numberOfLines={1}>
                  {item.relationship}
                </Text>
              ) : null}
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}
