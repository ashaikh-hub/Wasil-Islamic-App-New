import React from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';
import { Colors } from '../../../theme';

const JuzCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress}>
      <ImageBackground
        source={IMAGES.surahlistbackground}
        style={styles.card}
        imageStyle={styles.bgImage}
      >

        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={styles.numberCircle}>
            <Text style={styles.numberText}>{item.id}</Text>
          </View>
        </View>

        <ImageBackground
          source={IMAGES.surahnamebackground}
          style={styles.arabicBg}
          imageStyle={styles.arabicBgImage}
        >
          <Text style={styles.arabicTitle}>
            {item.arabic}
          </Text>
        </ImageBackground>

        <Text style={styles.englishTitle}>
         {item.juzNumber}
        </Text>

        <Text style={styles.subText}>
          {item.verses}
        </Text>

      </ImageBackground>
    </TouchableOpacity>
  );
};

export default JuzCard;
const styles = ScaledSheet.create({
  cardWrapper: {
    flex: 1,
    margin: '4@s',
    backgroundColor: '#E0E0E0',
    borderRadius: '8@s',
  },
  card: {
    height: '140@s',
    borderRadius: '20@s',
    padding: '12@s',
    justifyContent: 'space-between',
  },
  bgImage: {
    left: 50,
    borderRadius: '14@s',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numberCircle: {
    height: '22@s',
    width: '22@s',
    right: '6@s',
    bottom: '4@s',
    borderRadius: '14@s',
    backgroundColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    ...FONTSTYLE(FONTS.poppinsRegular).ayahlistnumber,
  },
  arabicBg: {
    alignSelf: 'center',
    width: '170@s',
    height: '60@s',
    justifyContent: 'center',
    marginTop: '5@vs',
  },
  arabicBgImage: {
    resizeMode: 'contain',
  },
  arabicTitle: {
    textAlign: 'center',
    fontSize: '24@s',
    color: Colors.white,
    fontFamily: 'Al Qalam Quran Majeed',
  },
  englishTitle: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.wasilnewthemecolorsecondBlue,
  },

   subText: {
    textAlign: 'center',
    color: COLORS.slateGray,
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: COLORS.wasilnewthemecolorsecondBlue,
  },
});
