import React from 'react';
import {Text, View,StatusBar} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import {WasilNewEmptyViewBookSvg,} from '../../../assets/icons';
import { Colors } from '../../../theme';
const EmptyViewBook = () => {
  return (
    <View style={styles.noDataViewStyle}>
      <StatusBar backgroundColor={Colors.black}/>
  
      <WasilNewEmptyViewBookSvg/>
   
    </View>
  );
};

export default EmptyViewBook;

const styles = ScaledSheet.create({
  noDataViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataTextStyle: {
    ...FONTSTYLE(FONTS.poppinsMedium).inputBody,
    color: COLORS.wasilnewthemecolorsecondBlue,
  },
});
