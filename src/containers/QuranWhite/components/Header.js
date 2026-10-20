import React from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-screen-helper';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';
import Searchbar from './Searchbar';

import {
  WasilNewBackArrowSvg,
  WasilNewTranslateWhiteSvg,
  QuranBottomSettingWhiteSVG,
} from '../../../assets/icons';
const HIT_SLOP = {bottom: 40, top: 40, left: 0, right: 20};
const ICON_HIT_SLOP = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

const Header = ({
  title = '',
  leftIcon = true,
  rightIcon = true,
  secondRightIcon = false,

  onPressLeftIcon = () => {},
  onPressRightIcon = () => {},
  onPressSecondRightIcon = () => {},

  onClickCloseSearch = () => {},
  onChangeText = () => {},

  customBackIcon = null,
  customRightIcon = null,
  customTitleTextStyle = {},

  searchEnable = false,
  searchText,
}) => {

  return (
    <View style={styles.container}>
      {searchEnable ? (
        <Searchbar
          onPressLeftIcon={() => {}}
          onPressRightIcon={onClickCloseSearch}
          onChangeText={onChangeText}
          searchText={searchText}
        />
      ) : (
        <View style={styles.mainView}>

          {/* LEFT */}
          <View style={styles.leftIconView}>
            {leftIcon ? (
              <TouchableOpacity hitSlop={HIT_SLOP} onPress={onPressLeftIcon}>
                  <WasilNewBackArrowSvg/>
                </TouchableOpacity>
            ) : customBackIcon ? (
              customBackIcon()
            ) : null}
          </View>

          {/* TITLE */}
          <View
            style={[
              styles.titleTextView,
              customTitleTextStyle,
            ]}
          >
            <Text
              style={styles.titleText}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          {/* RIGHT BUTTONS */}
          <View style={styles.rightIconView}>

            {secondRightIcon && (
              <TouchableOpacity
                style={styles.rightButton}
                hitSlop={ICON_HIT_SLOP}
                onPress={onPressSecondRightIcon}
                activeOpacity={0.7}
              >
                <WasilNewTranslateWhiteSvg />
              </TouchableOpacity>
            )}

            {rightIcon && (
              <TouchableOpacity
                style={styles.rightButton}
                hitSlop={ICON_HIT_SLOP}
                onPress={onPressRightIcon}
                activeOpacity={0.7}
              >
                <QuranBottomSettingWhiteSVG />
              </TouchableOpacity>
            )}

            {!rightIcon && customRightIcon
              ? customRightIcon()
              : null}

          </View>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = ScaledSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop:
      Platform.OS === 'ios'
        ? getStatusBarHeight()
        : '10@s',

    backgroundColor: COLORS.white,
    minHeight: '46@s',
  },

  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '15@s',
    paddingBottom: '10@s',
  },

  leftIconView: {
    width: '20%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  titleTextView: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightIconView: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButton: {
    width: '25@s',
    height: '40@s',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButton: {
    width: '40@s',
    height: '40@s',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    height: '17@s',
    width: '17@s',
    resizeMode: 'contain',
  },

  titleText: {
    ...FONTSTYLE(FONTS.poppinsSemiBold).headerText,
    alignSelf: 'center',
    color: COLORS.black,
    left:10,
    top:2
  },
});