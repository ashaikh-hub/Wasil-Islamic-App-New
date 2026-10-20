import React from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import VerticalText from './VerticalText';
import {DuaListNumberGSVGG} from '../../../assets/icons';
import {Colors} from '../../../theme';

const AyahsListRuku = ({
  numberCounting = '',
  mainViewCustomStyle,
  leftTitleText = '',
  leftSubText = '',
  leftSubText2 = '',
  rightTitleText = '',
  rightSubText = '',
  onPress = () => {},
  onPressFavoriteIcon = () => {},
  isFavoriteIconShow = true,
  isShowRightTextView = true,
  isFavorite = false,
}) => {
  const isArabicFont = useSelector(state => state.services.isArabicFont);

  return (
    <TouchableOpacity
     style={[styles.mainView, mainViewCustomStyle]}
      activeOpacity={0.7}
      onPress={onPress}>

      <View style={{flex: 0.5}}>
       <View style={{ height: Platform.OS === 'ios' ? 30 : 30}}></View>
       <View style={{ left: Platform.OS === 'ios' ? 16 : 16,bottom:15}}>
          <DuaListNumberGSVGG />
        </View>
        <Text style={styles.numberText}>
          {numberCounting}
        </Text>
      </View>
      <View style={styles.middleTextView}>
        <Text style={styles.title}>{leftTitleText}</Text>

        <Text style={styles.subtitle}>
          {leftSubText}
        </Text>  
      </View>
      <View style={styles.rightViewStyle}>
        <Text
          style={[
            styles.arabicTitle,
            {
              ...FONTSTYLE(
                Platform.OS === 'android'
                  ? isArabicFont?.key
                  : FONTS[isArabicFont?.key],
              ).headerText,
              fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',
              color:Colors.wasilgreenthemecolorfifth,
              lineHeight:25
            },
          ]}>
          {rightTitleText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AyahsListRuku;

const styles = ScaledSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 70,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    borderColor: Colors.wasilgreenborder,
  },

  middleTextView: {
    flex: 1,
  },

  numberText: {
    position: 'absolute',
    top: 22,
    left: 0,
    right: 5,
    textAlign: 'center',
    color: Colors.wasilgreentext,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'
  },

  title: {
    fontSize: 16,
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Asul-Regular'
        : 'AsulRegular',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    textTransform:"capitalize",
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Asul-Regular'
        : 'AsulRegular',
  },

  rightViewStyle: {
    width: '40%',
    alignItems: 'flex-end',
    paddingRight: 20,
  },

  arabicTitle: {
    textAlign: 'right',
    fontSize: 28,
    color: Colors.wasilgreenthemecolorfifth,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Al Qalam Quran Majeed Web'
        : 'AlQalamQuran',
  },
});