import React, { useEffect } from 'react';
import { AppState, Platform, ToastAndroid, NativeModules } from 'react-native';
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

export const runAzanSetup = async () => {
  try {
    const lat = await AsyncStorage.getItem('ONLATI') || '24.860735';
    const lon = await AsyncStorage.getItem('ONLONGI') || '67.001137';
    const date = moment().format('DD-MM-YYYY');

    const res = await axios.get(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&school=1`);
    const timings = res.data.data.timings;

    const toggleString = await AsyncStorage.getItem('azan_prayer_toggles');
    const toggles = toggleString ? JSON.parse(toggleString) : defaultToggles;

    const today = moment().format("YYYY-MM-DD");
    Object.entries(timings).forEach(([prayer, timeStr]) => {
          if (!toggles[prayer]) return;
    
          const raw = `${today} ${timeStr}:00`;
          const target = moment(raw, "YYYY-MM-DD HH:mm:ss");
    
          if (target.isBefore(moment())) {
            target.add(1, 'day');
          }
    
          const fullTime = target.format("YYYY-MM-DD HH:mm:ss");
          AzanScheduler.scheduleAzan(prayer, fullTime);
          AzanScheduler.savePrayerTime?.(prayer, fullTime);
          console.log(`📅 Scheduled ${prayer} at ${fullTime}`);
        });
  }
  
  catch (err) {
    console.error('❌ Azan setup failed:', err);
  }
};

const AzanSetupComponent = () => {
 useEffect(() => {
    let timeoutId;

    const checkPermissionAndSchedule = async () => {
      const granted = await AzanScheduler?.canScheduleAlarms?.();
      if (granted) {
        console.log('✅ Exact alarm permission granted — scheduling Azan');
        runAzanSetup();
      } else {
        console.log('🚨 Exact alarm permission not granted. Requesting...');
        ToastAndroid.show('Please allow "Alarms & Reminders" then return to the app.', ToastAndroid.LONG);
        AzanScheduler?.openExactAlarmPermissionSettings?.();
      }
    };

    const handleAppStateChange = async (nextState) => {
      if (nextState === 'active') {
        const granted = await AzanScheduler?.canScheduleAlarms?.();
        if (granted) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            console.log('🔁 Returned from permission screen — re-running Azan setup');
            runAzanSetup();
          }, 300);
        } else {
          console.log('🚫 Returned from settings — still no permission');
        }
      }
    };

    checkPermissionAndSchedule();

    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    // ✅ Proper cleanup
    return () => {
      appStateListener.remove?.();
      clearTimeout(timeoutId);
    };
  }, []);


  return null;
};

export default AzanSetupComponent;
