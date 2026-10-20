import React, { useEffect, useRef, useState } from 'react';
import { View, StatusBar, FlatList, StyleSheet, PermissionsAndroid, Animated, Platform, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts, TypeScale, Spacing, Radius, MIN_TOUCH, useScreen } from '../../theme';
import slides from './slides';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';
import Nextbutton from './Nextbutton';

// Used only when the user declines location or it can't be read (Karachi).
const FALLBACK = { lat: '24.860735', lon: '67.115903' };
const CONTROLS_HEIGHT = 96;

const requestPermission = async () => {
  if (Platform.OS === 'ios') return (await Geolocation.requestAuthorization('whenInUse')) === 'granted';
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    title: 'Use your location?',
    message: 'Wasil uses your location for accurate prayer times and the Qibla direction.',
    buttonNegative: 'Not now',
    buttonPositive: 'Allow',
  });
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const currentPosition = () =>
  new Promise((resolve) =>
    Geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: String(coords.latitude), lon: String(coords.longitude) }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    ),
  );

export const Onboarding = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useScreen();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const scrollx = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const isLast = currentIndex === slides.length - 1;

  useEffect(() => {
    const t = setTimeout(() => SplashScreen.hide(), 1000);
    return () => clearTimeout(t);
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Location is requested here, after the user has seen why it's needed, not on the first slide.
  const finish = async () => {
    if (finishing) return;
    setFinishing(true);
    let position = null;
    try {
      if (await requestPermission()) position = await currentPosition();
    } catch (e) {
      // fall back below
    }
    const { lat, lon } = position || FALLBACK;
    try {
      await AsyncStorage.multiSet([
        ['ONLATI', lat],
        ['ONLONGI', lon],
        ['ONBOARDED', 'true'],
      ]);
    } finally {
      navigation.reset({ index: 0, routes: [{ name: 'GuestNew' }] });
    }
  };

  const next = () => (isLast ? finish() : slidesRef.current?.scrollToIndex({ index: currentIndex + 1 }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent />
      <FlatList
        ref={slidesRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollx } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item, index }) => (
          <OnboardingItem
            item={item}
            bottomInset={insets.bottom + CONTROLS_HEIGHT + Spacing.lg}
            note={index === slides.length - 1 ? 'Next, we’ll ask for your location so prayer times and the Qibla are accurate.' : null}
          />
        )}
      />

      {!isLast ? (
        <TouchableOpacity onPress={finish} style={[styles.skip, { top: insets.top + Spacing.sm }]} accessibilityRole="button">
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      ) : null}

      <View style={[styles.controls, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <Paginator data={slides} scrollx={scrollx} />
        {isLast ? (
          <TouchableOpacity style={styles.start} onPress={finish} disabled={finishing} accessibilityRole="button">
            {finishing ? <ActivityIndicator color="#2B1A63" /> : <Text style={styles.startText}>Get Started</Text>}
          </TouchableOpacity>
        ) : (
          <Nextbutton scrollTo={next} percentage={((currentIndex + 1) * 100) / slides.length} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  skip: { position: 'absolute', right: Spacing.lg, minHeight: MIN_TOUCH, paddingHorizontal: Spacing.md, justifyContent: 'center' },
  skipText: { fontSize: TypeScale.body + 1, color: '#FFFFFF', fontFamily: Fonts.bodySemiBold },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: CONTROLS_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  start: {
    minHeight: 52,
    minWidth: 160,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: { fontSize: TypeScale.subtitle, color: '#2B1A63', fontFamily: Fonts.bodyBold },
});

export default Onboarding;
