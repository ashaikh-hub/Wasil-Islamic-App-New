import React from 'react';
import {
  LogBox,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import FirstRakat from './FirstRakat';
import SecondRakat from './SecondRakat';
import ThirdRakat from './ThirdRakat';
import FourthRakat from './FourthRakat';

import {Colors} from '../../../../../theme';
import {WasilNewPrayerIshaSunnahSvg} from '../../../../../assets/icons';

LogBox.ignoreAllLogs();

const Tab = createMaterialTopTabNavigator();

const renderTabLabel = (label, color) => (
  <Text
    allowFontScaling={false}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.8}
    style={{
      color,
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
      fontFamily:
        Platform.OS === 'ios'
          ? 'Poppins-Regular'
          : 'Raleway',
    }}>
    {label}
  </Text>
);

const IshaFirst4Sunnah = () => {
  return (
    <View style={styles.containerMain}>
      <View style={styles.slidercontainer}>
        <WasilNewPrayerIshaSunnahSvg />
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
            top: 1,
            paddingHorizontal: 4,
          },

          tabBarIndicatorStyle: {
            backgroundColor: Colors.wasilnewthemecolorthird,
            height: '100%',
            borderRadius: 14,
          },

          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#444',

          tabBarLabelStyle: {
            textTransform: 'none',
          },

          tabBarPressColor: 'transparent',
        }}>
        <Tab.Screen
          name="FirstRakat"
          component={FirstRakat}
          options={{
            tabBarLabel: ({color}) =>
              renderTabLabel('1st Rakah', color),
          }}
        />

        <Tab.Screen
          name="SecondRakat"
          component={SecondRakat}
          options={{
            tabBarLabel: ({color}) =>
              renderTabLabel('2nd Rakah', color),
          }}
        />

        <Tab.Screen
          name="ThirdRakat"
          component={ThirdRakat}
          options={{
            tabBarLabel: ({color}) =>
              renderTabLabel('3rd Rakah', color),
          }}
        />

        <Tab.Screen
          name="FourthRakat"
          component={FourthRakat}
          options={{
            tabBarLabel: ({color}) =>
              renderTabLabel('4th Rakah', color),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default IshaFirst4Sunnah;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  slidercontainer: {
    top: 20,
    alignSelf: 'center',
    height: 120,
  },
});