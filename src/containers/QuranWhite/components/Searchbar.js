import React from 'react';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';

const Searchbar = ({
  leftIcon = IMAGES.searchIcon,
  rightIcon = IMAGES.crossIcon,
  leftViewExtraStyle,
  rightViewExtraStyle,
  containerViewStyle,
  RIGHT_VIEW_WIDTH,
  LEFT_VIEW_WIDTH,
  onPressLeftIcon = () => {},
  onPressRightIcon = () => {},
  onChangeText = () => {},
  searchText,
}) => {
  return (
    <View style={[styles?.container, containerViewStyle]}>
      <View style={styles.mainView}>
        {leftIcon && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.leftIconView,
              {width: LEFT_VIEW_WIDTH},
              leftViewExtraStyle,
            ]}
            hitSlop={{bottom: 15, top: 15, left: 15, right: 15}}
            onPress={onPressLeftIcon}>
            <Image style={styles.leftIconStyle} source={leftIcon} />
          </TouchableOpacity>
        )}
        <TextInput
          placeholder={'Search'}
          value={searchText}
          onChangeText={onChangeText}
          style={styles.textInputView}
          placeholderTextColor={COLORS.lGray}
        />

        {rightIcon && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.rightIconView,
              {width: RIGHT_VIEW_WIDTH},
              rightViewExtraStyle,
            ]}
            hitSlop={{bottom: 15, top: 15, left: 15, right: 15}}
            onPress={onPressRightIcon}>
            <Image style={styles.rightIconStyle} source={rightIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Searchbar;
const styles = ScaledSheet.create({
  container: {
    borderRadius: '50@s',
    justifyContent: 'center',
    backgroundColor: COLORS.navyBlur,
    flex: 1,
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '15@s',
    paddingVertical: '2@s',
  },
  leftIconView: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: '8@s',
  },
  rightIconView: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: '8@s',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  leftIconStyle: {
    height: '24@s',
    width: '24@s',
    resizeMode: 'contain',
    tintColor: COLORS.blue,
  },
  rightIconStyle: {
    height: '15@s',
    width: '15@s',
    resizeMode: 'contain',
  },
  textInputView: {
    flex: 1,
    backgroundColor: COLORS.navyBlur,
    width: '100%',
    height: '35@vs',
    ...FONTSTYLE(FONTS.sfProRegular).inputs,
    color: COLORS.white,
  },
});
