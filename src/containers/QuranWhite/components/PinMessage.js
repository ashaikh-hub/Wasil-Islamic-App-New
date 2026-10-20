import React from 'react';
import {Image, Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';

const PinMessage = ({pinText, pinItem}) => {
  const surahNumber = pinItem?.chapterId;
  const ayahNumber = pinItem?.verseNumber;

  return (
    <View style={styles.mainView}>
      <View style={styles.leftIconView}>
        <View style={styles.iconView}>
          <Image style={styles.iconStyle} source={IMAGES.checkCircleIcon} />
        </View>
        <View style={styles.textView}>
          <View>
            <Text style={styles.textstyle}>
              {pinText
                ? 'Ayah Pinned Successfully'
                : 'Ayah Removed Successfully'}
            </Text>
          </View>
          {surahNumber || ayahNumber ? (
            <View style={styles.secondTextView}>
              <Text style={styles.textstyle}>
                {`Surah no: ${surahNumber} Ayah no ${ayahNumber}`}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default PinMessage;

const styles = ScaledSheet.create({
  mainView: {
    backgroundColor: COLORS.yellow,
    width: '90%',
    position: 'absolute',
    bottom: '25@s',
    alignItems: 'center',
    alignSelf: 'center',
    padding: '12@s',
    borderRadius: '15@s',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftIconView: {
    flexDirection: 'row',
    flex: 1,
  },
  iconView: {marginHorizontal: '5@s'},
  iconStyle: {
    height: '38@s',
    width: '38@s',
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  secondTextView: {marginTop: '4@s'},
  textView: {justifyContent: 'center'},
  textstyle: {
    ...FONTSTYLE(FONTS.poppinsMedium).smallTitle,
    color: COLORS.white,
  },
});
