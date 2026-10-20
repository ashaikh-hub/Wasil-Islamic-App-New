import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import {
  WasilNewEmptyViewFavGSvg,
  
} from '../../../assets/icons';
const EmptyViewFav = () => {
  return (
    <View style={styles.noDataViewStyle}>
      <WasilNewEmptyViewFavGSvg/>
    </View>
  );
};

export default EmptyViewFav;

const styles = ScaledSheet.create({
  noDataViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
