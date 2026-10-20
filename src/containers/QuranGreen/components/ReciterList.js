import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';
import {reciterImages} from './reciterImages';
const ReciterList = ({
  onPress = () => {},
  subText = '',
  isSelected = '',
  item = '',
  imageUrl = '',
}) => {
  const borderColor =
    item?.id == isSelected?.id ? COLORS.yellow : COLORS.paleGray;

  return (
    <TouchableOpacity
      style={[styles.mainView, {borderColor: borderColor}]}
      activeOpacity={0.6}
      onPress={onPress}>
      {item?.id == isSelected?.id && (
        <View style={styles.rightIconView}>
          <Image style={styles.iconStyle} source={IMAGES.checkCircleIcon} />
        </View>
      )}

      <View style={styles.reciterImgView}>
        <Image
          style={[
            styles.reciterImgStyle,
            {backgroundColor: !imageUrl ? COLORS.lGray : null},
          ]}
          source={reciterImages[item?.reciter_id]}
        />
      </View>
      <View style={styles.textViewStyle}>
        <Text style={styles.textStyle}>{subText}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReciterList;
const styles = ScaledSheet.create({
  mainView: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: '10@s',
    paddingHorizontal: '3@s',
    marginLeft: '10@s',
  },
  rightIconView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingEnd: '4@s',
    paddingTop: '4@s',
  },
  iconStyle: {
    height: '22@s',
    width: '22@s',
    resizeMode: 'contain',
    tintColor: COLORS.yellow,
    alignSelf: 'flex-end',
  },
  reciterImgStyle: {
    height: '65@s',
    width: '65@s',
    borderRadius: '35@s',
    resizeMode: 'contain',
  },
  reciterImgView: {
    alignItems: 'center',
  },
  textViewStyle: {
    alignItems: 'center',
    marginTop: '15@s',
    alignSelf: 'center',
    width: '95@s',
    height: '35@s',
  },
  textStyle: {
    textAlign: 'center',
    ...FONTSTYLE(FONTS.poppinsLight).body,
    color: COLORS.wasilnewthemecolorsecondGray,
  },
});
