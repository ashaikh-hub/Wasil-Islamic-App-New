import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StatusBar, StyleSheet, Platform, BackHandler, PermissionsAndroid, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { useTheme, Spacing } from '../../theme';
import { ScreenState } from '../../components';
import AzanSetupComponent, { runAzanSetup } from '../../services/azan/AzanSetupComponent';
import { getSavedCoords, refreshLocation } from '../../services/location';
import { adjustedHijri } from './prayerTimes';
import PrayerHeader from './PrayerHeader';
import ContinueCards from './ContinueCards';
import QuickActions from './QuickActions';
import { StoriesRail, RecitersRail, RemembranceRail } from './HomeRails';
import SupportCard from './SupportCard';
import DidYouKnow from './DidYouKnow';

const LOCATION_IQ_KEY = 'pk.9c1fc2948e48c019aee6f13b6a961796';

const requestNotificationPermission = async () => {
  if (Platform.OS !== 'android' || Platform.Version < 33) return;
  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, {
      title: 'Allow Azan notifications',
      message: 'Wasil needs notification access to alert you at prayer times.',
      buttonPositive: 'Allow',
    });
  } catch (e) {
    // The user can still enable notifications from system settings.
  }
};

// Address is a nice-to-have: a failed lookup must never block prayer times.
const lookupAddress = async ({ lat, lon }) => {
  try {
    const { data } = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${LOCATION_IQ_KEY}&lat=${lat}&lon=${lon}&format=json`);
    const a = data?.address || {};
    return a.city || a.state || a.country || '';
  } catch (e) {
    return '';
  }
};

const HomeNew = ({ navigation }) => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const hasFocusedOnce = useRef(false);

  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState('');
  const [address, setAddress] = useState('');
  const [gregorianDate, setGregorianDate] = useState(moment().format('dddd, MMM D, YYYY'));

  const load = useCallback(async (coords) => {
    const where = coords || (await getSavedCoords());
    const date = moment().format('DD-MM-YYYY');
    try {
      const [{ data }, place, offset] = await Promise.all([
        axios.get(`https://api.aladhan.com/v1/timings/${date}?latitude=${where.lat}&longitude=${where.lon}&school=1`),
        lookupAddress(where),
        AsyncStorage.getItem('HIJRI_OFFSET'),
      ]);
      setTimings(data.data.timings);
      setHijriDate(adjustedHijri(data.data.date.hijri, parseInt(offset, 10) || 0));
      setGregorianDate(moment().format('dddd, MMM D, YYYY'));
      setAddress(place);
      setStatus('ready');
    } catch (e) {
      setStatus((prev) => (prev === 'ready' ? prev : 'error'));
    }
  }, []);

  useEffect(() => {
    runAzanSetup();
    requestNotificationPermission();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnce.current) runAzanSetup();
      hasFocusedOnce.current = true;
      load();
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert('Exit Wasil', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      });
      return () => sub.remove();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onLocationPress = async () => {
    setLocating(true);
    try {
      const coords = await refreshLocation();
      if (coords) await load(coords);
      else Alert.alert('Location unavailable', 'Allow location access in Settings to get prayer times for where you are.');
    } finally {
      setLocating(false);
    }
  };

  const retry = () => {
    setStatus('loading');
    load();
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      {status !== 'ready' ? (
        <ScreenState
          status={status}
          title={status === 'error' ? 'Couldn’t load prayer times' : undefined}
          message={status === 'error' ? 'Check your internet connection and try again.' : undefined}
          onRetry={retry}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl * 2 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.textPrimary} colors={[Colors.accent]} />}>
          <PrayerHeader
            timings={timings}
            hijriDate={hijriDate}
            gregorianDate={gregorianDate}
            address={address}
            onLocationPress={onLocationPress}
            locating={locating}
            onViewAll={() => navigation.navigate('PrayerGuide')}
          />
          <ContinueCards />
          <QuickActions navigation={navigation} />
          <StoriesRail navigation={navigation} />
          <RecitersRail navigation={navigation} />
          <RemembranceRail navigation={navigation} />
          <DidYouKnow />
          <SupportCard navigation={navigation} />
        </ScrollView>
      )}
      <AzanSetupComponent />
    </View>
  );
};

export default HomeNew;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
  });
