import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {Button as Btn} from 'react-native-paper';
import {COLORS} from '../theme';

const Button = ({
  title = 'Button',
  onPress = () => {},
  style,
  labelStyle,
  textColor = COLORS.white,
  disabled = false,
}) => {
  return (
    <>
      <Btn
        mode="contained"
        labelStyle={[styles.labelStyle, labelStyle]}
        onPress={onPress}
        textColor={textColor}
        style={[styles.button, style]}
        disabled={disabled}>
        {title}
      </Btn>
    </>
  );
};

export default Button;

const styles = ScaledSheet.create({
  button: {
    height: '48@s',
    borderRadius: '1@s',
    justifyContent: 'center',
  },
  labelStyle: {
    fontSize: 16,
  },
});
