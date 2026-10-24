import React from 'react';
import {Text, View} from 'react-native';
import {Platform} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {getStorageItem} from '../mmkvStorage/storeData';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import { Colors } from '../../../theme';

const AyahViewComponent = ({
  detailTextCustomeStyle,
  detailContainerCustomeStyle,
  ayahItem,
}) => {
  const isArabic = getStorageItem('isArabic');
  const isTranslation = getStorageItem('isTranslation');
  const isTransliteration = getStorageItem('isTransliteration');
  const isArabicFont = useSelector(state => state.services.isArabicFont);

  const arabicFontSize = useSelector(state => state.services.arabicFontSize);
  const translationFontSize = useSelector(
    state => state.services.translationFontSize,
  );


  return (
    <>
      <View style={[styles.detailContainer, detailContainerCustomeStyle]}>
         {isArabic && (
  <Text
    style={[
      styles.detailText,
      {
        ...FONTSTYLE(
          Platform.OS === 'android'
            ? isArabicFont?.key
            : FONTS[isArabicFont?.key],
          arabicFontSize,
        ).arabicText,
      },
      detailTextCustomeStyle,
    ]}>
    {ayahItem?.words
      ?.map(item =>
        item?.textUthmani
          ?.replace(/[\d\u0660-\u0669]+/g, '')
          ?.trim(),
      )
      .join(' ')}
    <Text
      style={[
      styles.detailText,
      {
        ...FONTSTYLE(
          FONTS.trochutBold,
          arabicFontSize*0.8,
        ).arabicText,
      },
      detailTextCustomeStyle,
    ]}>
      {'﴿'}{ayahItem?.verseKey?.split(':')[1]}{'﴾'}
    </Text>
  </Text>
)}

        {isTransliteration && (
          <>
            <Text
              style={[
                {
                  ...FONTSTYLE(FONTS.poppinsLight, translationFontSize)
                    .arabicText,
                  marginTop: 15,
                },
                styles.caption,
              ]}>
              {ayahItem?.words
                ?.map(item =>
                  (item?.transliteration?.text || '').replace(/null/g, ''),
                )
                .join('  ')}
            </Text>
          </>
        )}
        {isTransliteration && isTranslation && <View style={styles.line} />}
        
        {isTranslation && (
          <View>
            {ayahItem?.translations?.map((item, index) => (
              <View key={item?.id}>
                  <Text
                  style={[
                    {
                      ...FONTSTYLE(FONTS.poppinsLight, translationFontSize)
                        .arabicText,
                    },
                    styles.caption,
                  ]}>
                 
                    {item?.text?.replace(/<sup[^>]*>.*?<\/sup>/g, '')}
                
                </Text>
                {index !== ayahItem?.translations?.length - 1 && (
                  <View style={styles.line} />
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </>
  );
};

export default AyahViewComponent;

const styles = ScaledSheet.create({
  detailContainer: {
    padding: '15@s',
    borderBottomWidth: 0.7,
    backgroundColor: Colors.wasilgreenthemecolor,
  },
  detailText: {
    alignSelf: 'flex-end',
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  caption: {
    color: COLORS.white,
  },
  line: {
    height: 1,
    marginVertical: '10@s',
    backgroundColor: COLORS.lightSlateGray,
  },
});
