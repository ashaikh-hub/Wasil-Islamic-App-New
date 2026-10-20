import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS, FONTS, FONTSTYLE} from '../theme';

const RegularText = ({text, style}) => {
  return (
    <>
      <Text style={[styles.textStyle, style]}>{text}</Text>
    </>
  );
};

export default RegularText;

const styles = StyleSheet.create({
  textStyle: {
    ...FONTSTYLE(FONTS.poppinsRegular).inputs,top:2,
    color: COLORS.wasilnewthemecolorsecondBlue,
  },
});
