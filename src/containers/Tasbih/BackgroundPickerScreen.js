import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useStoreTasbih, { BG_MAP } from "../../tasbihstore";
import { WasilNewTasbihSelectbgSvg } from "../../assets/icons";
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from "../../theme";

const BACKGROUNDS = Object.keys(BG_MAP).map((key) => ({ key, src: BG_MAP[key] }));

export default function BackgroundPickerScreen() {
  const navigation = useNavigation();
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const { currentBgKey, setCurrentBackground } = useStoreTasbih();

  const columns = width >= 600 ? 3 : 2;
  const itemWidth = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  const select = (key) => {
    setCurrentBackground(key);
    navigation.navigate("TasbihCounterScreen", { selectedBg: key });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <FlatList
        key={columns}
        data={BACKGROUNDS}
        keyExtractor={(item) => item.key}
        numColumns={columns}
        columnWrapperStyle={{ gap: Spacing.md }}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xl }]}
        ListHeaderComponent={<Text style={styles.title}>Choose a card background</Text>}
        renderItem={({ item }) => {
          const active = item.key === currentBgKey;
          return (
            <TouchableOpacity
              style={[styles.item, { width: itemWidth }, active && styles.itemActive]}
              onPress={() => select(item.key)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Background ${item.key.replace("cloud-bg", "") || "1"}`}>
              <Image source={item.src} style={styles.image} resizeMode="cover" />
              {active ? (
                <View style={styles.check}>
                  <WasilNewTasbihSelectbgSvg width={24} height={24} />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.lg, gap: Spacing.md },
    title: { marginBottom: Spacing.sm, fontSize: TypeScale.subtitle + 1, textAlign: "center", color: Colors.heading, fontFamily: Fonts.heading },
    item: { aspectRatio: 396 / 230, borderRadius: Radius.md, overflow: "hidden", borderWidth: 2, borderColor: "transparent" },
    itemActive: { borderColor: Colors.gold, borderWidth: 3 },
    image: { width: "100%", height: "100%" },
    check: { position: "absolute", top: Spacing.sm, right: Spacing.sm },
  });
