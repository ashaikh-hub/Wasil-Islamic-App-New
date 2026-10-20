import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  NativeModules,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';

import { Colors } from '../../../theme';

import {
  WasilNewPrayerFajrSvg,
  WasilNewPrayerDhuhrSvg,
  WasilNewPrayerAsrSvg,
  WasilNewPrayerMaghribSvg,
  WasilNewPrayerIshaSvg,
  WasilNewArrowUnopenSvg,
  WasilNewArrowOpenSvg,
  WasilNewFajrIcon,
  WasilNewDhuhrIcon,
  WasilNewMagrhibIcon,
  WasilNewIshaIcon,
} from '../../../assets/icons';

import PrayerHeader from './PrayerHeader';
import PrayerTimeSectionNew from './PrayerTimeSectionNew';

const { AzanScheduler } = NativeModules;

const TEST_MODE = false;

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const DEFAULT_LATITUDE = '24.8607';
const DEFAULT_LONGITUDE = '67.0011';

// Move this key to a secure configuration/backend before production.
const LOCATIONIQ_API_KEY = 'pk.9c1fc2948e48c019aee6f13b6a961796';

const PrayerGuide = ({ navigation }) => {
  const locationWatchId = useRef(null);
  const isMounted = useRef(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [address, setAddress] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  const [prayerTimes, setPrayerTimes] = useState({});
  const [hijriDate, setHijriDate] = useState('');

  const [prayerToggles, setPrayerToggles] = useState({
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  });

  const [expandedPrayer, setExpandedPrayer] = useState(null);

  /*
   * ---------------------------------------------------------
   * DATES
   * ---------------------------------------------------------
   */

  const gregorianDate = useMemo(
    () => moment().format('dddd, MMM D, YYYY'),
    []
  );

  /*
   * ---------------------------------------------------------
   * PRAYER DATA
   * ---------------------------------------------------------
   */

  const prayerSections = useMemo(
    () => [
      {
        key: 'Fajr',
        english: 'Fajr',
        arabic: 'فجر',
        icon: <WasilNewPrayerFajrSvg />,
        height: 150,
        items: [
          {
            title: 'Sunnah: 2 rak’ah',
            route: 'FajrSunnah',
            primary: true,
          },
          {
            title: 'Farz: 2 rak’ah',
            route: 'FajrFarz',
            primary: false,
          },
        ],
      },

      {
        key: 'Dhuhr',
        english: 'Dhuhr',
        arabic: 'ظہر',
        icon: <WasilNewPrayerDhuhrSvg />,
        height: 250,
        items: [
          {
            title: 'Sunnah: 4 rak’ah',
            route: 'DhuhrFirst4Sunnah',
            primary: true,
          },
          {
            title: 'Farz: 4 rak’ah',
            route: 'DhuhrFirst4Farz',
            primary: false,
          },
          {
            title: 'Sunnah: 2 rak’ah',
            route: 'Dhuhr2Sunnah',
            primary: false,
          },
          {
            title: 'Nafil: 2 rak’ah',
            route: 'Dhuhr2Nafil',
            primary: false,
          },
        ],
      },

      {
        key: 'Asr',
        english: 'Asr',
        arabic: 'عصر',
        icon: <WasilNewPrayerAsrSvg />,
        height: 150,
        items: [
          {
            title: 'Sunnah: 4 rak’ah',
            route: 'AsrFirst4Sunnah',
            primary: true,
          },
          {
            title: 'Farz: 4 rak’ah',
            route: 'AsrFirst4Farz',
            primary: false,
          },
        ],
      },

      {
        key: 'Maghrib',
        english: 'Maghrib',
        arabic: 'مغرب',
        icon: <WasilNewPrayerMaghribSvg />,
        height: 180,
        items: [
          {
            title: 'Farz: 3 rak’ah',
            route: 'MaghribFarz',
            primary: true,
          },
          {
            title: 'Sunnah: 2 rak’ah',
            route: 'Maghrib2Sunnah',
            primary: false,
          },
          {
            title: 'Nafil: 2 rak’ah',
            route: 'Maghrib2Nafil',
            primary: false,
          },
        ],
      },

      {
        key: 'Isha',
        english: 'Isha',
        arabic: 'عشاء',
        icon: <WasilNewPrayerIshaSvg />,
        height: 380,
        items: [
          {
            title: 'Sunnah: 4 rak’ah',
            route: 'IshaFirst4Sunnah',
            primary: true,
          },
          {
            title: 'Farz: 4 rak’ah',
            route: 'IshaFirst4Farz',
            primary: false,
          },
          {
            title: 'Sunnah: 2 rak’ah',
            route: 'Isha2Sunnah',
            primary: false,
          },
          {
            title: 'Nafil: 2 rak’ah',
            route: 'Isha2Nafil',
            primary: false,
          },
          {
            title: 'Witr: 3 rak’ah',
            route: 'IshaWitr',
            primary: false,
          },
          {
            title: 'Nafil: 2 rak’ah',
            route: 'IshaLast2Nafil',
            primary: false,
          },
        ],
      },
    ],
    []
  );

  /*
   * ---------------------------------------------------------
   * LOAD SAVED AZAN TOGGLES
   * ---------------------------------------------------------
   */

  const loadPrayerToggles = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('azan_prayer_toggles');

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);

      if (!parsed || typeof parsed !== 'object') {
        return;
      }

      const cleanedToggles = {
        Fajr:
          typeof parsed.Fajr === 'boolean'
            ? parsed.Fajr
            : true,

        Dhuhr:
          typeof parsed.Dhuhr === 'boolean'
            ? parsed.Dhuhr
            : true,

        Asr:
          typeof parsed.Asr === 'boolean'
            ? parsed.Asr
            : true,

        Maghrib:
          typeof parsed.Maghrib === 'boolean'
            ? parsed.Maghrib
            : true,

        Isha:
          typeof parsed.Isha === 'boolean'
            ? parsed.Isha
            : true,
      };

      if (isMounted.current) {
        setPrayerToggles(cleanedToggles);
      }
    } catch (err) {
      console.error('Failed to load prayer toggles:', err);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * GET LOCATION ONCE
   * ---------------------------------------------------------
   */

  const getOneTimeLocation = useCallback(() => {
    setLocationStatus('Getting Location...');

    Geolocation.getCurrentPosition(
      position => {
        if (!isMounted.current) {
          return;
        }

        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;

        setLatitude(String(currentLatitude));
        setLongitude(String(currentLongitude));
        setLocationStatus('You are Here');

        /*
         * Save location for future API calls.
         */
        AsyncStorage.multiSet([
          ['ONLATI', String(currentLatitude)],
          ['ONLONGI', String(currentLongitude)],
        ]).catch(err => {
          console.warn('Unable to save location:', err);
        });
      },

      locationError => {
        console.warn('Location error:', locationError);

        if (isMounted.current) {
          setLocationStatus(locationError?.message || 'Unable to get location');
        }
      },

      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  }, []);

  /*
   * ---------------------------------------------------------
   * LOCATION WATCH
   * ---------------------------------------------------------
   */

  const subscribeLocation = useCallback(() => {
    if (locationWatchId.current !== null) {
      return;
    }

    locationWatchId.current = Geolocation.watchPosition(
      position => {
        if (!isMounted.current) {
          return;
        }

        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;

        setLatitude(String(currentLatitude));
        setLongitude(String(currentLongitude));
        setLocationStatus('You are Here');
      },

      locationError => {
        console.warn('Location watch error:', locationError);

        if (isMounted.current) {
          setLocationStatus(locationError?.message || 'Location unavailable');
        }
      },

      {
        enableHighAccuracy: false,
        distanceFilter: 100,
        interval: 10000,
        fastestInterval: 5000,
        maximumAge: 1000,
      }
    );
  }, []);

  /*
   * ---------------------------------------------------------
   * REQUEST LOCATION PERMISSION
   * ---------------------------------------------------------
   */

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to access your location.',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getOneTimeLocation();
        subscribeLocation();
      } else {
        setLocationStatus('Permission Denied');
      }
    } catch (err) {
      console.warn('Location permission error:', err);
      setLocationStatus('Unable to request location permission');
    }
  }, [getOneTimeLocation, subscribeLocation]);

  /*
   * ---------------------------------------------------------
   * API
   * ---------------------------------------------------------
   */

 const fetchHomeData = useCallback(async () => {
  try {
    if (isMounted.current) {
      setIsLoading(true);
      setError(null);
    }

    const storedLatitude =
      await AsyncStorage.getItem('ONLATI');

    const storedLongitude =
      await AsyncStorage.getItem('ONLONGI');

    const lat =
      storedLatitude || DEFAULT_LATITUDE;

    const lon =
      storedLongitude || DEFAULT_LONGITUDE;

    if (isMounted.current) {
      setLatitude(lat);
      setLongitude(lon);
    }

    const date =
      moment().format('DD-MM-YYYY');

    /*
     * Prayer time request.
     */
    const prayerResponse =
      await axios.get(
        `https://api.aladhan.com/v1/timings/${date}`,
        {
          params: {
            latitude: lat,
            longitude: lon,
            school: 1,
          },
          timeout: 15000,
        }
      );

    const prayerData =
      prayerResponse?.data?.data;

    if (!prayerData) {
      throw new Error(
        'Prayer timings were not returned by the server.'
      );
    }

    const timings =
      prayerData.timings || {};

    /*
     * Hijri date.
     *
     * IMPORTANT:
     * Do not use Moment to parse the Hijri date.
     * Aladhan already provides the Hijri
     * day/month/year separately.
     */

    const offsetString =
      await AsyncStorage.getItem(
        'HIJRI_OFFSET'
      );

    const parsedOffset =
      parseInt(offsetString, 10);

    const hijriOffset =
      Number.isNaN(parsedOffset)
        ? 0
        : parsedOffset;

    // ---------------------------------------
    // Original Hijri date from Aladhan
    // ---------------------------------------

    let hijriDay =
      parseInt(
        prayerData.date.hijri.day,
        10
      );

    let hijriMonth =
      parseInt(
        prayerData.date.hijri.month.number,
        10
      );

    let hijriYear =
      parseInt(
        prayerData.date.hijri.year,
        10
      );

    // ---------------------------------------
    // Hijri month names
    // ---------------------------------------

    const hijriMonths = [
      'Muharram',
      'Safar',
      'Rabi al-Awwal',
      'Rabi al-Thani',
      'Jumada al-Awwal',
      'Jumada al-Thani',
      'Rajab',
      "Sha'ban",
      'Ramadan',
      'Shawwal',
      "Dhu al-Qi'dah",
      'Dhu al-Hijjah',
    ];

    // ---------------------------------------
    // Get Hijri month days
    // ---------------------------------------

    const getHijriMonthDays = (
      month,
      year
    ) => {
      // Dhu al-Hijjah can have 29 or 30 days
      // depending on the Hijri leap year.

      if (month === 12) {
        const isLeapYear =
          ((11 * year + 14) % 30) < 11;

        return isLeapYear ? 30 : 29;
      }

      // Normal Hijri pattern:
      // Odd months = 30
      // Even months = 29

      return month % 2 === 1
        ? 30
        : 29;
    };

    // ---------------------------------------
    // Apply positive HIJRI_OFFSET
    // ---------------------------------------

    if (hijriOffset > 0) {
      for (
        let i = 0;
        i < hijriOffset;
        i++
      ) {
        hijriDay++;

        const daysInMonth =
          getHijriMonthDays(
            hijriMonth,
            hijriYear
          );

        if (
          hijriDay >
          daysInMonth
        ) {
          hijriDay = 1;
          hijriMonth++;

          if (hijriMonth > 12) {
            hijriMonth = 1;
            hijriYear++;
          }
        }
      }
    }

    // ---------------------------------------
    // Apply negative HIJRI_OFFSET
    // ---------------------------------------

    if (hijriOffset < 0) {
      for (
        let i = 0;
        i > hijriOffset;
        i--
      ) {
        hijriDay--;

        if (hijriDay < 1) {
          hijriMonth--;

          if (hijriMonth < 1) {
            hijriMonth = 12;
            hijriYear--;
          }

          hijriDay =
            getHijriMonthDays(
              hijriMonth,
              hijriYear
            );
        }
      }
    }

    // ---------------------------------------
    // Final formatted Hijri date
    // ---------------------------------------

    const formattedHijriDate =
      `${hijriDay} ` +
      `${hijriMonths[hijriMonth - 1]} ` +
      `${hijriYear}`;

    console.log(
      'Hijri API Date:',
      prayerData.date.hijri.date
    );

    console.log(
      'Hijri Offset:',
      hijriOffset
    );

    console.log(
      'Final Hijri Date:',
      formattedHijriDate
    );

    /*
     * Update prayer data first.
     */
    if (isMounted.current) {
      setPrayerTimes(timings);
      setHijriDate(formattedHijriDate);
    }

    /*
     * Reverse geocoding is optional.
     *
     * Prayer times should still work if
     * LocationIQ fails.
     */
    try {
      const addressResponse =
        await axios.get(
          'https://us1.locationiq.com/v1/reverse',
          {
            params: {
              key: LOCATIONIQ_API_KEY,
              lat,
              lon,
              format: 'json',
            },
            timeout: 10000,
          }
        );

      const addressValue =
        addressResponse?.data?.address?.state ||
        addressResponse?.data?.address?.city ||
        addressResponse?.data?.address?.town ||
        addressResponse?.data?.address?.village ||
        null;

      if (isMounted.current) {
        setAddress(addressValue);
      }
    } catch (addressError) {
      console.warn(
        'Reverse geocoding failed:',
        addressError?.message ||
          addressError
      );

      if (isMounted.current) {
        setAddress(null);
      }
    }

    if (isMounted.current) {
      setIsLoading(false);
    }
  } catch (err) {
    console.error(
      'Prayer API error:',
      err?.response?.data ||
        err?.message ||
        err
    );

    if (isMounted.current) {
      setError(
        err?.message ||
          'Unable to fetch prayer timings. Please try again.'
      );

      setIsLoading(false);
    }
  }
}, []);

  /*
   * ---------------------------------------------------------
   * AZAN SCHEDULING
   * ---------------------------------------------------------
   */

  const scheduleAzans = useCallback((timings, toggles) => {
    if (TEST_MODE) {
      return;
    }

    if (!timings || !AzanScheduler?.scheduleAzan) {
      return;
    }

    const today = moment().format('YYYY-MM-DD');

    PRAYER_NAMES.forEach(prayer => {
      const timeString = timings[prayer];

      if (!timeString) {
        return;
      }

      if (!toggles?.[prayer]) {
        return;
      }

      /*
       * Aladhan sometimes returns values like:
       * 05:12
       * 05:12 (PKT)
       *
       * We only need HH:mm.
       */
      const cleanTime = String(timeString)
        .trim()
        .substring(0, 5);

      if (!/^\d{2}:\d{2}$/.test(cleanTime)) {
        return;
      }

      const target = moment(
        `${today} ${cleanTime}:00`,
        'YYYY-MM-DD HH:mm:ss'
      );

      if (!target.isValid()) {
        return;
      }

      /*
       * If today's prayer already passed,
       * schedule it for tomorrow.
       */
      if (target.isBefore(moment())) {
        target.add(1, 'day');
      }

      const fullTime = target.format('YYYY-MM-DD HH:mm:ss');

      try {
        AzanScheduler.scheduleAzan(prayer, fullTime);

        if (AzanScheduler.savePrayerTime) {
          AzanScheduler.savePrayerTime(prayer, fullTime);
        }

        console.log(
          `Scheduled ${prayer} Azan at ${fullTime}`
        );
      } catch (scheduleError) {
        console.warn(
          `Unable to schedule ${prayer}:`,
          scheduleError
        );
      }
    });
  }, []);

  /*
   * ---------------------------------------------------------
   * TOGGLE AZAN
   * ---------------------------------------------------------
   */

  const togglePrayerAzan = useCallback(
    async (prayer, value) => {
      if (!PRAYER_NAMES.includes(prayer)) {
        return;
      }

      const updatedToggles = {
        ...prayerToggles,
        [prayer]: Boolean(value),
      };

      setPrayerToggles(updatedToggles);

      try {
        await AsyncStorage.setItem(
          'azan_prayer_toggles',
          JSON.stringify(updatedToggles)
        );
      } catch (storageError) {
        console.warn(
          'Unable to save prayer toggle:',
          storageError
        );
      }

      /*
       * Cancel existing schedule first.
       */
      try {
        if (AzanScheduler?.cancelAzan) {
          AzanScheduler.cancelAzan(prayer);
        }
      } catch (cancelError) {
        console.warn(
          `Unable to cancel ${prayer}:`,
          cancelError
        );
      }

      /*
       * Schedule again if enabled.
       */
      if (value && prayerTimes?.[prayer]) {
        const cleanTime = String(prayerTimes[prayer])
          .trim()
          .substring(0, 5);

        const today = moment().format('YYYY-MM-DD');

        const target = moment(
          `${today} ${cleanTime}:00`,
          'YYYY-MM-DD HH:mm:ss'
        );

        if (target.isValid()) {
          if (target.isBefore(moment())) {
            target.add(1, 'day');
          }

          const fullTime = target.format(
            'YYYY-MM-DD HH:mm:ss'
          );

          try {
            AzanScheduler?.scheduleAzan?.(
              prayer,
              fullTime
            );

            AzanScheduler?.savePrayerTime?.(
              prayer,
              fullTime
            );

            console.log(
              `Rescheduled ${prayer} at ${fullTime}`
            );
          } catch (scheduleError) {
            console.warn(
              `Unable to reschedule ${prayer}:`,
              scheduleError
            );
          }
        }
      }
    },
    [prayerToggles, prayerTimes]
  );

  /*
   * ---------------------------------------------------------
   * CURRENT PRAYER
   * ---------------------------------------------------------
   */

  const getCurrentPrayer = useCallback(() => {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) {
      return {
        currentPrayer: 'Fajr',
        currentTime: '',
      };
    }

    const now = moment();

    let currentPrayer = 'Isha';
    let currentTime = prayerTimes.Isha || '';

    for (const prayer of PRAYER_NAMES) {
      const timeString = prayerTimes[prayer];

      if (!timeString) {
        continue;
      }

      const cleanTime = String(timeString)
        .trim()
        .substring(0, 5);

      const prayerMoment = moment(cleanTime, 'HH:mm');

      if (prayerMoment.isSameOrBefore(now)) {
        currentPrayer = prayer;
        currentTime = timeString;
      }
    }

    /*
     * Before Fajr, current prayer is Isha
     * from the previous night.
     */
    const fajrTime = prayerTimes.Fajr
      ? moment(
          String(prayerTimes.Fajr).substring(0, 5),
          'HH:mm'
        )
      : null;

    if (fajrTime && now.isBefore(fajrTime)) {
      currentPrayer = 'Isha';
      currentTime = prayerTimes.Isha || '';
    }

    return {
      currentPrayer,
      currentTime,
    };
  }, [prayerTimes]);

  /*
   * ---------------------------------------------------------
   * NEXT PRAYER
   * ---------------------------------------------------------
   */

  const getNextPrayer = useCallback(() => {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) {
      return {
        nextPrayer: 'Fajr',
        nextPrayerTime: '',
      };
    }

    const now = moment();

    for (const prayer of PRAYER_NAMES) {
      const timeString = prayerTimes[prayer];

      if (!timeString) {
        continue;
      }

      const cleanTime = String(timeString)
        .trim()
        .substring(0, 5);

      const prayerMoment = moment(cleanTime, 'HH:mm');

      if (prayerMoment.isAfter(now)) {
        return {
          nextPrayer: prayer,
          nextPrayerTime: timeString,
        };
      }
    }

    /*
     * All today's prayers passed,
     * therefore next prayer is tomorrow's Fajr.
     */
    return {
      nextPrayer: 'Fajr',
      nextPrayerTime: prayerTimes.Fajr || '',
    };
  }, [prayerTimes]);

  /*
   * ---------------------------------------------------------
   * INITIALIZATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    isMounted.current = true;

    const initialize = async () => {
      await loadPrayerToggles();
      await fetchHomeData();
    };

    initialize();

    return () => {
      isMounted.current = false;
    };
  }, [fetchHomeData, loadPrayerToggles]);

  /*
   * ---------------------------------------------------------
   * LOCATION CLEANUP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      if (locationWatchId.current !== null) {
        Geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * CURRENT PRAYER AUTO UPDATE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) {
      return undefined;
    }

    /*
     * Automatically expand the current prayer once.
     */
    const { currentPrayer } = getCurrentPrayer();

    setExpandedPrayer(currentPrayer);

    /*
     * Recalculate every minute instead of every second.
     */
    const interval = setInterval(() => {
      const { currentPrayer: updatedCurrentPrayer } =
        getCurrentPrayer();

      setExpandedPrayer(updatedCurrentPrayer);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [prayerTimes, getCurrentPrayer]);

  /*
   * ---------------------------------------------------------
   * SCHEDULE AZAN WHEN DATA/TOGGLES CHANGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) {
      return;
    }

    if (!TEST_MODE) {
      scheduleAzans(prayerTimes, prayerToggles);
    }

    if (Platform.OS === 'android') {
      try {
        AzanScheduler?.rescheduleAllAzans?.();
      } catch (err) {
        console.warn(
          'Unable to reschedule Azans:',
          err
        );
      }
    }
  }, [
    prayerTimes,
    prayerToggles,
    scheduleAzans,
  ]);

  /*
   * ---------------------------------------------------------
   * ACCORDION
   * ---------------------------------------------------------
   */

  const handlePrayerPress = useCallback(prayer => {
    setExpandedPrayer(previous => {
      if (previous === prayer) {
        return null;
      }

      return prayer;
    });
  }, []);

  /*
   * ---------------------------------------------------------
   * REFRESH
   * ---------------------------------------------------------
   */

  const handleRetry = useCallback(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  /*
   * ---------------------------------------------------------
   * HEADER DATA
   * ---------------------------------------------------------
   */

  const {
    nextPrayer,
    nextPrayerTime,
  } = getNextPrayer();

  const {
    currentPrayer,
    currentTime,
  } = getCurrentPrayer();

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: Colors.white,
          },
        ]}
      >
        <StatusBar
          backgroundColor={Colors.black}
        />

        <ActivityIndicator
          size="large"
          color={
            Colors.wasilnewthemecolorsecond ||
            Colors.primary ||
            Colors.black
          }
        />

        <Text style={styles.loadingText}>
          Loading prayer times...
        </Text>
      </View>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error) {
    return (
      <View
        style={[
          styles.errorContainer,
          {
            backgroundColor: Colors.white,
          },
        ]}
      >
        <StatusBar
          backgroundColor={
            Colors.black
          }
          barStyle="light-content"
        />

        <Text style={styles.errorTitle}>
          Unable to load prayer times
        </Text>

        <Text style={styles.errorMessage}>
          {error}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleRetry}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN UI
   * ---------------------------------------------------------
   */

  return (
    <View
      style={[
        styles.containerMain,
        {
          backgroundColor: Colors.white,
        },
      ]}
    >
      <StatusBar
        backgroundColor={
          Colors.black
        }
        barStyle="light-content"
      />

      <PrayerHeader
        navigation={navigation}
        hijriDate={hijriDate}
        gregorianDate={gregorianDate}
        address={address}
        nextPrayer={nextPrayer}
        nextPrayerTime={nextPrayerTime}
        currentPrayer={currentPrayer}
        currentTime={currentTime}
      />

      <PrayerTimeSectionNew
        prayerTimes={prayerTimes}
        icons={{
          Fajr: <WasilNewFajrIcon />,
          Dhuhr: <WasilNewDhuhrIcon />,
          Asr: <WasilNewFajrIcon />,
          Maghrib: <WasilNewMagrhibIcon />,
          Isha: <WasilNewIshaIcon />,
        }}
        onToggle={togglePrayerAzan}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.prayerListContainer}>
          {prayerSections.map(section => {
            const isExpanded =
              expandedPrayer === section.key;

            return (
              <PrayerAccordion
                key={section.key}
                section={section}
                isExpanded={isExpanded}
                onPress={() =>
                  handlePrayerPress(section.key)
                }
                navigation={navigation}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const PrayerAccordion = ({
  section,
  isExpanded,
  onPress,
  navigation,
}) => {
  return (
    <View style={styles.accordionWrapper}>
      <View
        style={[
          styles.prayerHeaderRow,
          isExpanded &&
            styles.prayerHeaderRowExpanded,
        ]}
      >
        <View
          style={[
            styles.prayerIconContainer,
            {
              backgroundColor: isExpanded
                ? Colors.transparent
                : Colors.white,
            },
          ]}
        >
          {section.icon}
        </View>

        <View
          style={[
            styles.prayerEnglishContainer,
            {
              backgroundColor: isExpanded
                ? Colors.transparent
                : Colors.white,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={styles.prayerEnglishText}
          >
            {section.english}
          </Text>
        </View>

        <View
          style={[
            styles.prayerArabicContainer,
            {
              backgroundColor: isExpanded
                ? Colors.transparent
                : Colors.white,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.prayerArabicText,
              {
                color:
                  Colors.wasilnewthemecolorsecond ||
                  Colors.primary ||
                  Colors.secondary,
              },
            ]}
          >
            {section.arabic}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={[
            styles.arrowContainer,
            {
              backgroundColor: isExpanded
                ? Colors.transparent
                : Colors.white,
            },
          ]}
        >
          {isExpanded ? (
            <WasilNewArrowOpenSvg />
          ) : (
            <WasilNewArrowUnopenSvg />
          )}
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View
          style={[
            styles.accordionContent,
            {
              minHeight: section.height,
            },
          ]}
        >
          {section.items.map((item, index) => {
            return (
              <View
                key={`${section.key}-${item.route}-${index}`}
                style={styles.actionRow}
              >
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    navigation.navigate(item.route)
                  }
                  style={[
                    styles.submitButton,
                    item.primary
                      ? styles.submitButtonPrimary
                      : styles.submitButtonSecondary,
                  ]}
                >
                  <Text style={styles.submitText}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
  },

  /*
   * Loading
   */

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: Colors.secondary,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Poppins-Regular'
        : 'Raleway',
  },

  /*
   * Error
   */

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.secondary,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Poppins-Regular'
        : 'Raleway',
  },

  errorMessage: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: Colors.secondary,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Poppins-Regular'
        : 'Raleway',
  },

  retryButton: {
    marginTop: 25,
    minWidth: 130,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor:
      Colors.wasilnewthemecolorsecond ||
      Colors.primary,
  },

  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Poppins-Regular'
        : 'Raleway',
  },

  /*
   * Scroll
   */

  scrollContent: {
    paddingTop: 90,
    paddingBottom:
      Platform.OS === 'ios' ? 0 : 0,
  },

  prayerListContainer: {
    width: '100%',
    paddingBottom: 20,
  },


  accordionWrapper: {
    width: '94%',
    alignSelf: 'center',
    marginBottom: 12,
  },

  prayerHeaderRow: {
    width: '100%',
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    backgroundColor: Colors.transparent,
  },

  prayerHeaderRowExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  prayerIconContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  prayerEnglishContainer: {
    flex: 0.9,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  prayerEnglishText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily:
      Platform.OS === 'ios'
        ? 'Poppins-Regular'
        : 'Raleway',
  },

  prayerArabicContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  prayerArabicText: {
    fontSize: 25,
    textAlign: 'center',
    bottom:6,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Al Qalam Quran Majeed Web'
        : 'AlQalamQuran',
  },

  arrowContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /*
   * Expanded content
   */

  accordionContent: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.bordercolor,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.transparent,
  },

  actionRow: {
    width: '100%',
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },

  /*
   * Buttons
   */

  submitButton: {
    width: '85%',
    minHeight: 42,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },

  submitButtonPrimary: {
    marginTop: 2,
  },

  submitButtonSecondary: {
    marginTop: 2,
  },

  submitText: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios'
        ? 'Poppins-Regular'
        : 'Raleway',
    fontWeight: '400',
  },
});

export default PrayerGuide;