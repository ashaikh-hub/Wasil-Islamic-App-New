import React from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';
import FavoriteView from './FavoriteView';
import { SURAH_NAMES } from '../../Reciters/surahNames'; 
import { Colors } from '../../../theme';

const SurahCard = ({ item, isFavorite, onPress, onFavorite }) => {
  const surahInfo = SURAH_NAMES[item?.id];
  const arabicName = surahInfo?.arabic ?? '';

  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress}>
      <ImageBackground
        source={IMAGES.surahlistbackground}
        style={styles.card}
        imageStyle={styles.bgImage}
      >
        <View style={styles.topRow}>
          <View style={styles.numberCircle}>
            <Text style={styles.numberText}>{item.id}</Text>
          </View>

          <FavoriteView
            isFavorite={isFavorite}
            onPressFavoriteIcon={onFavorite}
            item={item}
          />
        </View>

        <ImageBackground
          source={IMAGES.surahnamebackground}
          style={styles.arabicBg}
          imageStyle={styles.arabicBgImage}
        >
          <Text style={styles.arabicTitle}>
            {arabicName}
          </Text>
        </ImageBackground>

        <Text style={styles.englishTitle}>
          {item.transliteratedName}
        </Text>

        <Text style={styles.subText}>
          Verses: {item.versesCount} • {item.revelationPlace}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default SurahCard;
const styles = ScaledSheet.create({
  cardWrapper: {
    flex: 1,
    margin: '4@s',
    backgroundColor:"#E0E0E0",
    borderRadius: '8@s',
  },
  card: {
    height: '140@s',
    borderRadius: '20@s',
    padding: '12@s',
    justifyContent: 'space-between',
  },
  bgImage: {
    left:50,
    borderRadius: '14@s',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberCircle: {
    height: '22@s',
    width: '22@s',
    right:'6@s',
    bottom:'4@s',
    borderRadius: '14@s',
    backgroundColor: "#9E9E9E",
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    ...FONTSTYLE(FONTS.poppinsRegular).ayahlistnumber
  },
  arabicTitle: {
    textAlign: 'center',
    fontSize: '32@s',
    paddingRight:10,
    color:Colors.white,
    fontFamily: "sura_names",
  },
  englishTitle: {
    textAlign: 'center',
     marginTop: 10,
    ...FONTSTYLE(FONTS.poppinsSemiBold).body,
  },
  subText: {
    textAlign: 'center',
    color: COLORS.slateGray,
    ...FONTSTYLE(FONTS.poppinsRegular).caption,
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
});
