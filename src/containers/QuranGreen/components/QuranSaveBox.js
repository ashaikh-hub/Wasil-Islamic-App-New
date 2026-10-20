import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { getStorageItem } from '../mmkvStorage/storeData';
import { COLORS, FONTS, FONTSTYLE, IMAGES } from '../theme';
import VerticalText from './VerticalText';
import {
  QuranNewPinIcon,
  QuranNewBookmarkIcon,
  QuranNewFavouriteIcon
} from "../../../assets/icons";
import { Colors } from '../../../theme';

const QuranSaveBox = ({
  Icon = '',
  titleText = '',
  subText = '',
  onPress = () => { },
}) => {
  const navigation = useNavigation();

  const pinAyah = getStorageItem('pin');
  const bookmarksList = getStorageItem('bookmark');
  const favoritesList = getStorageItem('favorites');

  const subTextValue =
    titleText === 'Pin Ayah'
      ? `Surah ${pinAyah?.AyahItem?.verseKey ? pinAyah?.AyahItem?.verseKey : ''
      }`
      : titleText === 'Bookmarks'
        ? `Total Ayahs ${bookmarksList?.length !== 0 ? bookmarksList?.length : ''
        }`
        : titleText === 'Favourite'
          ? `Surah ${favoritesList?.length !== 0 ? favoritesList?.length : ''}`
          : subText;


 const renderIcon = () => {
  switch (titleText) {
    case 'Pin Ayah':
      return <QuranNewPinIcon width={28} height={28} style={{ right: 7 }} />;

    case 'Bookmarks':
      return <QuranNewBookmarkIcon width={28} height={28} style={{ right: 4 }} />;

    case 'Favourite':
      return <QuranNewFavouriteIcon width={28} height={28} style={{ right: 10 }} />;

    default:
      return <Image style={styles.iconStyle} source={Icon} />;
  }
};
  const IconSource =
    titleText === 'Pin Ayah'
      ? <QuranNewPinIcon/>
      : titleText === 'Bookmarks'
        ? <QuranNewBookmarkIcon/>
        : titleText === 'Favourite'
          ? <QuranNewFavouriteIcon/>
          : Icon;

  const InPressTouchable = () => {
    titleText === 'Pin Ayah'
      ? pinAyah?.AyahItem?.verseKey &&
      navigation.navigate('SurahDetailPage', {
  selectedAyahItems: pinAyah?.AyahItem,
  selectedSurahItems: pinAyah?.SurahItem,
  fromPinAyah: true,

  fromjuz: pinAyah?.fromjuz,
  from: pinAyah?.from,
  rukuNumber: pinAyah?.rukuNumber,
  fromqc: pinAyah?.fromqc,
  surahNumber: pinAyah?.surahNumber,
  headersurahname: pinAyah?.headersurahname,
})
      : titleText === 'Bookmarks'
        ? navigation.navigate('Bookmark')
        : titleText === 'Favourite'
          ? navigation.navigate('Favorite')
          : onPress();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.mainView}
        onPress={() => {
          InPressTouchable();
        }}
        activeOpacity={0.7}>
       <View>
  {renderIcon()}
</View>
        <View style={styles.textView}>
          <VerticalText
            titleText={titleText}
            titleTextStyle={styles.titleTextStyle}
            subTextStyle={styles.subTextStyle}
            subText={subTextValue}
          />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default QuranSaveBox;

const styles = ScaledSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.wasilgreenthemecolor,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: '10@s',
    borderColor: Colors.wasilgreenborder,
    paddingHorizontal: '5@s',
    paddingVertical: '8@s',
    marginRight: '8@s',
    alignSelf: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    height: '22@s',
    width: '22@s',
    resizeMode: 'contain',
    right:10
  },
  textView: { maxWidth: 100 },
  titleTextStyle: {
    ...FONTSTYLE(FONTS.poppinsRegular).body,
    color: COLORS.white,
  },
  subTextStyle: {
    ...FONTSTYLE(FONTS.poppinsRegular).smallText,
    color: COLORS.white,
  },
});
