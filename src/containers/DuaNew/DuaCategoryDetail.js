import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchSVG } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import { ScreenState } from '../../components';

const DuaCategoryDetail = ({ navigation, route }) => {
  const { duacategoryid, duacategorytitle } = route.params;
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [duas, setDuas] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await axios.get(`https://islamicapp.vercel.app/api/duabycategory?duacategoryId=${duacategoryid}`);
      setDuas(Array.isArray(response.data) ? response.data : []);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, [duacategoryid]);

  useEffect(() => {
    load();
  }, [load]);

  const query = search.trim().toLowerCase();
  const visible = useMemo(
    () => duas.map((d, i) => ({ ...d, position: i })).filter((d) => !query || d.duanameenglish?.toLowerCase().includes(query)),
    [duas, query],
  );

  if (status !== 'ready') return <ScreenState status={status} title="Couldn't load duas" onRetry={load} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={styles.searchBox}>
        <SearchSVG />
        <TextInput
          style={styles.searchInput}
          placeholder="Search duas"
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          accessibilityLabel="Search duas"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Clear search">
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item, index) => item._id || String(index)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        ListEmptyComponent={<Text style={styles.noMatch}>{query ? `No duas match “${search}”` : 'No duas in this category yet'}</Text>}
        initialNumToRender={15}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.85}
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('DuaDetailNew', {
                duacategoryid: item.duacategoryId || duacategoryid,
                duacategorytitle,
                name: duacategorytitle,
                startIndex: item.position,
                duaName: item.duanameenglish,
              })
            }>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.position + 1}</Text>
            </View>
            <Text numberOfLines={2} style={styles.rowText}>
              {item.duanameenglish}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DuaCategoryDetail;

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
      minHeight: 64,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
    },
    badge: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    badgeText: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    rowText: { flex: 1, fontSize: TypeScale.body + 1, lineHeight: 20, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    chevron: { fontSize: 24, color: Colors.textSecondary },
    noMatch: { marginTop: Spacing.xxl, textAlign: 'center', fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
