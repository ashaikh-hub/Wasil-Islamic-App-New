import React from 'react';
import {LogBox,View,StatusBar,StyleSheet,Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FirstRakat from "./FirstRakat"
import SecondRakat from "./SecondRakat"
import { Colors} from '../../../../../theme';
import {WasilNewGPrayerFajrSuunahSvg} from '../../../../../assets/icons';

LogBox.ignoreAllLogs();

const Tab = createMaterialTopTabNavigator();

const FajrSunnah = ({ navigation }) => { 
  return (
    <View style={styles.containerMain}>
   <StatusBar backgroundColor={Colors.wasilgreenthemecolor}/>
    <View style={styles.slidercontainer}>
      <WasilNewGPrayerFajrSuunahSvg/>
    </View>
    <Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      backgroundColor:Colors.wasilgreenthemecolorfourth,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      elevation: 0,
      shadowOpacity: 0,
      height: 50,
    },

    tabBarItemStyle: {
      borderRadius: 14,
      top:1
    },

    tabBarIndicatorStyle: {
      backgroundColor: "#EBC67D",
      height: '100%',
      borderRadius: 14,
    },

    tabBarActiveTintColor: Colors.white,
    tabBarInactiveTintColor: Colors.transparent,
    tabBarLabelStyle: {
      fontSize: 15,
      textTransform: 'none',
      fontWeight: '600',
      fontFamily:
        Platform.OS === 'ios'
          ? 'Poppins-Regular'
          : 'Raleway',
    },
    tabBarPressColor: 'transparent',
    
  }}>
  <Tab.Screen
  name="FirstRakat"
  component={FirstRakat}
  options={{
    tabBarLabel: '1st Rakah',
  }}
/>

<Tab.Screen
  name="SecondRakat"
  component={SecondRakat}
  options={{
    tabBarLabel: '2nd Rakah',
  }}
/>
      
      
  </Tab.Navigator>
  </View>
  );
};

export default FajrSunnah;
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor:Colors.wasilgreenthemecolor
  },
  slidercontainer: {
    top:20,
    alignSelf:"center",
    height: 120,
   
  },
});