import React from 'react';
import {
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';
import FavoriteView from './FavoriteView';
import VerticalText from './VerticalText';
import {
  DuaListNumberGSVGG,
} from '../../../assets/icons';
import { Colors } from '../../../theme';
export const LineView = () => {
  return (
    <View style={{height: 1.4, backgroundColor: COLORS.wasilnewthemecolorsecondGray}}></View>
  );
};

const AyashList = ({
  numberCounting = '',
  mainViewCustomStyle,
  leftTitleText = '',
  leftSubText = '',
  rightTitleText = '',
  rightSubText = '',
  backgroundImage = IMAGES.unSelectBackGroundImg,
  onPress = () => {},
  onPressFavoriteIcon = () => {},
  isFavoriteIconShow = true,
  isShowRightTextView = true,
  isShowLeftSubText = true,
  isShowRightSubText = true,
  isFavorite = false,
  item,
}) => {
  const isArabicFont = useSelector(state => state.services.isArabicFont);
  return (
    <>
      <TouchableOpacity
        style={[styles.mainView, mainViewCustomStyle]}
        onPress={onPress}
        activeOpacity={0.5}>
         <View style={{flex: 0.8,}}>
            <View style={{ height: Platform.OS === 'ios' ? 30 : 30}}></View>
            <View style={{ left: Platform.OS === 'ios' ? 16 : 16}}>
             <DuaListNumberGSVGG />
             </View>
            <Text style={{ left: Platform.OS === 'ios' ? 3 : 4,bottom: Platform.OS === 'ios' ? 33 : 33, textAlign: "center", fontWeight: "500", color: Colors.wasilgreentext, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway' }}>{numberCounting}</Text>
            </View>
        <View style={styles.middleTextView}>
          <VerticalText
            titleText={leftTitleText}
            subText={leftSubText}
            titleTextStyle={styles.leftTitleTextStyle}
            subTextStyle={styles.leftSubTextStyle}
          />
        </View>
       
        {isShowRightTextView && (
          <View style={styles.rightViewStyle}>
            <VerticalText
              titleText={rightTitleText}
              subText={rightSubText}
              titleTextStyle={[
                {
                  ...FONTSTYLE(
                    Platform.OS === 'android'
                      ? isArabicFont?.key
                      : FONTS[isArabicFont?.key],
                  ).headerText,
                  lineHeight: Platform.OS === 'android' ? 40 : 0,
                },
                styles.rightTitleTextStyle,
              ]}
             
            />
          </View>
        )}
         {isFavoriteIconShow && (
          <FavoriteView
            onPressFavoriteIcon={onPressFavoriteIcon}
            isFavorite={isFavorite}
            surahId={numberCounting}
            item={item}
          />
        )}
      </TouchableOpacity>
    </>
  );
};

export default AyashList;
const styles = ScaledSheet.create({
  mainView: {
   flexDirection: 'row',
   alignItems: 'center',
   width: "95%",
   height: 70,
   alignSelf:"center",
   borderRadius:12,
   borderWidth:1,
   marginTop:10,
   borderColor: Colors.wasilgreenborder,
  },
  backgroundImageStyle: {
    height: '45@s',
    width: '45@s',
    resizeMode: 'contain',
  },
  leftViewStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  idStyle: {
    ...FONTSTYLE(FONTS.poppinsSemiBold).body,
  },
  middleTextView: {flex: 1,left: Platform.OS === 'ios' ? 8 : 8},
  leftTitleTextStyle: {
   width:130,
   fontFamily: Platform.OS === 'ios' ? 'Asul-Regular' : 'AsulRegular',
   fontSize:16,
   right:4,
   color:Colors.white
  },
  leftSubTextStyle: {
   fontFamily: Platform.OS === 'ios' ? 'Asul-Regular' : 'AsulRegular',
   fontSize:12,
   right:4,
   color:Colors.white
  },
  rightViewStyle: {width: '55%'},
  rightTitleTextStyle: {
     top:10,
     textAlign: 'center',
     fontFamily: "sura_names",
     fontSize:35,
     color:Colors.wasilgreenthemecolorfifth
  },
  rightSubTextStyle: {
    ...FONTSTYLE(FONTS.poppinsRegular).caption,
    color: COLORS.white,
    textAlign: 'center',
  },
});
