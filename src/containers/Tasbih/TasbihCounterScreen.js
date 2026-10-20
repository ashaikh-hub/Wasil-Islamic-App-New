import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  FlatList,
  Vibration,
  Modal,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withTiming, Easing } from "react-native-reanimated";
import SoundPlayer from "react-native-sound-player";
import {
  WasilNewTasbihNewHeartUnFilled,
  WasilNewTasbihNewHeartFilled,
  WasilNewTasbihBgChangeSvg,
  WasilNewTasbihSettingSvg,
  WasilNewTasbihBeedsFirstSvg,
  WasilNewTasbihBeedsSecondSvg,
  WasilNewTasbihBeedsThirdSvg,
  WasilNewTasbihBeedsFourthSvg,
} from "../../assets/icons";
import useStoreTasbih from "../../tasbihstore";
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH, useScreen } from "../../theme";
import { ScreenState } from "../../components";

const TAP_SOUND = "https://cloud.muslimandquran.com/v3/tasbihat/Tasbih_Counter_Sound.mp3";
const BEADS_COUNT = 7;
const BEAD_SIZE = 42;
const ANIMATION_DURATION = 400;
const TARGET_PRESETS = [33, 99, 100];
const STORAGE_KEYS = {
  SOUND: "tasbih_sound_enabled",
  VIBRATION: "tasbih_vibration_enabled",
  TARGET: "tasbih_target_count",
  BEAD: "tasbih_selected_bead",
};
const BEADS_LIST = [
  WasilNewTasbihBeedsFirstSvg,
  WasilNewTasbihBeedsSecondSvg,
  WasilNewTasbihBeedsThirdSvg,
  WasilNewTasbihBeedsFourthSvg,
];
const MAIN_BG = {
  blue: { uri: "https://res.cloudinary.com/daof5pne5/image/upload/v1785361063/tasbih/tasbihbgmaint.png" },
  green: { uri: "https://res.cloudinary.com/daof5pne5/image/upload/v1785361063/tasbih/tasbihbgmaint.png" },
  white: { uri: "https://res.cloudinary.com/daof5pne5/image/upload/v1768214415/tasbih/tasbihbgmain.png" },
};

// The rope is a cubic Bézier in a unit box, scaled to the bead area. Beads are placed on the
// same curve, so they always sit on the rope whatever the screen size.
const ROPE = { p0: [-0.06, 0.95], p1: [0.18, 1.12], p2: [0.45, 0.12], p3: [1.06, 0.1] };
const cubic = (t, a, b, c, d) => {
  "worklet";
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

const RING_SIZE = 72;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const arabicFontSize = (text = "") => {
  const n = text.length;
  if (n <= 5) return 40;
  if (n <= 10) return 34;
  if (n <= 15) return 30;
  if (n <= 20) return 28;
  if (n <= 30) return 25;
  return 22;
};

const Bead = ({ index, progress, area, BeadIcon }) => {
  const style = useAnimatedStyle(() => {
    const spacing = 1 / BEADS_COUNT;
    const t = (progress.value * spacing + index * spacing) % 1;
    const x = cubic(t, ROPE.p0[0], ROPE.p1[0], ROPE.p2[0], ROPE.p3[0]) * area.width;
    const y = cubic(t, ROPE.p0[1], ROPE.p1[1], ROPE.p2[1], ROPE.p3[1]) * area.height;
    return { transform: [{ translateX: x - BEAD_SIZE / 2 }, { translateY: y - BEAD_SIZE / 2 }] };
  });
  return (
    <Animated.View style={[styles.bead, style]} pointerEvents="none">
      <BeadIcon width={BEAD_SIZE} height={BEAD_SIZE} />
    </Animated.View>
  );
};

export default function TasbihCounterScreen({ navigation }) {
  const route = useRoute();
  const { tasbihNameEnglish } = route.params;
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const compact = useScreen().height < 700;
  const s = useMemo(() => makeStyles(Colors), [Colors]);

  const [tasbihData, setTasbihData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(1);
  const [total, setTotal] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [targetCount, setTargetCount] = useState(33);
  const [targetInput, setTargetInput] = useState("33");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedBead, setSelectedBead] = useState(0);
  const [area, setArea] = useState(null);

  const progress = useSharedValue(0);
  const ring = useSharedValue(0);

  const { favouritestasbih, addTasbih, deleteTasbih, setCurrentBackground, getCurrentBackgroundImage } = useStoreTasbih();
  const isFavourited = favouritestasbih.some((item) => item._id === selected?._id);
  const cardBackground = getCurrentBackgroundImage();

  useEffect(() => {
    (async () => {
      try {
        const [[, sound], [, vibration], [, target], [, bead]] = await AsyncStorage.multiGet([
          STORAGE_KEYS.SOUND,
          STORAGE_KEYS.VIBRATION,
          STORAGE_KEYS.TARGET,
          STORAGE_KEYS.BEAD,
        ]);
        if (sound !== null) setSoundEnabled(JSON.parse(sound));
        if (vibration !== null) setVibrationEnabled(JSON.parse(vibration));
        const t = parseInt(target, 10);
        if (t > 0) {
          setTargetCount(t);
          setTargetInput(String(t));
        }
        const b = parseInt(bead, 10);
        if (b >= 0 && b < BEADS_LIST.length) setSelectedBead(b);
      } catch (e) {
        // fall back to defaults
      }
    })();
  }, []);

  useEffect(() => {
    if (route.params?.selectedBg) setCurrentBackground(route.params.selectedBg);
  }, [route.params?.selectedBg, setCurrentBackground]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch(
        `https://islamicapp.vercel.app/api/tasbihverse?tasbihnameenglish=${encodeURIComponent(tasbihNameEnglish)}`,
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const list = Array.isArray(json) ? json : [];
      setTasbihData(list);
      setSelected(list[0] || null);
      setStatus(list.length ? "ready" : "empty");
    } catch (error) {
      setStatus("error");
    }
  }, [tasbihNameEnglish]);

  useEffect(() => {
    load();
  }, [load]);

  const resetCounter = useCallback(() => {
    setCount(0);
    setRound(1);
    setTotal(0);
    ring.value = withTiming(0, { duration: 200 });
  }, [ring]);

  // Changing the target restarts the current round.
  useEffect(() => {
    setCount(0);
    setRound(1);
    ring.value = withTiming(0, { duration: 200 });
  }, [targetCount, ring]);

  const onCount = () => {
    const target = targetCount > 0 ? targetCount : 33;
    const next = count >= target ? 1 : count + 1;
    if (count >= target) setRound((r) => r + 1);
    setCount(next);
    setTotal((t) => t + 1);
    ring.value = withTiming(next / target, { duration: 300 });
    progress.value = withTiming(progress.value + 1, { duration: ANIMATION_DURATION, easing: Easing.out(Easing.cubic) });

    if (soundEnabled) {
      try {
        SoundPlayer.playUrl(TAP_SOUND);
      } catch (e) {
        // sound is best-effort
      }
    }
    if (vibrationEnabled) Vibration.vibrate(next === target ? [0, 60, 80, 60] : 30);
  };

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: RING_CIRCUMFERENCE * (1 - ring.value) }));

  const persist = (key, value) => AsyncStorage.setItem(key, value).catch(() => {});

  const applyTarget = (value) => {
    setTargetInput(value);
    const n = parseInt(value, 10);
    if (n > 0) {
      setTargetCount(n);
      persist(STORAGE_KEYS.TARGET, String(n));
    }
  };

  const toggleFavourite = () => {
    if (!selected) return;
    if (isFavourited) deleteTasbih(selected);
    else addTasbih(selected);
  };

  if (status !== "ready") {
    return (
      <ScreenState
        status={status}
        title={status === "empty" ? "No verses found" : "Couldn't load this tasbih"}
        onRetry={load}
      />
    );
  }

  const BeadIcon = BEADS_LIST[selectedBead] || BEADS_LIST[0];
  const ropePath = area
    ? `M ${ROPE.p0[0] * area.width} ${ROPE.p0[1] * area.height} C ${ROPE.p1[0] * area.width} ${ROPE.p1[1] * area.height}, ${
        ROPE.p2[0] * area.width
      } ${ROPE.p2[1] * area.height}, ${ROPE.p3[0] * area.width} ${ROPE.p3[1] * area.height}`
    : null;

  return (
    <View style={s.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <ImageBackground source={MAIN_BG[theme] || MAIN_BG.white} style={StyleSheet.absoluteFill} imageStyle={s.decor} />

      <ImageBackground source={cardBackground} style={s.card} imageStyle={s.cardImage}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle} numberOfLines={1}>
            {selected?.tasbihnameenglish}
          </Text>
          <TouchableOpacity
            onPress={toggleFavourite}
            style={s.iconButton}
            accessibilityRole="button"
            accessibilityLabel={isFavourited ? "Remove from favourites" : "Add to favourites"}>
            {isFavourited ? <WasilNewTasbihNewHeartFilled /> : <WasilNewTasbihNewHeartUnFilled />}
          </TouchableOpacity>
        </View>

        <Text style={[s.arabic, { fontSize: arabicFontSize(selected?.tasbihinarabic) }]} numberOfLines={2} adjustsFontSizeToFit>
          {selected?.tasbihinarabic}
        </Text>
        <Text style={s.transliteration}>{selected?.tasbihtransliteration}</Text>
        {selected?.tasbihpurpose ? (
          <Text style={s.purpose} numberOfLines={compact ? 2 : 3}>
            {selected.tasbihpurpose}
          </Text>
        ) : null}

        <View style={s.cardFooter}>
          <TouchableOpacity
            style={s.iconButton}
            onPress={() => navigation.navigate("BackgroundPickerScreen", { tasbihNameEnglish })}
            accessibilityRole="button"
            accessibilityLabel="Change card background">
            <WasilNewTasbihBgChangeSvg />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.iconButton}
            onPress={() => setSettingsVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Counter settings">
            <WasilNewTasbihSettingSvg />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {tasbihData.length > 1 ? (
        <FlatList
          horizontal
          data={tasbihData}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item._id || String(index)}
          style={s.chipList}
          contentContainerStyle={s.chips}
          renderItem={({ item }) => {
            const active = item === selected;
            return (
              <TouchableOpacity
                style={[s.chip, active && s.chipActive]}
                onPress={() => {
                  setSelected(item);
                  resetCounter();
                }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}>
                <Text style={[s.chipText, active && s.chipTextActive]}>{item.tasbihinarabic}</Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : null}

      <View style={s.counterRow}>
        <View style={s.statsColumn}>
          <View style={s.stat}>
            <Text style={s.statValue}>{round}</Text>
            <Text style={s.statLabel}>Round</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statValue}>{total}</Text>
            <Text style={s.statLabel}>Total</Text>
          </View>
        </View>

        <View style={s.ring} accessible accessibilityLabel={`${count} of ${targetCount}`}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} stroke={Colors.accent} strokeOpacity={0.35} strokeWidth={RING_STROKE} fill="none" />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={Colors.gold}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={RING_CIRCUMFERENCE}
              animatedProps={ringProps}
              rotation="-90"
              origin={`${RING_SIZE / 2},${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={s.ringLabel} pointerEvents="none">
            <Text style={s.count} maxFontSizeMultiplier={1.2}>
              {count}
            </Text>
            <Text style={s.target} maxFontSizeMultiplier={1.2}>
              / {targetCount}
            </Text>
          </View>
        </View>

        <View style={s.resetColumn}>
          <TouchableOpacity
            onPress={resetCounter}
            style={s.resetButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Reset counter">
            <Text style={s.resetText}>↺  Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Pressable
        style={s.beadArea}
        onPress={onCount}
        accessibilityRole="button"
        accessibilityLabel="Count"
        accessibilityHint="Tap anywhere here to count one"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (!area || area.width !== width || area.height !== height) setArea({ width, height });
        }}>
        {area ? (
          <>
            <Svg width={area.width} height={area.height} style={StyleSheet.absoluteFill} pointerEvents="none">
              <Path d={ropePath} stroke={Colors.name === "white" ? "#B4AFB5" : "rgba(255,255,255,0.45)"} strokeWidth={3} fill="none" />
            </Svg>
            {Array.from({ length: BEADS_COUNT }).map((_, i) => (
              <Bead key={i} index={i} progress={progress} area={area} BeadIcon={BeadIcon} />
            ))}
          </>
        ) : null}
        {total === 0 ? <Text style={s.tapHint}>Tap anywhere to count</Text> : null}
      </Pressable>

      <View style={[s.beadSelector, { marginBottom: insets.bottom + Spacing.md }]}>
        {BEADS_LIST.map((Icon, index) => {
          const active = selectedBead === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedBead(index);
                persist(STORAGE_KEYS.BEAD, String(index));
              }}
              activeOpacity={0.8}
              style={[s.beadOption, active && s.beadOptionActive]}
              accessibilityRole="button"
              accessibilityLabel={`Bead style ${index + 1}`}
              accessibilityState={{ selected: active }}>
              <Icon width={34} height={34} />
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal transparent visible={settingsVisible} animationType="fade" onRequestClose={() => setSettingsVisible(false)}>
        <KeyboardAvoidingView style={s.modalRoot} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable style={s.backdrop} onPress={() => setSettingsVisible(false)} accessibilityLabel="Close settings" />
          <View style={[s.sheet, { paddingBottom: insets.bottom + Spacing.lg }]}>
            <View style={s.sheetHandle} />
            <Text style={s.sheetTitle}>Counter settings</Text>

            <View style={s.row}>
              <Text style={s.rowText}>Sound</Text>
              <Switch
                value={soundEnabled}
                trackColor={{ false: "#D0D0D0", true: Colors.action }}
                thumbColor="#FFFFFF"
                onValueChange={(v) => {
                  setSoundEnabled(v);
                  persist(STORAGE_KEYS.SOUND, JSON.stringify(v));
                }}
              />
            </View>
            <View style={s.row}>
              <Text style={s.rowText}>Vibration</Text>
              <Switch
                value={vibrationEnabled}
                trackColor={{ false: "#D0D0D0", true: Colors.action }}
                thumbColor="#FFFFFF"
                onValueChange={(v) => {
                  setVibrationEnabled(v);
                  persist(STORAGE_KEYS.VIBRATION, JSON.stringify(v));
                }}
              />
            </View>

            <Text style={[s.rowText, s.targetLabel]}>Target per round</Text>
            <View style={s.targetRow}>
              {TARGET_PRESETS.map((n) => {
                const active = targetCount === n;
                return (
                  <TouchableOpacity
                    key={n}
                    style={[s.preset, active && s.presetActive]}
                    onPress={() => applyTarget(String(n))}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[s.presetText, active && s.presetTextActive]}>{n}</Text>
                  </TouchableOpacity>
                );
              })}
              <TextInput
                value={targetInput}
                onChangeText={(v) => applyTarget(v.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={5}
                style={s.targetInput}
                accessibilityLabel="Custom target"
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity style={s.doneButton} onPress={() => setSettingsVisible(false)} accessibilityRole="button">
              <Text style={s.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bead: { position: "absolute", left: 0, top: 0 },
});

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    decor: { top: "45%", opacity: 0.9 },

    card: {
      marginHorizontal: Spacing.md,
      marginTop: Spacing.md,
      padding: Spacing.lg,
      paddingBottom: Spacing.sm,
      borderRadius: Radius.lg,
      overflow: "hidden",
      backgroundColor: "#F2F0F5",
    },
    cardImage: { borderRadius: Radius.lg },
    cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cardTitle: { flex: 1, fontSize: TypeScale.subtitle - 1, color: Colors.inkAccent, fontFamily: Fonts.bodyBold },
    arabic: { marginTop: Spacing.xs, textAlign: "center", color: Colors.inkAccent, fontFamily: Fonts.arabic },
    transliteration: {
      marginTop: Spacing.xs,
      textAlign: "center",
      fontSize: TypeScale.subtitle + 1,
      color: "#1F1A2E",
      fontFamily: Fonts.bodyBold,
    },
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
    cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: Spacing.xs },
    iconButton: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, alignItems: "center", justifyContent: "center" },

    chipList: { flexGrow: 0, marginTop: Spacing.md },
    chips: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
    chip: {
      minHeight: 40,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
      justifyContent: "center",
    },
    chipActive: { backgroundColor: Colors.button, borderColor: Colors.button },
    chipText: { fontSize: 18, color: Colors.textPrimary, fontFamily: Fonts.arabic },
    chipTextActive: { color: Colors.onButton },

    counterRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    statsColumn: { flex: 1, flexDirection: "row", gap: Spacing.lg },
    resetColumn: { flex: 1, alignItems: "flex-end" },
    resetButton: {
      minHeight: 36,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
      justifyContent: "center",
    },
    resetText: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    stat: { alignItems: "center" },
    statValue: { fontSize: TypeScale.title, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    statLabel: { fontSize: TypeScale.caption, color: Colors.textSecondary, fontFamily: Fonts.body, textTransform: "uppercase", letterSpacing: 1 },
    ring: { width: RING_SIZE, height: RING_SIZE, alignItems: "center", justifyContent: "center" },
    ringLabel: { position: "absolute", alignItems: "center" },
    count: { fontSize: 24, lineHeight: 26, color: Colors.textPrimary, fontFamily: Fonts.bodyBold },
    target: { fontSize: TypeScale.caption, color: Colors.textSecondary, fontFamily: Fonts.body },

    beadArea: { flex: 1, minHeight: 110, marginTop: Spacing.xs },
    tapHint: {
      position: "absolute",
      bottom: Spacing.md,
      alignSelf: "center",
      fontSize: TypeScale.small,
      color: Colors.textSecondary,
      fontFamily: Fonts.body,
    },

    beadSelector: {
      alignSelf: "center",
      flexDirection: "row",
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: Radius.pill,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000000",
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 5,
    },
    beadOption: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
    beadOptionActive: { backgroundColor: "#FFF4CC" },

    modalRoot: { flex: 1, justifyContent: "flex-end" },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.overlay },
    sheet: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: Radius.lg + 4,
      borderTopRightRadius: Radius.lg + 4,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
    },
    sheetHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#D0D0D0", alignSelf: "center", marginBottom: Spacing.md },
    sheetTitle: { fontSize: TypeScale.title - 2, color: "#1F1A2E", fontFamily: Fonts.heading, marginBottom: Spacing.sm },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 52 },
    rowText: { fontSize: TypeScale.subtitle, color: "#1F1A2E", fontFamily: Fonts.bodySemiBold },
    targetLabel: { marginTop: Spacing.sm },
    targetRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginTop: Spacing.sm },
    preset: {
      minWidth: 56,
      minHeight: 44,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: "#D8D3E3",
      alignItems: "center",
      justifyContent: "center",
    },
    presetActive: { backgroundColor: Colors.action, borderColor: Colors.action },
    presetText: { fontSize: TypeScale.subtitle, color: "#1F1A2E", fontFamily: Fonts.bodySemiBold },
    presetTextActive: { color: Colors.onAction },
    targetInput: {
      flex: 1,
      minHeight: 44,
      borderWidth: 1,
      borderColor: "#D8D3E3",
      borderRadius: Radius.md,
      textAlign: "center",
      fontSize: TypeScale.subtitle,
      color: "#1F1A2E",
    },
    doneButton: {
      marginTop: Spacing.xl,
      minHeight: 48,
      borderRadius: Radius.pill,
      backgroundColor: Colors.action,
      alignItems: "center",
      justifyContent: "center",
    },
    doneText: { fontSize: TypeScale.subtitle, color: Colors.onAction, fontFamily: Fonts.bodyBold },
  });
