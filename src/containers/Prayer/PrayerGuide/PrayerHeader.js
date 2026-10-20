import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Animated,
  TouchableOpacity,
  Easing,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import {Colors} from '../../../theme';
import {WasilNewHomeLocation} from '../../../assets/icons';

import moment from 'moment';
import Svg, {Circle} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HomeBannerimage = {
  uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1785408753/prayernewbg1.png',
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default class PrayerHeader extends React.PureComponent {
  // --------------------------------------------------
  // Animation / Timer variables
  // --------------------------------------------------

  progress = new Animated.Value(0);
  pulse = new Animated.Value(1);
  glow = new Animated.Value(0);

  interval = null;
  totalSeconds = 0;

  // --------------------------------------------------
  // Location
  // --------------------------------------------------

  watchID = null;

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  state = {
    countdown: '--:--:--',

    locationStatus: '',

    latitude: '24.860735',
    longitude: '67.115903',
  };

  // --------------------------------------------------
  // Component Did Mount
  // --------------------------------------------------

  componentDidMount() {
    this.startCountdown();
    this.startPulse();
    this.startGlow();
  }

  // --------------------------------------------------
  // Component Did Update
  // --------------------------------------------------

  componentDidUpdate(prevProps) {
    if (
      prevProps.nextPrayerTime !==
      this.props.nextPrayerTime
    ) {
      this.startCountdown();
    }
  }

  // --------------------------------------------------
  // Component Will Unmount
  // --------------------------------------------------

  componentWillUnmount() {
    // Stop countdown
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // Stop location watcher
    if (this.watchID !== null) {
      Geolocation.clearWatch(this.watchID);
      this.watchID = null;
    }

    Geolocation.stopObserving();
  }

  // --------------------------------------------------
  // Pulse Animation
  // --------------------------------------------------

  startPulse = () => {
    this.pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.pulse, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(this.pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    this.pulseAnimation.start();
  };

  // --------------------------------------------------
  // Glow Animation
  // --------------------------------------------------

  startGlow = () => {
    this.glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.glow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),

        Animated.timing(this.glow, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),
    );

    this.glowAnimation.start();
  };

  // --------------------------------------------------
  // Countdown
  // --------------------------------------------------

  startCountdown = () => {
    // Clear previous interval
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    const {nextPrayerTime} = this.props;

    if (!nextPrayerTime) {
      this.setState({
        countdown: '--:--:--',
      });

      return;
    }

    const [hour, minute] = nextPrayerTime
      .split(':')
      .map(Number);

    const target = moment()
      .hours(hour)
      .minutes(minute)
      .seconds(0)
      .milliseconds(0);

    let diff = target.diff(moment());

    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    this.totalSeconds = Math.floor(diff / 1000);

    this.interval = setInterval(() => {
      const now = moment();

      let diff = target.diff(now);

      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
      }

      const remainingSeconds = Math.floor(
        diff / 1000,
      );

      const totalSeconds =
        this.totalSeconds || 1;

      const currentProgress =
        1 - remainingSeconds / totalSeconds;

      Animated.timing(this.progress, {
        toValue: currentProgress,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      const duration = moment.duration(diff);

      this.setState({
        countdown: `${String(
          duration.hours(),
        ).padStart(2, '0')}:${String(
          duration.minutes(),
        ).padStart(2, '0')}:${String(
          duration.seconds(),
        ).padStart(2, '0')}`,
      });
    }, 1000);
  };

  // --------------------------------------------------
  // 12 Hour Time
  // --------------------------------------------------

  formatTime12Hour = time24 => {
    if (!time24) {
      return '';
    }

    const [hourStr, minute] =
      time24.split(':');

    let hour = parseInt(hourStr, 10);

    const ampm =
      hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minute} ${ampm}`;
  };

  // --------------------------------------------------
  // Get One Time Location
  // --------------------------------------------------

  getOneTimeLocation = () => {
    this.setState({
      locationStatus: 'Getting Location...',
    });

    Geolocation.getCurrentPosition(
      position => {
        const latitude =
          position.coords.latitude.toString();

        const longitude =
          position.coords.longitude.toString();

        this.setState({
          locationStatus: 'You are Here',
          latitude,
          longitude,
        });

        console.log(
          'Current Location:',
          position.coords.latitude,
          position.coords.longitude,
        );
      },

      error => {
        console.log(
          'Location Error:',
          error,
        );

        this.setState({
          locationStatus: error.message,
        });
      },

      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  // --------------------------------------------------
  // Watch Location
  // --------------------------------------------------

  subscribeLocationLocation = () => {
    this.watchID =
      Geolocation.watchPosition(
        position => {
          const latitude =
            position.coords.latitude.toString();

          const longitude =
            position.coords.longitude.toString();

          this.setState({
            locationStatus: 'You are Here',
            latitude,
            longitude,
          });

          console.log(
            'Updated Location:',
            position.coords.latitude,
            position.coords.longitude,
          );
        },

        error => {
          this.setState({
            locationStatus: error.message,
          });
        },

        {
          enableHighAccuracy: false,
          maximumAge: 1000,
        },
      );
  };

  // --------------------------------------------------
  // Location Permission
  // --------------------------------------------------

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      this.getOneTimeLocation();
      this.subscribeLocationLocation();

      return;
    }

    try {
      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS
            .ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',

            message:
              'This App needs to access your location.',

            buttonNeutral: 'Ask Me Later',

            buttonNegative: 'Cancel',

            buttonPositive: 'OK',
          },
        );

      if (
        granted ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        this.getOneTimeLocation();
        this.subscribeLocationLocation();
      } else {
        this.setState({
          locationStatus: 'Permission Denied',
          latitude: '24.860735',
          longitude: '67.115903',
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  render() {
    const {
      hijriDate,
      gregorianDate,
      address,
      currentPrayer,
      currentTime,
    } = this.props;

    const {
      countdown,
    } = this.state;

    const radius = 40;

    const circumference =
      2 * Math.PI * radius;

    const glowOpacity =
      this.glow.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 0.7],
      });

    const strokeDashoffset =
      this.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [
          circumference,
          0,
        ],
      });

    return (
      <ImageBackground
        source={HomeBannerimage}
        imageStyle={{
          resizeMode: 'contain',
          alignSelf: 'center',
        }}
        style={styles.header}>
        
        {/* Timer */}
        <Animated.View
          style={[
            styles.timerContainer,
            {
              transform: [
                {
                  scale: this.pulse,
                },
              ],
            },
          ]}>
          
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: glowOpacity,
              },
            ]}
          />

          <Svg
            width={110}
            height={110}>
            
            <Circle
              stroke="#ffffff25"
              cx="55"
              cy="55"
              r={radius}
              strokeWidth="6"
              fill="none"
            />

            <AnimatedCircle
              stroke="#352575"
              cx="55"
              cy="55"
              r={radius}
              strokeWidth="6"
              fill="none"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                strokeDashoffset
              }
              strokeLinecap="round"
              rotation="-90"
              origin="55, 55"
            />
          </Svg>

          <View
            style={
              styles.timerOverlay
            }>
            
            <Text
              style={
                styles.timerLabel
              }>
              Time
            </Text>

            <Text
              style={
                styles.timerText
              }>
              {countdown}
            </Text>

            <Text
              style={
                styles.timerLabel
              }>
              LEFT
            </Text>
          </View>
        </Animated.View>

        {/* Location */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={
            this.requestLocationPermission
          }>
          
          <View
            style={
              styles.locationBox
            }>
            
            <WasilNewHomeLocation />

            <Text
              style={
                styles.locationText
              }
              numberOfLines={1}>
              {address}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Dates */}

        <Text style={styles.hijri}>
          {hijriDate}
        </Text>

        <Text
          style={
            styles.gregorian
          }>
          {gregorianDate}
        </Text>

        {/* Current Prayer */}

        <Text
          style={
            styles.nextPrayer
          }>
          Now: {currentPrayer}
        </Text>

        <Text
          style={
            styles.nextPrayerTime
          }>
          {this.formatTime12Hour(
            currentTime,
          )}
        </Text>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: SCREEN_WIDTH,
    height: 180,
    marginTop: 20,
    paddingLeft: 16,
    alignSelf: 'center',
  },

  timerContainer: {
    top: 30,
    left:
      Platform.OS === 'ios'
        ? 160
        : 140,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
  },

  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timerText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily:
      'NunitoSans-Bold',
  },

  timerLabel: {
    color: Colors.white,
    fontSize: 10,
  },

  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor:
      Colors.secondary1,
    maxWidth: '30%',
    backgroundColor:
      Colors.secondary1,
    left: 15,
  },

  locationText: {
    fontSize: 14,
    marginLeft: 3,
    color: Colors.white,
    flex: 1,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Nunito Sans 7pt'
        : 'NunitoSansRegular',
    textAlign: 'center',
  },

  hijri: {
    fontSize: 13,
    marginTop: 12,
    left: 17,
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Nunito Sans 7pt'
        : 'NunitoSansRegular',
  },

  gregorian: {
    fontSize: 9,
    marginTop: 5,
    left: 17,
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Nunito Sans 7pt'
        : 'NunitoSansRegular',
  },

  nextPrayer: {
    marginTop: 6,
    left: 17,
    color: Colors.white,
    fontSize: 12,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Nunito Sans 7pt'
        : 'NunitoSansRegular',
  },

  nextPrayerTime: {
    fontSize: 22,
    color: Colors.white,
    marginTop: 3,
    left: 17,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Asul-Bold'
        : 'AsulBold',
  },

  glowRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor:
      Colors.intermediate1,
    shadowColor:
      Colors.intermediate1,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
});