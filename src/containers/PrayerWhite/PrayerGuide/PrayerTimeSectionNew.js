import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../theme';
import { runAzanSetup } from '../../../services/azan/AzanSetupComponent';
const HomeBannerImage = { uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1785021168/prayerwhitethemebg.png' };

export default class PrayerTimeSectionNew extends React.PureComponent {
  togglePrayer = async (name, value) => {
    const updated = {
      ...this.props.toggles,
      [name]: value,
    };

    await AsyncStorage.setItem(
      'azan_prayer_toggles',
      JSON.stringify(updated)
    );

    this.props.onToggle(updated);
    runAzanSetup();
  };

  render() {
    const { prayerTimes, icons } = this.props;

    const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
      <ImageBackground source={HomeBannerImage} imageStyle={{borderRadius:10}} style={styles.card}>

        {mainPrayers.map(prayer => (
          <View key={prayer} style={styles.item}>
            <Text style={{fontFamily:"NunitoSans-SemiBold",fontSize:12,color:Colors.white}}>{prayer}</Text>
            <View style={{top:5}}>
            {icons[prayer]}
            </View>
            
            <Text style={{fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",fontSize:14,top:8,color:Colors.white,fontWeight:"600"}}>{prayerTimes[prayer]}</Text>

          </View>
        ))}

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
 card: {
  marginTop: Platform.OS === 'ios' ? 14 : 25,
  width: '98%',
  height: 90,
  left:7,
  alignSelf: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 4,
  top: Platform.OS === 'ios' ? 160 : 160,
  overflow: 'hidden',
  position: 'absolute',
  zIndex: 10,
},
 item: {
  flex: 1,
  alignItems: 'center',
  top: 10,
},
});
