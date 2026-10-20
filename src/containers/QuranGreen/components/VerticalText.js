import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const VerticalText = ({
  titleText = '',
  titleTextStyle,
  subText = '',
  subTextStyle,
  isShowSubText = true,
}) => {
  return (
    <View style={styles.textView}>
      <View style={[styles.textStyle, {marginBottom: 2}]}>
        <Text style={titleTextStyle}>{titleText}</Text>
      </View>
      {isShowSubText && (
        <View style={styles.textStyle}>
          <Text style={subTextStyle}>{subText}</Text>
        </View>
      )}
    </View>
  );
};

export default VerticalText;

const styles = ScaledSheet.create({
  textView: {marginLeft: '1@s'},
});
