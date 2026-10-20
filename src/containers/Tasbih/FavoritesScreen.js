import React, { useMemo } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeartfilledSVG, FavouriteEmptySVG } from "../../assets/icons";
import useStoreTasbih, { BG_MAP } from "../../tasbihstore";
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from "../../theme";

const arabicFontSize = (text = "") => {
  const n = text.length;
  if (n <= 10) return 32;
  if (n <= 20) return 28;
  if (n <= 30) return 24;
  return 22;
};

export default function FavoritesScreen({ navigation }) {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const { favouritestasbih, deleteTasbih } = useStoreTasbih();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        data={favouritestasbih}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.list,
          favouritestasbih.length === 0 && styles.listEmpty,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FavouriteEmptySVG />
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptyText}>Tap the heart on any tasbih to keep it here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("TasbihCounterScreen", { tasbihNameEnglish: item.tasbihnameenglish })}
            accessibilityRole="button">
            <ImageBackground source={BG_MAP[item.bgKey] || BG_MAP["cloud-bg"]} style={styles.card} imageStyle={styles.cardImage}>
              <View style={styles.cardHeader}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.tasbihnameenglish}
                </Text>
                <TouchableOpacity
                  onPress={() => deleteTasbih(item)}
                  style={styles.heart}
                  accessibilityRole="button"
                  accessibilityLabel="Remove from favourites">
                  <HeartfilledSVG />
                </TouchableOpacity>
              </View>
              <Text style={[styles.arabic, { fontSize: arabicFontSize(item.tasbihinarabic) }]} numberOfLines={2} adjustsFontSizeToFit>
                {item.tasbihinarabic}
              </Text>
              <Text style={styles.transliteration}>{item.tasbihtransliteration}</Text>
              {item.tasbihpurpose ? (
                <Text style={styles.purpose} numberOfLines={3}>
                  {item.tasbihpurpose}
                </Text>
              ) : null}
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.lg, gap: Spacing.md },
    listEmpty: { flexGrow: 1, justifyContent: "center" },
    empty: { alignItems: "center", gap: Spacing.sm },
    emptyTitle: { marginTop: Spacing.md, fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading },
    emptyText: { fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.body, textAlign: "center" },
    card: { padding: Spacing.lg, borderRadius: Radius.lg, overflow: "hidden", backgroundColor: "#F2F0F5" },
    cardImage: { borderRadius: Radius.lg },
    cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    title: { flex: 1, fontSize: TypeScale.subtitle - 1, color: Colors.inkAccent, fontFamily: Fonts.bodyBold },
    heart: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, alignItems: "flex-end", justifyContent: "center" },
    arabic: { marginTop: Spacing.xs, textAlign: "center", color: Colors.inkAccent, fontFamily: Fonts.arabic },
    transliteration: { marginTop: Spacing.xs, textAlign: "center", fontSize: TypeScale.subtitle + 1, color: "#1F1A2E", fontFamily: Fonts.bodyBold },
    purpose: {
      marginTop: Spacing.xs,
      alignSelf: "center",
      maxWidth: "90%",
      textAlign: "center",
      fontSize: TypeScale.small + 1,
      lineHeight: 18,
      color: "#3A3548",
      fontFamily: Fonts.body,
    },
  });
