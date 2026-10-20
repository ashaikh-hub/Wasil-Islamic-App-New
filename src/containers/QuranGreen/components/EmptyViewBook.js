import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import {WasilNewEmptyViewBookGSvg} from '../../../assets/icons';
const EmptyViewBook = () => {
  return (
    <View style={styles.noDataViewStyle}>
   
      <WasilNewEmptyViewBookGSvg/>
    </View>
  );
};

export default EmptyViewBook;

const styles = ScaledSheet.create({
  noDataViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
