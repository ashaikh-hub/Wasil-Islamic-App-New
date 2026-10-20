import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';
import BookmarkPageImage from './BookmarkPageImage';

const TopRowComponentTwo = ({
  isLeftPinIcon = false,
  isBookIcon = false,
  topViewCustomeStyle,
  pinIconCustomeStyle,
  playIconCustomeStyle,
  bookmarkIconCustomeStyle,
  bookIconCustomeStyle,
  shareIconCustomeStyle,
  onPressPinIcon = () => {},
  onPressPlayIcon = () => {},
  onPressBookmarkIcon = () => {},
  onPresShareIcon = () => {},
  onPressBookIcon = () => {},
  saveBookmark,
  item,
  surahDetail,
  fromBookmark = false,
  additionalText 
}) => {
  return (
    <>
      <View style={[styles.topView, topViewCustomeStyle]} key={item?.id}>
        <View style={styles.leftViewStyle}>
          {fromBookmark ? (
            <View style={{marginEnd: 10}}>
              <Text style={styles.idStyle}>
                {surahDetail?.transliteratedName}
              </Text>
            </View>
          ) : null}
          <View style={styles.numberCountView}>
            <Text style={styles.idStyle}>{item?.verseKey}</Text>
          </View>
          {isLeftPinIcon && (
            <BookmarkPageImage
              iconCustomeStyle={[styles.pinIconStyle, pinIconCustomeStyle]}
              Icon={IMAGES.pinIcon}
              onPressIcon={onPressPinIcon}
            />
          )}
            <Text style={styles.idStyle1}>{additionalText}</Text>
        </View>
        <View style={styles.rightIconView}>
          <BookmarkPageImage
            iconCustomeStyle={playIconCustomeStyle}
            Icon={IMAGES.playIcon}
            onPressIcon={onPressPlayIcon}
          />
          <BookmarkPageImage
            iconCustomeStyle={bookmarkIconCustomeStyle}
            Icon={saveBookmark ? IMAGES.bookmarkIcon : IMAGES.unBookmarkIcon}
            onPressIcon={onPressBookmarkIcon}
          />

          {isBookIcon && (
            <BookmarkPageImage
              iconCustomeStyle={bookIconCustomeStyle}
              Icon={IMAGES.bookIcon}
              onPressIcon={onPressBookIcon}
            />
          )}

          <BookmarkPageImage
            iconCustomeStyle={shareIconCustomeStyle}
            Icon={IMAGES.shareIcon}
            onPressIcon={onPresShareIcon}
          />
        </View>
      </View>
    </>
  );
};

export default TopRowComponentTwo;

const styles = ScaledSheet.create({
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '15@s',
    paddingVertical: '7@s',
  },
  leftViewStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  idStyle: {
    ...FONTSTYLE(FONTS.poppinsRegular).inputs,
    textAlign: 'center',
  },
  idStyle1: {
    ...FONTSTYLE(FONTS.poppinsRegular).inputs,
    textAlign: 'center',
    top:3
  },
  rightIconView: {flexDirection: 'row'},
  numberCountView: {justifyContent: 'center'},
  pinIconStyle: {height: '17@s', width: '17@s', resizeMode: 'contain'},
});
