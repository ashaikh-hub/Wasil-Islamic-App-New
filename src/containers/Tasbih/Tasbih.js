import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, StatusBar } from "react-native";
import { SvgUri } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SearchSVG,
  WasilNewAllBTTasbihSvg,
  WasilNewAllGTasbihSvg,
  WasilNewBTAllahTasbihSvg,
  WasilNewGAllahTasbihSvg,
  WasilNewAllahTasbihSvg,
} from "../../assets/icons";
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from "../../theme";
import { ScreenState } from "../../components";

const NAMES_OF_ALLAH = "Names of Allah";
const ICONS = {
  blue: { Allah: WasilNewBTAllahTasbihSvg, General: WasilNewAllBTTasbihSvg },
  green: { Allah: WasilNewGAllahTasbihSvg, General: WasilNewAllGTasbihSvg },
  white: { Allah: WasilNewAllahTasbihSvg, General: WasilNewAllBTTasbihSvg },
};

const Tasbih = ({ navigation }) => {
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const { Allah: AllahIcon, General: GeneralIcon } = ICONS[theme] || ICONS.white;

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("https://islamicapp.vercel.app/api/tasbihs");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      setData(Array.isArray(json) ? json : []);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const query = search.trim().toLowerCase();
  const categories = useMemo(
    () =>
      data.filter(
        (item) => item.tasbihnameenglish !== NAMES_OF_ALLAH && (!query || item.tasbihnameenglish?.toLowerCase().includes(query)),
      ),
    [data, query],
  );
  const showNamesBanner = !query || NAMES_OF_ALLAH.toLowerCase().includes(query);

  const open = (name) => navigation.navigate("TasbihCounterScreen", { tasbihNameEnglish: name });

  if (status !== "ready") return <ScreenState status={status} title="Couldn't load tasbih" onRetry={load} />;

  const header = (
    <>
      <View style={styles.searchBox}>
        <SearchSVG />
        <TextInput
          placeholder="Search tasbih"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={Colors.textSecondary}
          returnKeyType="search"
          accessibilityLabel="Search tasbih"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")} hitSlop={10} accessibilityLabel="Clear search">
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {showNamesBanner ? (
        <TouchableOpacity style={styles.banner} activeOpacity={0.9} onPress={() => open(NAMES_OF_ALLAH)} accessibilityRole="button">
          <View style={styles.bannerIcon}>
            <AllahIcon />
          </View>
          <View style={styles.bannerBody}>
            <Text style={styles.bannerTitle}>99 Names of Allah</Text>
            <Text style={styles.bannerText}>Discover and reflect on the Most Beautiful Names</Text>
          </View>
          <Text style={styles.chevronOnBanner}>›</Text>
        </TouchableOpacity>
      ) : null}

      {categories.length ? <Text style={styles.sectionTitle}>Tasbih Categories</Text> : null}
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={header}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!showNamesBanner ? <Text style={styles.noMatch}>No tasbih matches “{search}”</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => open(item.tasbihnameenglish)}
            style={styles.row}
            accessibilityRole="button">
            <View style={styles.rowIcon}>{item.path ? <SvgUri uri={item.path} width={32} height={32} /> : <GeneralIcon />}</View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.tasbihnameenglish}
              </Text>
              <Text style={styles.rowSubtitle}>General Tasbih</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Tasbih;

const makeStyles = (Colors) => {
  const isLight = Colors.name === "white";
  const tile = isLight ? Colors.surfaceAlt : Colors.surface;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      minHeight: 48,
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: isLight ? "#D9D9D9" : Colors.accent,
      backgroundColor: isLight ? Colors.white : "transparent",
    },
    searchInput: { flex: 1, paddingVertical: Spacing.sm, fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.body },
    clear: { fontSize: 16, color: Colors.textSecondary },
    banner: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      marginTop: Spacing.lg,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      backgroundColor: isLight ? Colors.surface : Colors.surfaceAlt,
      borderWidth: 1,
      borderColor: Colors.gold,
    },
    bannerIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)" },
    bannerBody: { flex: 1 },
    bannerTitle: { fontSize: TypeScale.subtitle + 1, color: Colors.white, fontFamily: Fonts.bodyBold },
    bannerText: { marginTop: 2, fontSize: TypeScale.small, color: "rgba(255,255,255,0.8)", fontFamily: Fonts.body },
    chevronOnBanner: { fontSize: 28, color: Colors.white },
    sectionTitle: { marginTop: Spacing.xl, marginBottom: Spacing.xs, fontSize: TypeScale.subtitle + 1, color: Colors.heading, fontFamily: Fonts.heading },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      minHeight: 68,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      backgroundColor: tile,
    },
    rowIcon: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: "center", justifyContent: "center" },
    rowBody: { flex: 1 },
    rowTitle: { fontSize: TypeScale.body + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    rowSubtitle: { marginTop: 2, fontSize: TypeScale.caption, color: Colors.gold, fontFamily: Fonts.bodySemiBold, letterSpacing: 0.5 },
    chevron: { fontSize: 24, color: Colors.textSecondary },
    noMatch: { marginTop: Spacing.xxl, textAlign: "center", fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
