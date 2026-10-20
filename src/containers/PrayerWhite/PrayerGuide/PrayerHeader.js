import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
   Dimensions,
   PermissionsAndroid
} from 'react-native';
import Geolocation from "react-native-geolocation-service";
import { Colors } from '../../../theme';
import {
  WasilNewHomeLocation,
} from '../../../assets/icons';

import moment from 'moment';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HomeBannerimage = {
  uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1784929652/prayernewbg.png',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default class PrayerHeader extends React.PureComponent {
  progress = new Animated.Value(0);
  pulse = new Animated.Value(1);
  glow = new Animated.Value(0);
  totalSeconds = 0;
  interval = null;
  watchID = null;

  state = {
    countdown: '',
    locationStatus: '',
    latitude: '24.860735',
    longitude: '67.115903',
  };

  componentDidMount() {
    this.startCountdown();
    this.startPulse();
    this.startGlow();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nextPrayerTime !== this.props.nextPrayerTime) {
      this.startCountdown();
    }
  }

 componentWillUnmount() {
  if (this.interval) clearInterval(this.interval);

  if (this.watchID !== null) {
    Geolocation.clearWatch(this.watchID);
  }

  Geolocation.stopObserving();
}

  startPulse = () => {
    Animated.loop(
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
      ])
    ).start();
  };

  startGlow = () => {
    Animated.loop(
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
      ])
    ).start();
  };

  startCountdown = () => {
    if (this.interval) clearInterval(this.interval);
     if (!this.props.nextPrayerTime) {
    this.setState({ countdown: '--:--:--' });
    return;
  }

  const [hour, minute] = this.props.nextPrayerTime
    .split(':')
    .map(Number);


    const target = moment().hours(hour).minutes(minute).seconds(0);

    let diff = target.diff(moment());
    if (diff < 0) diff += 24 * 60 * 60 * 1000;

    this.totalSeconds = Math.floor(diff / 1000);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    this.interval = setInterval(() => {
      const now = moment();

      let diff = target.diff(now);
      if (diff < 0) diff += 24 * 60 * 60 * 1000;

      const remainingSeconds = Math.floor(diff / 1000);

      const progress = 1 - remainingSeconds / this.totalSeconds;

      Animated.timing(this.progress, {
        toValue: progress,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      const duration = moment.duration(diff);

      this.setState({
        countdown: `${String(duration.hours()).padStart(2, '0')}:${String(
          duration.minutes()
        ).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`,
      });
    }, 1000);
  };

  formatTime12Hour = (time24) => {
    if (!time24) return '';

    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  };

   getOneTimeLocation = () => {
    this.setState({
      locationStatus: 'Getting Location...',
    });
  
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          locationStatus: 'You are Here',
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
  
        console.log(
          'Current Location:',
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      (error) => {
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
  
  subscribeLocationLocation = () => {
    this.watchID = Geolocation.watchPosition(
      (position) => {
        this.setState({
          locationStatus: 'You are Here',
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
  
        console.log(
          'Updated Location:',
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      (error) => {
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
  
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      this.getOneTimeLocation();
      this.subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to access your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
    }
  };

  render() {
    const { hijriDate, gregorianDate, address } = this.props;
    const { countdown } = this.state;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const glowOpacity = this.glow.interpolate({inputRange: [0, 1],outputRange: [0.2, 0.7],});

    return (
      <ImageBackground
        source={HomeBannerimage}
        imageStyle={{resizeMode:"contain",alignSelf:"center"}}
        style={styles.header}
      >
        

        <Animated.View
          style={[
            styles.timerContainer,
            {
              transform: [{ scale: this.pulse }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.glowRing,
              { opacity: glowOpacity },
            ]}
          />

          <Svg width={110} height={110}>
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
              strokeDasharray={circumference}
              strokeDashoffset={this.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [circumference, 0],
              })}
              strokeLinecap="round"
              rotation="-90"
              origin="55, 55"
            />
          </Svg>
          <View style={styles.timerOverlay}>
            <Text style={styles.timerLabel}>Time</Text>
            <Text style={styles.timerText}>{countdown}</Text>
            <Text style={styles.timerLabel}>LEFT</Text>
          </View>
        </Animated.View>
      
       <TouchableOpacity activeOpacity={0.8} onPress={this.requestLocationPermission}>
        <View style={styles.locationBox}>
          <WasilNewHomeLocation />
          <Text style={styles.locationText} numberOfLines={1}>
            {address}
          </Text>
        </View>
        </TouchableOpacity>

        <Text style={styles.hijri}>{hijriDate}</Text>
        <Text style={styles.gregorian}>{gregorianDate}</Text>

        <Text style={styles.nextPrayer}>
          Now: {this.props.currentPrayer}
        </Text>

        <Text style={styles.nextPrayerTime}>
          {this.formatTime12Hour(this.props.currentTime)}
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
    top: Platform.OS === 'ios' ? 30 : 30,
    left: Platform.OS === 'ios' ? 160 : 140,
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
    color: '#fff',
    fontSize: 12,
    fontFamily: 'NunitoSans-Bold',
  },

  timerLabel: {
    color: '#fff',
    fontSize: 10,
  },

  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 15 : 15,
    paddingHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.wasilnewthemecolorsecond,
    maxWidth: '30%',
    backgroundColor: Colors.wasilnewthemecolorsecond,
    left:15
  },
  
  locationText: {
    fontSize: 14,
    marginLeft: 3,
    color: Colors.white,
    flex: 1,
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
    textAlign: 'center',
  },
   locationBox1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : 10,
    borderRadius: 7,
    borderWidth: 1,
    width:100,
    height:20,
    borderColor: Colors.wasilnewthemecolor,
    backgroundColor: Colors.wasilnewthemecolor,
    left:15
  },
  locationText1: {
    fontSize: 8,
    color: Colors.wasilnewthemecolorsecond,
    flex: 1,
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
    textAlign: 'center',
  },

  hijri: {
    fontSize: 13,
    marginTop: 12,
    left:17,
    color: Colors.black,
     fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
  },

  gregorian: {
    fontSize: 9,
    marginTop: 5,
    left:17,
    color: Colors.black,
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
  },

  nextPrayer: {
    marginTop: 6,
    left:17,
    color: Colors.black,
    fontSize: 12,
    
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
  },

  nextPrayerTime: {
    fontSize: 22,
    color: Colors.wasilnewthemecolorsecond,
    marginTop: 3,
    left:17,
    fontFamily: Platform.OS === 'ios' ? "Asul-Bold" : "AsulBold",
  },
  glowRing: {
  position: 'absolute',
  width: 110,
  height: 110,
  borderRadius: 60,
  backgroundColor: Colors.wasilnewthemecolorsecond,
  shadowColor: Colors.wasilnewthemecolor,
  shadowOpacity: 0.8,
  shadowRadius: 20,
  elevation: 10,
},
});