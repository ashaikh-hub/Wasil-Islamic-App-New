import React from 'react';
import {LogBox,View,Text,StyleSheet,Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FirstRakat from "./FirstRakat"
import SecondRakat from "./SecondRakat"
import { Colors} from '../../../../../theme';
import {WasilNewPrayerFajrFarzSvg} from '../../../../../assets/icons';

LogBox.ignoreAllLogs();

const Tab = createMaterialTopTabNavigator();

const FajrFarz = ({ navigation }) => { 
  return (
    <View style={styles.containerMain}>
   <View style={styles.slidercontainer}>
         <WasilNewPrayerFajrFarzSvg/>
       </View>
    <Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      backgroundColor: '#ECECEC',
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
      backgroundColor: Colors.wasilnewthemecolorthird,
      height: '100%',
      borderRadius: 14,
    },

    tabBarActiveTintColor: '#FFFFFF',
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

export default FajrFarz;
const styles = StyleSheet.create({
 containerMain: {
    flex: 1,
    backgroundColor:Colors.white
  },
  slidercontainer: {
    top:20,
    alignSelf:"center",
    height: 120,
   
  },
});