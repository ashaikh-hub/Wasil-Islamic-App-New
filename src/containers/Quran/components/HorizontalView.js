import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import RegularText from './RegularText';

const HorizontalView = ({
  mainViewCustomeStyle,
  onPress = () => {},
  leftViewText = '',
  customeRightImageView = null,
  isLeftImage = '',
  isRightImage = '',
  leftIconCustomeStyle,
  rightIconCustomeStyle,
  leftTextCustomeStyle,
  isRightImageShow,
  leftViewTextStyle,
}) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.mainView, mainViewCustomeStyle]}
        onPress={onPress}
        activeOpacity={0.5}>
        {isLeftImage && (
          <View style={{}}>
            <Image
              style={[styles.leftIconStyle, leftIconCustomeStyle]}
              source={isLeftImage}
            />
          </View>
        )}

        <View style={[styles.leftViewStyle, leftTextCustomeStyle]}>
          <RegularText text={leftViewText} style={leftViewTextStyle} />
        </View>

        {customeRightImageView ? (
          customeRightImageView()
        ) : isRightImageShow ? (
          <TouchableOpacity
            style={styles.rightImageViewStyle}
            hitSlop={{bottom: 15, top: 15, left: 15, right: 15}}
            onPress={onPress}
            activeOpacity={0.7}>
            <Image
              style={[styles.rightIconStyle, rightIconCustomeStyle]}
              source={isRightImage}
            />
          </TouchableOpacity>
        ) : null}
        
      </TouchableOpacity>
    </>
  );
};

export default HorizontalView;
const styles = ScaledSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '6@s',
    height: '50@s',
  },
  leftViewStyle: {flex: 1},
  rightImageViewStyle: {
    width: '13%',
    alignItems: 'flex-end',
  },
  leftIconStyle: {
    height: '22@s',
    width: '22@s',
    resizeMode: 'contain',
    marginRight: '5@s',
  },
  rightIconStyle: {
    height: '35@s',
    width: '35@s',
    resizeMode: 'contain',
  },
});
