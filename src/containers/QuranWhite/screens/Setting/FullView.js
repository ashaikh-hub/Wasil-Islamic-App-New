import Slider from '@react-native-community/slider';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import Header from '../../components/Header';
import HorizontalView from '../../components/HorizontalView';
import RegularText from '../../components/RegularText';
import RNSwitch from '../../components/RNSwitch';
import {setStorageItem} from '../../mmkvStorage/storeData';
import { Colors } from '../../../../theme';
import {DuaForwardSVG} from '../../../../assets/icons';
import {
  setArabic,
  setArabicFont,
  setArabicFontSize,
  setTranslation,
  setTranslationFontSize,
  setTransliteration,
  setPageLayout,
  setPageTheme,
} from '../../redux/reduxToolkit/store/servicesSlice';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../../theme';

const FullView = ({navigation, route}) => {
  const {isFromPage,isFromQuranComp,selectedPageItem,fromjuz,from,rukuNumber,fromqc,surahNumber,headersurahname,selectedSurahItems,} = route?.params;
  const isArabicFont = useSelector(state => state.services.isArabicFont);
  const selectedSurahItem = useSelector(
    state => state.services.selectedSurahItem,
  );
  const arabicFontSize = useSelector(state => state.services.arabicFontSize);
  const translationFontSize = useSelector(
    state => state.services.translationFontSize,
  );
  const isArabic = useSelector(state => state.services.isArabic);
  const isTranslation = useSelector(state => state.services.isTranslation);
  const isTransliteration = useSelector(
    state => state.services.isTransliteration,
  );
  let minFontSize = 10;
  let maxFontSize = 40;
  const isFocused = useIsFocused();

  const [isEnableArabic, setIsEnableArabic] = useState(isArabic);
  const [isEnableTranslation, setIsEnableTranslation] = useState(isTranslation);
  const [isEnableTransliteration, setIsEnableTransliteration] =
    useState(isTransliteration);
  const [arabicFontSizeValue, setArabicFontSizeValue] =
    useState(arabicFontSize);
  const [translationFontSizeValue, setTranslationFontSizeValue] =
    useState(translationFontSize);
  const [selectFont, setSelectFont] = useState(isArabicFont);
  const dispatch = useDispatch();

  const pageLayout = useSelector(state => state.services.pageLayout);
  const pageTheme = useSelector(state => state.services.pageTheme);
  const [selectedLayout, setSelectedLayout] = useState(pageLayout);
  const [selectedTheme, setSelectedTheme] = useState(pageTheme);

  const arabicFontList = [
    {id: 1, key: 'arabic_Indopak', fontTitle: 'IndoPak'},
    {id: 2, key: 'arabic_Uthmani', fontTitle: 'Uthmani'},
    {id: 3, key: 'arabic_Tajweed', fontTitle: 'Tajweed'},
    {id: 4, key: 'arabic_Al_Mushaf_Quran', fontTitle: 'Al_Mushaf'},
    {id: 5, key: 'arabic_AmiriQuran_Regular', fontTitle: 'Amiri_Quran'},
    {id: 6, key: 'arabic_Lateef_Regular', fontTitle: 'Lateef'},
    {id: 7, key: 'arabic_Madina', fontTitle: 'Madina'},
    {id: 8, key: 'arabic_noorehidayat_Regular', fontTitle: 'Noorehidayat'},
    {id: 9, key: 'arabic_noorehira_Regular', fontTitle: 'Noorehira'},
    {id: 10, key: 'arabic_noorehuda_Regular', fontTitle: 'Noorehuda'},
    {
      id: 11,
      key: 'arabic_PDMS_IslamicFont_Regular',
      fontTitle: 'PDMS_IslamicFont',
    },
    {
      id: 12,
      key: 'arabic_PDMS_Saleem_QuranFont_Regular',
      fontTitle: 'PDMS_Saleem',
    },
    {id: 13, key: 'arabic_ScheherazadeNew_Regular', fontTitle: 'Scheherazade'},
  ];

  useEffect(() => {
    const backAction = async () => {
      if (isFromPage) {
        navigation.push('SurahFullView', {
          selectedPageItem: selectedPageItem,
        });
      } 
      else if (isFromQuranComp) {
         navigation?.goBack();
      } 
      else {
        navigation.push('SurahDetailPage', {
          selectedSurahItems: selectedSurahItem,
        });
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setIsEnableArabic(isArabic);
    setIsEnableTranslation(isTranslation);
    setIsEnableTransliteration(isTransliteration);
    setArabicFontSizeValue(arabicFontSize);
    setTranslationFontSizeValue(translationFontSize);
    setSelectFont(isArabicFont);
  }, [isFocused]);

  const renderItem = item => {
    return (
      <View style={styles.dropdownItemStyle}>
        <Text style={styles.dropdownTitleText}>{item?.fontTitle}</Text>
        {item == selectFont && <View></View>}
      </View>
    );
  };

  const onSelectFont = font => {  
  setSelectFont(font);

  dispatch(setArabicFont(font));
  setStorageItem('isArabicFont', font);
};
  const onChangeArabicFontSize = fontSize => {
  setArabicFontSizeValue(fontSize);

  dispatch(setArabicFontSize(fontSize));
  setStorageItem('dynamicArabicFontSize', fontSize);
};
  const onChangeTranslationFontSize = fontSize => {
  setTranslationFontSizeValue(fontSize);

  dispatch(setTranslationFontSize(fontSize));
  setStorageItem('dynamicTranslationFontSize', fontSize);
};
  useEffect(() => {
  setSelectedLayout(pageLayout);
  setSelectedTheme(pageTheme);
}, [isFocused]);
  return (
    <View style={styles.safeAreaView}>
      <Header
        title={'Display & Setting'}
       onPressLeftIcon={() => {
  if (isFromPage) {
    navigation.push('SurahFullView', {
      selectedPageItem: selectedPageItem,
    });
  }
  else if (from === 'ruku') {
    navigation.navigate('SurahDetailPage', {
      from: 'ruku',
      rukuNumber: rukuNumber,
      selectedSurahItems: selectedSurahItems,
    });
  }
  else if (fromqc === 'qurancompletion') {
    navigation.navigate('SurahDetailPage', {
      fromqc: 'qurancompletion',
      surahNumber: surahNumber,
      headersurahname: headersurahname,
      selectedSurahItems: selectedSurahItems,
    });
  }
  else if (fromjuz) {
    navigation.navigate('SurahDetailPage', {
      fromjuz: true,
      selectedSurahItems: selectedSurahItems,
    });
  }
  else {
    navigation.navigate('SurahDetailPage', {
      selectedSurahItems: selectedSurahItems,
    });
  }
}}
        rightIcon={false}
      />


<ScrollView>
        <View style={styles.mainView}>
          <View style={styles.selectFontMainView}>
            <RegularText text={'Arabic Font'} />
          </View>
          <Dropdown
            style={styles.dropdownStyle}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={arabicFontList}
            search={false}
            maxHeight={200}
            labelField="fontTitle"
            valueField="id"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={selectFont}
            onChange={item => {
              onSelectFont(item);
            }}
            renderRightIcon={() => (
              <View>
                <Image
                  source={IMAGES.dropdownArrowIcon}
                  style={styles.dropdownIcon}
                />
              </View>
            )}
            renderItem={renderItem}
          />
          <HorizontalView
            mainViewCustomeStyle={styles.horizontalViewCustomeStyle}
            isLeftImage={IMAGES.textIcon}
            leftViewText={`Arabic Font Size - ${arabicFontSizeValue}`}
          />
          <Slider
            style={styles.slider}
            minimumValue={minFontSize}
            maximumValue={maxFontSize}
            value={arabicFontSizeValue}
            step={1}
            onValueChange={sliderValue => {
              onChangeArabicFontSize(sliderValue);
            }}
            minimumTrackTintColor={COLORS.yellow}
            maximumTrackTintColor={COLORS.secondGray}
            thumbTintColor={COLORS.yellow}
          />
          <View style={styles.fontSizeView}>
            <Text
              style={[
                styles.textStyle,
                {
                  ...FONTSTYLE(
                    Platform.OS === 'android'
                      ? selectFont?.key
                      : FONTS[selectFont?.key],
                    arabicFontSizeValue,
                  ).arabicText,
                  lineHeight:
                    Platform.OS === 'android' ? arabicFontSizeValue * 1.9 : 0,
                },
              ]}>
              {'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ '}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FullView;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainView: {
    backgroundColor: COLORS.white,
    paddingVertical: '8@s',
    paddingHorizontal: '15@s',
    marginBottom: '8@s',
  },
  line: {
    height: 1.2,
    backgroundColor: COLORS.secondGray,
  },
  lineView: {
    height: 1,
    marginVertical: '10@s',
    backgroundColor: COLORS.lightSlateGray,
    width: '100%',
  },
  selectFontMainView: {paddingVertical: '8@s'},
  dropdownStyle: {
    width: '100%',
    height: '42@s',
    paddingHorizontal: '15@s',
    borderRadius: '6@s',
    borderColor: COLORS.secondGray,
    borderWidth: 1.3,
  },
  dropdownIcon: {
    height: '24@s',
    width: '24@s',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  dropdownItemStyle: {
    padding: '12@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {marginBottom: '10@s'},
  horizontalViewCustomeStyle: {paddingVertical: 0, paddingTop: '8@s'},
  fontSizeView: {
    padding: '10@s',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: COLORS.paleGray,
    borderRadius: 10,
    justifyContent: 'center',
  },
  placeholderStyle: {
    fontSize: 14,
    color: COLORS.thirdGray,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: COLORS.black,
  },
  iconStyle: {
    width: '20@s',
    height: '20@s',
  },
  inputSearchStyle: {
    height: '32@s',
    fontSize: 14,
  },
  detailContainer: {
    padding: '10@s',
    borderColor: COLORS.lightSlateGray,
    marginBottom: '8@s',
    borderWidth: 1.2,
    borderColor: COLORS.paleGray,
    borderRadius: 10,
  },

  caption: {
    color: COLORS.slateGray,
    textAlign: 'left',
  },
  line: {
    height: 1,
    marginVertical: '10@s',
    backgroundColor: COLORS.lightSlateGray,
  },
  buttonMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5@s',
    padding: '10@s',
  },
  buttonViewStyle: {flex: 1, marginHorizontal: '5@s'},
  textStyle: {
    color: COLORS.black,
    textAlign: 'center',
  },
  dropdownTitleText: {color: COLORS.black},
  advImageContainer: {
    width: "100%",
    height: 30,  
    flexDirection:'row',
    marginTop:20,
  },
  sectionTitle: {
  fontSize: '16@s',
  fontWeight: '600',
  color: COLORS.wasilnewthemecolorsecond,
  marginBottom: '10@s',
},

layoutRow: {
  flexDirection: 'row',
  alignSelf:"center",
  
},

layoutCard: {
  width: '23%',
  height:140,
  marginLeft:20,
  paddingHorizontal: '6@s',
  alignItems: 'center',
  position: 'relative', 
},

layoutCardActive: {
 height:100,
 borderColor: COLORS.wasilnewthemecolorsecondBlue,
 borderRadius: 10,
 borderWidth: 1,
},

layoutIcon: {
  width: '80@s',
  height: '80@s',
  resizeMode: 'contain',
  marginBottom: '2@s',
},

layoutLabel: {
  marginTop:10,
  fontSize: '8@s',
  color: COLORS.black,
  textAlign: 'center',
},

layoutLabelActive: {
  color: COLORS.wasilnewthemecolorsecondBlue,
  fontWeight: '600',
},

themeCard: {
  padding: '14@s',
  borderRadius: 14,
  marginBottom: '12@s',
  borderWidth: 1,
  borderColor: COLORS.paleGray,
},

themeActive: {
  borderWidth: 2,
  borderColor: COLORS.wasilnewthemecolorsecondBlue,
},

themeArabic: {
  fontSize: '18@s',
  textAlign: 'center',
  marginBottom: '6@s',
},

themeTranslation: {
  fontSize: '13@s',
  textAlign: 'center',
},
tickContainer: {
  position: 'absolute',
  top: '6@s',
  right: '6@s',
  width: '18@s',
  height: '18@s',
  borderRadius: 9,
  backgroundColor: COLORS.wasilnewthemecolorsecondBlue,
  alignItems: 'center',
  justifyContent: 'center',

  zIndex: 10,
  elevation: 10,
},

tickText: {
  color: COLORS.white,
  fontSize: '12@s',
  fontWeight: '700',
},
});
