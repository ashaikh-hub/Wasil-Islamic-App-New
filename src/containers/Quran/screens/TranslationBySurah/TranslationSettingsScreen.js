import React, {useEffect, useState} from 'react';

import {
  View,
  FlatList,
  Text
} from 'react-native';

import {groupBy, isEmpty} from 'lodash';

import {useDispatch, useSelector} from 'react-redux';

import {ScaledSheet} from 'react-native-size-matters';

import {getAvailableTranslations} from '../../api';

import Button from '../../components/Button';
import DropDownComponent from '../../components/DropDownComponent';
import HorizontalView from '../../components/HorizontalView';

import {capitalizeWords} from '../../helper/utils';

import {setStorageItem} from '../../mmkvStorage/storeData';

import {
  setTranslationLanguage,
  setTranslationList,
} from '../../redux/reduxToolkit/store/servicesSlice';
import Header from '../../components/Header';
import {COLORS, IMAGES} from '../../theme';
import { Colors } from '../../../../theme';

const TranslationSettingsScreen = ({navigation}) => {

  const translationList = useSelector(
    state => state.services.translationList,
  );

  const translationLanguage = useSelector(
    state => state.services.translationLanguage,
  );

  const [selectLanguage, setSelectLanguage] =
    useState(translationLanguage);

  const [selectedItems, setSelectedItems] =
    useState(translationList);

  const [translationsData, setTranslationsData] =
    useState([]);

  const [languagesList, setLanguagesList] =
    useState([]);

  const [
    translationDataByLanguages,
    settranslationDataByLanguages,
  ] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getTranslationsLanguages();
  }, []);

  useEffect(() => {
    if (!isEmpty(translationDataByLanguages)) {
      getTranslationsData(selectLanguage?.language);
    }
  }, [translationDataByLanguages, selectLanguage]);

  const getTranslationsLanguages = async () => {

    const translationData =
      await getAvailableTranslations('en');

    const translationByLanguages = groupBy(
      translationData?.translations,
      'languageName',
    );

    settranslationDataByLanguages(
      translationByLanguages,
    );
  };

 const getTranslationsData = async language => {
  const selectedTranslationGroup =
    translationDataByLanguages[language];

  const translationLanguages =
    Object.keys(translationDataByLanguages);

  const languages = translationLanguages?.map(
    (language, index) => ({
      id: index + 1,
      name: capitalizeWords(language),
      language,
    }),
  );

  const filterArray =
    selectedTranslationGroup?.filter(
      item =>
        item?.authorName !== 'Transliteration',
    ) || [];

  setLanguagesList(languages);
  setTranslationsData(filterArray);

  if (filterArray.length > 0) {
    const firstTranslationId = filterArray[0]?.id;

    setSelectedItems(firstTranslationId);

    dispatch(setTranslationList(firstTranslationId));
    setStorageItem(
      'translationList',
      firstTranslationId,
    );
  }
};



  const renderItem = ({item}) => {

    const isSelected =
      selectedItems === item?.id;

    return (
      <HorizontalView
        mainViewCustomeStyle={[
          styles.horizontalViewCustomeStyle,
          {
            borderColor: isSelected
              ? COLORS.yellow
              : COLORS.lightSlateGray,
          },
        ]}
        leftViewText={item?.translatedName?.name}
        leftViewTextStyle={{
          color: COLORS.wasilnewthemecolorsecondGray,
        }}
        isLeftImage={IMAGES.unSelectBackGroundImg}
        onPress={() => {
  setSelectedItems(item?.id);

  dispatch(setTranslationList(item?.id));
  setStorageItem('translationList', item?.id);

  navigation.goBack(); 
}}
      />
    );
  };

  return (
    <View style={styles.container}>
 <Header
        title={'Settings'}
       onPressLeftIcon={() => {
  navigation.goBack();
}}
        rightIcon={false}
       
      />
      <Text
                    numberOfLines={1}
                    style={
                      styles.prayerEnglishText
                    }
                  >
                    Langugage
                  </Text>
      <View style={styles.dropdownView}>

        
        <DropDownComponent
          data={languagesList}
          maxHeight={250}
          labelField="name"
          valueField="id"
          placeholderText="Select Language"
          searchPlaceholder="Search..."
          value={selectLanguage}
         onChange={item => {
  setSelectLanguage(item);

  dispatch(setTranslationLanguage(item));
  setStorageItem('translationLanguage', item);
}}
        />
      </View>


      <Text
                    numberOfLines={1}
                    style={
                      styles.prayerEnglishText1
                    }
                  >
                    Translators
                  </Text>
      <FlatList
        data={translationsData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 20,
        }}
      />
    </View>
  );
};

export default TranslationSettingsScreen;

const styles = ScaledSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  dropdownView: {
    paddingHorizontal: '15@s',
  },

  horizontalViewCustomeStyle: {
    paddingHorizontal: '12@s',
    marginVertical: '5@s',
    paddingVertical: '10@s',
    borderRadius: '10@s',
    borderWidth: 1.2,
    backgroundColor: '#FFFFFF',
  },

  buttonContainer: {
    flexDirection: 'row',
    padding: '15@s',
  },
   prayerEnglishText: {
          color: Colors.primary,
          fontSize: 15,
          fontWeight: '700',
          fontFamily:
            Platform.OS === 'ios'
              ? 'Poppins-Regular'
              : 'Raleway',
              paddingHorizontal: '15@s',
        paddingVertical: '15@s',
        },
         prayerEnglishText1: {
          top:5,
          color: Colors.primary,
          fontSize: 15,
          fontWeight: '700',
          fontFamily:
            Platform.OS === 'ios'
              ? 'Poppins-Regular'
              : 'Raleway',
              paddingHorizontal: '15@s',
        paddingVertical: '10@s',
        },
});