import React, {useEffect, useRef} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  AppState,
  Animated,
  Dimensions,
} from 'react-native';

import {useNetwork} from './NetworkProvider';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const NetworkStatus = () => {
  const {
    isConnected,
    isInternetReachable,
    checkInternetSpeed,
  } = useNetwork();

  const isOffline =
    isConnected === false ||
    isInternetReachable === false;

  const slideAnim = useRef(
    new Animated.Value(SCREEN_HEIGHT),
  ).current;

  const openWifiSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        await Linking.sendIntent(
          'android.settings.WIFI_SETTINGS',
        );
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.log(
        'Unable to open settings:',
        error,
      );

      try {
        await Linking.openSettings();
      } catch (e) {
        console.log(
          'Unable to open app settings:',
          e,
        );
      }
    }
  };

  const retryConnection = () => {
    console.log(
      'Checking internet connection...',
    );

    checkInternetSpeed();
  };

  /*
   * Show / hide bottom sheet
   */
  useEffect(() => {
    if (isOffline) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, slideAnim]);

  /*
   * Check internet when app comes back
   * from Wi-Fi settings / background.
   */
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      nextState => {
        if (nextState === 'active') {
          console.log(
            'App became active - checking internet...',
          );

          checkInternetSpeed();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkInternetSpeed]);

  return (
    <Animated.View
      pointerEvents={isOffline ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: slideAnim,
            },
          ],
        },
      ]}>

      <View style={styles.handle} />

      <Text style={styles.title}>
        No Internet Connection
      </Text>

      <Text style={styles.description}>
        Please check your internet connection
        and try again.
      </Text>

      <View style={styles.buttonsContainer}>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.retryButton}
          onPress={retryConnection}>

          <Text style={styles.retryText}>
            Retry
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.settingsButton}
          onPress={openWifiSettings}>

          <Text style={styles.settingsText}>
            Open Wi-Fi Settings
          </Text>

        </TouchableOpacity>

      </View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({

  container: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 999999,
    elevation: 999999,

    backgroundColor: '#FFFFFF',

    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    elevation: 20,
  },

  handle: {
    width: 45,
    height: 5,

    borderRadius: 3,

    backgroundColor: '#D0D0D0',

    alignSelf: 'center',

    marginBottom: 18,
  },

  title: {
    fontSize: 20,

    fontWeight: '700',

    color: '#222222',

    textAlign: 'center',

    marginBottom: 8,
  },

  description: {
    fontSize: 14,

    color: '#777777',

    textAlign: 'center',

    lineHeight: 21,

    marginBottom: 20,
  },

  buttonsContainer: {
    width: '100%',
  },

  retryButton: {
    width: '100%',
    height: 48,

    borderRadius: 24,

    backgroundColor: '#281658',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
  },

  retryText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '700',
  },

  settingsButton: {
    width: '100%',
    height: 48,

    borderRadius: 24,

    borderWidth: 1,

    borderColor: '#281658',

    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsText: {
    color: '#281658',

    fontSize: 16,

    fontWeight: '600',
  },
});

export default NetworkStatus;