import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {getStorageItem} from '../mmkvStorage/storeData';
import {COLORS, FONTS, FONTSTYLE} from '../theme';

const SaveList = ({
  detailTextCustomeStyle,
  detailContainerCustomeStyle,
  ayahItem,
  searchingText,
}) => {
  const isArabic = getStorageItem('isArabic');
  const isTranslation = getStorageItem('isTranslation');
  const isTransliteration = getStorageItem('isTransliteration');
  const isArabicFont = useSelector(state => state.services.isArabicFont);

  const arabicFontSize = useSelector(state => state.services.arabicFontSize);
  const translationFontSize = useSelector(
    state => state.services.translationFontSize,
  );
  const highlightText = text => {
    const parts = text.split(new RegExp(`(${searchingText})`, 'gi'));
    return parts.map((part, index) =>
      part?.toLowerCase() === searchingText?.toLowerCase() ? (
        <Text
          key={index}
          style={[
            styles.caption,

            {
              ...FONTSTYLE(FONTS.poppinsLight, translationFontSize).arabicText,
              color: COLORS.yellow,
            },
          ]}>
          {part}
        </Text>
      ) : (
        <Text
          style={[
            {
              ...FONTSTYLE(FONTS.poppinsLight, translationFontSize).arabicText,
            },
            styles.caption,
          ]}
          key={index}>
          {part}
        </Text>
      ),
    );
  };

  return (
    <>
      <View style={[styles.detailContainer, detailContainerCustomeStyle]}>
        {isArabic && (
          <Text style={styles.detailText}>
            {ayahItem?.words?.map(i => (
              <Text
                key={i?.id}
                style={[
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
                {`${i?.textUthmani} `}
              </Text>
            ))}
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
                  {highlightText(
                    item?.text?.replace(/<sup[^>]*>.*?<\/sup>/g, ''),
                  )}
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

export default SaveList;

const styles = ScaledSheet.create({
  detailContainer: {
    padding: '15@s',
    borderBottomWidth: 2,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightSlateGray,
  },
  detailText: {
    alignSelf: 'flex-end',
  },
  caption: {
    color: COLORS.wasilnewthemecolorsecondGray,
  },
  line: {
    height: 1,
    marginVertical: '10@s',
    backgroundColor: COLORS.lightSlateGray,
  },
});
