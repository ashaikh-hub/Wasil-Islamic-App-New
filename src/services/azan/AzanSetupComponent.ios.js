import React, { useEffect, useRef } from 'react';
import { AppState, Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

const { AzanScheduler } = NativeModules;

const defaultToggles = {
  Fajr: true,
  Dhuhr: true,
  Asr: true,
  Maghrib: true,
  Isha: true,
};

// Fetch daily prayer times
const fetchPrayerTimes = async () => {
  try {
    const lat = (await AsyncStorage.getItem('ONLATI')) || '24.8607';
    const lon = (await AsyncStorage.getItem('ONLONGI')) || '67.0011';
    const date = moment().format('DD-MM-YYYY');

    const response = await axios.get(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&school=1`
    );

    const data = response.data?.data?.timings;
    if (!data) throw new Error('Invalid response');

    return {
      Fajr: moment(data.Fajr, 'HH:mm').format('HH:mm'),
      Dhuhr: moment(data.Dhuhr, 'HH:mm').format('HH:mm'),
      Asr: moment(data.Asr, 'HH:mm').format('HH:mm'),
      Maghrib: moment(data.Maghrib, 'HH:mm').format('HH:mm'),
      Isha: moment(data.Isha, 'HH:mm').format('HH:mm'),
    };
  } catch {
    return null;
  }
};

// Schedule Azans
const scheduleAzans = async (timings, toggles, appState) => {
  const today = moment().format('YYYY-MM-DD');

  for (const [prayer, timeStr] of Object.entries(timings)) {
    if (!toggles[prayer]) continue;

    const fullTime = moment(`${today} ${timeStr}:00`, 'YYYY-MM-DD HH:mm:ss').format(
      'YYYY-MM-DD HH:mm:ss'
    );

     console.log(`📅 Scheduling ${prayer} at ${fullTime}`);

    if (AzanScheduler?.scheduleAzan) {
      await AzanScheduler.scheduleAzan(prayer, fullTime);

      // If app is active or background, play full Azan
      if (Platform.OS === 'ios' && (appState === 'active' || appState === 'background')) {
        const delay = moment(fullTime).diff(moment());
        if (delay > 0) {
          setTimeout(() => {
            AzanScheduler.playAzanManually(prayer);
          }, delay);
        }
      }
    }
  }
};

// Permissions + scheduling
const checkPermissionsAndSchedule = async () => {
  if (!AzanScheduler) return;

  try {
    const togglesString = await AsyncStorage.getItem('azan_prayer_toggles');
    const toggles = togglesString ? JSON.parse(togglesString) : defaultToggles;

    const timings = await fetchPrayerTimes();
    if (!timings) return;

    const appState = AppState.currentState;

    if (Platform.OS === 'ios') {
      const granted = await AzanScheduler.requestNotificationPermission();
      if (!granted) return;

      await AzanScheduler.clearAllNotifications();
      await scheduleAzans(timings, toggles, appState);
    } else {
      const granted = await AzanScheduler?.canScheduleAlarms?.();
      if (granted) {
        await AzanScheduler.clearAllNotifications?.();
        await scheduleAzans(timings, toggles, appState);
      } else {
        AzanScheduler?.openExactAlarmPermissionSettings?.();
      }
    }
  } catch {}
};

// Manual trigger (for other screens if needed)
export const runAzanSetup = async () => await checkPermissionsAndSchedule();

// Main component
const AzanSetupComponent = () => {
  const midnightTimeoutRef = useRef(null);

  useEffect(() => {
    checkPermissionsAndSchedule();

    const handleAppStateChange = async (nextState) => {
      if (nextState === 'active') await checkPermissionsAndSchedule();
    };

    const listener = AppState.addEventListener('change', handleAppStateChange);

    // Schedule daily refresh at midnight
    const scheduleMidnightUpdate = () => {
      const now = moment();
      const nextMidnight = moment().endOf('day').add(1, 'second');
      const msUntilMidnight = nextMidnight.diff(now);

      midnightTimeoutRef.current = setTimeout(async () => {
        await checkPermissionsAndSchedule();
        scheduleMidnightUpdate();
      }, msUntilMidnight);
    };

    scheduleMidnightUpdate();

    return () => {
      listener.remove?.();
      if (midnightTimeoutRef.current) clearTimeout(midnightTimeoutRef.current);
    };
  }, []);

  return null;
};

export default AzanSetupComponent;
