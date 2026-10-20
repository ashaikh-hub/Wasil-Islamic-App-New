import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Vibration,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CompassHeading from "react-native-compass-heading";
import Geolocation from "react-native-geolocation-service";
import { check, request, openSettings, PERMISSIONS, RESULTS } from "react-native-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Line, G, Text as SvgText } from "react-native-svg";
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from "../../theme";

const KAABA = { lat: 21.4225, lon: 39.8262 };
const ALIGN_TOLERANCE = 5;
// The pointer printed on the "kaaba" dial artwork faces 270° (west); rotate the face by (qibla - 270).
const ARTWORK_POINTER_DEG = 270;
const DIAL_STORAGE_KEY = "qibla_selected_dial";

const DIALS = {
  blue: [require("../../assets/qibla/blue-kaaba.png"), require("../../assets/qibla/blue-calligraphy.png")],
  green: [require("../../assets/qibla/green-kaaba.png"), require("../../assets/qibla/green-calligraphy.png")],
  white: [require("../../assets/qibla/white-kaaba.png"), require("../../assets/qibla/white-calligraphy.png")],
};

const PERMISSION =
  Platform.OS === "ios" ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;
const normalize = (d) => ((d % 360) + 360) % 360;

const qiblaBearing = (lat, lon) => {
  const φ = toRad(lat);
  const φk = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lon - lon);
  const y = Math.sin(Δλ);
  const x = Math.cos(φ) * Math.tan(φk) - Math.sin(φ) * Math.cos(Δλ);
  return normalize(toDeg(Math.atan2(y, x)));
};

// Signed shortest turn from heading to target, in (-180, 180].
const turnBy = (heading, target) => {
  const d = normalize(target - heading);
  return d > 180 ? d - 360 : d;
};

const getPosition = () =>
  new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      reject,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    ),
  );

const CompassRing = ({ size, qibla, Colors }) => {
  const c = size / 2;
  const rOuter = c - 2;
  const ticks = [];
  for (let deg = 0; deg < 360; deg += 5) {
    const major = deg % 30 === 0;
    const len = major ? 12 : 6;
    const a = toRad(deg);
    ticks.push(
      <Line
        key={deg}
        x1={c + (rOuter - 2) * Math.sin(a)}
        y1={c - (rOuter - 2) * Math.cos(a)}
        x2={c + (rOuter - 2 - len) * Math.sin(a)}
        y2={c - (rOuter - 2 - len) * Math.cos(a)}
        stroke={major ? Colors.textPrimary : Colors.textSecondary}
        strokeOpacity={major ? 0.9 : 0.5}
        strokeWidth={major ? 2 : 1}
      />,
    );
  }
  const labelR = rOuter - 28;
  const cardinals = [
    ["N", 0],
    ["E", 90],
    ["S", 180],
    ["W", 270],
  ];
  const q = toRad(qibla);
  const markerR = rOuter - 8;
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Circle cx={c} cy={c} r={rOuter} stroke={Colors.accent} strokeWidth={2} fill="none" />
      {ticks}
      {cardinals.map(([label, deg]) => (
        <SvgText
          key={label}
          x={c + labelR * Math.sin(toRad(deg))}
          y={c - labelR * Math.cos(toRad(deg)) + 6}
          fontSize={17}
          fontWeight="bold"
          fill={label === "N" ? Colors.gold : Colors.textPrimary}
          textAnchor="middle">
          {label}
        </SvgText>
      ))}
      <G>
        <Circle
          cx={c + markerR * Math.sin(q)}
          cy={c - markerR * Math.cos(q)}
          r={9}
          fill={Colors.gold}
          stroke={Colors.background}
          strokeWidth={3}
        />
      </G>
    </Svg>
  );
};

const QiblaCompass = () => {
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useScreen();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [heading, setHeading] = useState(0);
  const [hasCompass, setHasCompass] = useState(true);
  const [qibla, setQibla] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | blocked | error
  const [dialIndex, setDialIndex] = useState(0);
  const wasAligned = useRef(false);

  const dials = DIALS[theme] || DIALS.white;
  const compassSize = Math.round(Math.min(width - Spacing.xl * 2, height * 0.46, 420));

  // Compass sensor: started once, always stopped on unmount.
  useEffect(() => {
    let active = true;
    CompassHeading.hasCompass()
      .then((ok) => {
        if (!active) return;
        if (!ok) {
          setHasCompass(false);
          return;
        }
        CompassHeading.start(3, ({ heading: h }) => setHeading(h));
      })
      .catch(() => setHasCompass(false));
    return () => {
      active = false;
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(DIAL_STORAGE_KEY)
      .then((v) => v !== null && setDialIndex(Number(v) || 0))
      .catch(() => {});
    locate();
  }, []);

  const applySavedLocation = async () => {
    const [lat, lon] = await Promise.all([AsyncStorage.getItem("ONLATI"), AsyncStorage.getItem("ONLONGI")]);
    if (lat && lon) {
      setQibla(qiblaBearing(parseFloat(lat), parseFloat(lon)));
      setStatus("ready");
      return true;
    }
    return false;
  };

  const locate = async () => {
    setStatus("loading");
    try {
      let result = await check(PERMISSION);
      if (result === RESULTS.DENIED) result = await request(PERMISSION);
      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        const coords = await getPosition();
        await AsyncStorage.multiSet([
          ["ONLATI", String(coords.latitude)],
          ["ONLONGI", String(coords.longitude)],
        ]);
        setQibla(qiblaBearing(coords.latitude, coords.longitude));
        setStatus("ready");
        return;
      }
      if (!(await applySavedLocation())) setStatus("blocked");
    } catch (e) {
      if (!(await applySavedLocation())) setStatus("error");
    }
  };

  const selectDial = (i) => {
    setDialIndex(i);
    AsyncStorage.setItem(DIAL_STORAGE_KEY, String(i)).catch(() => {});
  };

  const turn = qibla === null ? 0 : turnBy(heading, qibla);
  const aligned = qibla !== null && Math.abs(turn) <= ALIGN_TOLERANCE;

  useEffect(() => {
    if (aligned && !wasAligned.current) Vibration.vibrate(80);
    wasAligned.current = aligned;
  }, [aligned]);

  const guidance = !hasCompass
    ? "This device has no compass sensor"
    : aligned
      ? "You are facing the Qibla"
      : `Turn ${turn > 0 ? "right" : "left"} ${Math.round(Math.abs(turn))}°`;

  const renderBody = () => {
    if (status === "loading") {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.textPrimary} />
          <Text style={styles.helperText}>Finding your location…</Text>
        </View>
      );
    }
    if (status === "blocked" || status === "error") {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.messageTitle}>
            {status === "blocked" ? "Location access is off" : "Couldn't get your location"}
          </Text>
          <Text style={styles.helperText}>
            Your location is needed to calculate the Qibla direction.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={status === "blocked" ? () => openSettings().catch(() => {}) : locate}
            accessibilityRole="button">
            <Text style={styles.primaryButtonText}>{status === "blocked" ? "Open Settings" : "Try Again"}</Text>
          </TouchableOpacity>
          {status === "blocked" ? (
            <TouchableOpacity onPress={locate} accessibilityRole="button" style={styles.linkButton}>
              <Text style={styles.linkText}>I've enabled it</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }

    return (
      <>
        <View style={styles.readout} accessible accessibilityLabel={`Qibla is ${Math.round(qibla)} degrees from north. ${guidance}`}>
          <Text style={styles.bearing}>{Math.round(qibla)}°</Text>
          <Text style={styles.bearingCaption}>Qibla from North</Text>
          <View style={[styles.guidancePill, aligned && styles.guidancePillAligned]}>
            <Text style={[styles.guidanceText, aligned && styles.guidanceTextAligned]}>{guidance}</Text>
          </View>
        </View>

        <View style={styles.compassArea}>
          <View style={[styles.pointer, { borderBottomColor: aligned ? Colors.gold : Colors.textPrimary }]} />
          <View
            style={{ width: compassSize, height: compassSize, transform: [{ rotate: `${-heading}deg` }] }}
            importantForAccessibility="no-hide-descendants">
            <Image
              source={dials[dialIndex] || dials[0]}
              style={[
                styles.face,
                {
                  width: compassSize * 0.74,
                  height: compassSize * 0.74,
                  borderRadius: compassSize * 0.37,
                  left: compassSize * 0.13,
                  top: compassSize * 0.13,
                  transform: [{ rotate: `${qibla - ARTWORK_POINTER_DEG}deg` }],
                },
              ]}
            />
            <CompassRing size={compassSize} qibla={qibla} Colors={Colors} />
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <View style={styles.body}>{renderBody()}</View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Text style={styles.tip}>Hold your phone flat and away from metal objects for best accuracy.</Text>
        <View style={styles.dialRow}>
          {dials.map((src, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => selectDial(i)}
              style={[styles.dialThumb, dialIndex === i && styles.dialThumbActive]}
              accessibilityRole="button"
              accessibilityLabel={`Compass style ${i + 1}`}
              accessibilityState={{ selected: dialIndex === i }}>
              <Image source={src} style={styles.dialThumbImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    body: { flex: 1, paddingHorizontal: Spacing.xl },
    centerBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.md },
    messageTitle: {
      fontSize: TypeScale.title,
      fontFamily: Fonts.heading,
      color: Colors.heading,
      textAlign: "center",
    },
    helperText: {
      fontSize: TypeScale.body,
      fontFamily: Fonts.body,
      color: Colors.textSecondary,
      textAlign: "center",
    },
    primaryButton: {
      marginTop: Spacing.sm,
      backgroundColor: Colors.button,
      paddingHorizontal: Spacing.xl,
      minHeight: 48,
      borderRadius: Radius.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: { color: Colors.onButton, fontSize: TypeScale.subtitle, fontFamily: Fonts.bodyBold },
    linkButton: { padding: Spacing.sm },
    linkText: { color: Colors.textSecondary, fontSize: TypeScale.body, fontFamily: Fonts.bodySemiBold },
    readout: { alignItems: "center", paddingTop: Spacing.xl },
    bearing: { fontSize: 44, fontFamily: Fonts.heading, color: Colors.heading },
    bearingCaption: { fontSize: TypeScale.small, fontFamily: Fonts.body, color: Colors.textSecondary },
    guidancePill: {
      marginTop: Spacing.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.accent,
    },
    guidancePillAligned: { backgroundColor: Colors.gold, borderColor: Colors.gold },
    guidanceText: { fontSize: TypeScale.body, fontFamily: Fonts.bodySemiBold, color: Colors.textPrimary },
    guidanceTextAligned: { color: Colors.black },
    compassArea: { flex: 1, alignItems: "center", justifyContent: "center" },
    pointer: {
      width: 0,
      height: 0,
      marginBottom: Spacing.sm,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 16,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
    },
    face: { position: "absolute" },
    footer: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.lg,
      alignItems: "center",
      gap: Spacing.md,
    },
    tip: {
      fontSize: TypeScale.small,
      fontFamily: Fonts.body,
      color: Colors.onSurface,
      textAlign: "center",
    },
    dialRow: { flexDirection: "row", gap: Spacing.md },
    dialThumb: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    dialThumbActive: { borderColor: Colors.gold },
    dialThumbImage: { width: 52, height: 52, borderRadius: 26 },
  });

export default QiblaCompass;
