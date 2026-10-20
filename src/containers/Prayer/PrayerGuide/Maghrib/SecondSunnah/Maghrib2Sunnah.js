import React from 'react';
import {LogBox,View,StatusBar,StyleSheet,Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FirstRakat from "./FirstRakat"
import SecondRakat from "./SecondRakat"
import { Colors} from '../../../../../theme';
import {WasilNewBTPrayerMaghribSunnahSvg} from '../../../../../assets/icons';

LogBox.ignoreAllLogs();

const Tab = createMaterialTopTabNavigator();

const Maghrib2Sunnah = ({ navigation }) => { 
  return (
    <View style={styles.containerMain}>
   <StatusBar backgroundColor={Colors.intermediate1}/>
    <View style={styles.slidercontainer}>
      <WasilNewBTPrayerMaghribSunnahSvg/>
    </View>
    <Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      backgroundColor:Colors.secondary1,
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
      backgroundColor: "#5F50A1",
      height: '100%',
      borderRadius: 14,
    },

    tabBarActiveTintColor: Colors.white,
    tabBarInactiveTintColor: '#444',
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

export default Maghrib2Sunnah;
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor:Colors.intermediate1
  },
  slidercontainer: {
    top:20,
    alignSelf:"center",
    height: 120,
   
  },
});