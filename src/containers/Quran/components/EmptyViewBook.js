import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import {WasilNewEmptyViewBookBTSvg} from '../../../assets/icons';
const EmptyViewBook = () => {
  return (
    <View style={styles.noDataViewStyle}>
   
      <WasilNewEmptyViewBookBTSvg/>
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
