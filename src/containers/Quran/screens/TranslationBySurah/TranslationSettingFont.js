import Slider from '@react-native-community/slider';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import HorizontalView from '../../components/HorizontalView';
import {setStorageItem} from '../../mmkvStorage/storeData';
import {setTranslationFontSize,} from '../../redux/reduxToolkit/store/servicesSlice';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../../theme';

const TranslationSettingFont = ({navigation, route}) => {

  const translationFontSize = useSelector(
    state => state.services.translationFontSize,
  );

  let minFontSize = 10;
  let maxFontSize = 40;
  const isFocused = useIsFocused();

  const [translationFontSizeValue, setTranslationFontSizeValue] =
    useState(translationFontSize);
  const dispatch = useDispatch();

  useEffect(() => {
    setTranslationFontSizeValue(translationFontSize);
  }, [isFocused]);

  const onChangeTranslationFontSize = fontSize => {
  setTranslationFontSizeValue(fontSize);

  dispatch(setTranslationFontSize(fontSize));
  setStorageItem('dynamicTranslationFontSize', fontSize);
  };
  return (
    <View style={styles.safeAreaView}>
      <Header
        title={'Font Scaling'}
       onPressLeftIcon={() => {
 navigation.goBack();
}}
        rightIcon={false}
      />


<ScrollView>
        <View style={styles.mainView}>
          <HorizontalView
            mainViewCustomeStyle={styles.horizontalViewCustomeStyle}
            isLeftImage={IMAGES.textIcon}
            leftViewText={`Translation Font Size - ${translationFontSizeValue}`}
          />
          <Slider
            style={styles.slider}
            minimumValue={minFontSize}
            maximumValue={maxFontSize}
            value={translationFontSizeValue}
            step={1}
            onValueChange={sliderValue => {
              onChangeTranslationFontSize(sliderValue);
            }}
            minimumTrackTintColor={COLORS.yellow}
            maximumTrackTintColor={COLORS.secondGray}
            thumbTintColor={COLORS.yellow}
          />
          <View style={styles.detailContainer}>
            <View style={styles.lineView} />
            <Text
              style={[
                styles.caption,
                {
                  ...FONTSTYLE(FONTS.poppinsLight, translationFontSizeValue)
                    .arabicText1,
                },
              ]}>
              {
                'In the name of Allah, the Entirely Merciful, the Especially Merciful'
              }
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default TranslationSettingFont;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
  },
  mainView: {
    backgroundColor: '#FFFFFF',
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

  zIndex: 10,          // ✅ iOS
  elevation: 10,       // ✅ Android
},

tickText: {
  color: '#FFFFFF',
  fontSize: '12@s',
  fontWeight: '700',
},
});
