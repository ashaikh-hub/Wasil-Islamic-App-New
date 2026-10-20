import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE} from '../theme';

const EmptyView = () => {
  return (
    <View style={styles.noDataViewStyle}>
      <Text style={styles.noDataTextStyle}>No Data Found</Text>
    </View>
  );
};

export default EmptyView;

const styles = ScaledSheet.create({
  noDataViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataTextStyle: {
    ...FONTSTYLE(FONTS.poppinsMedium).inputBody,
    color: COLORS.wasilnewthemecolorsecondBlue,
  },
});
