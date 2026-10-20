import {groupBy, isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
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
import {COLORS, IMAGES} from '../../theme';

const Translations = ({navigation}) => {
  //
  const translationList = useSelector(state => state.services.translationList);
  const translationLanguage = useSelector(
    state => state.services.translationLanguage,
  );
  const [selectLanguage, setSelectLanguage] = useState(translationLanguage);
  const [selectedItems, setSelectedItems] = useState(translationList);
  const [translationsData, setTranslationsData] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [translationDataByLanguages, settranslationDataByLanguages] = useState(
    [],
  );

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
    const translationData = await getAvailableTranslations('en');
    const translationByLanguages = groupBy(
      translationData?.translations,
      'languageName',
    );
    settranslationDataByLanguages(translationByLanguages);
  };

  const getTranslationsData = async selectLanguage => {
    const selectedTranslationGroup = translationDataByLanguages[selectLanguage];

    const translationLanguages = Object.keys(translationDataByLanguages);

    const languagesList = translationLanguages?.map((language, index) => ({
      id: index + 1,
      name: capitalizeWords(language),
      language,
    }));
    const filterArray = selectedTranslationGroup?.filter(
      item => item?.authorName != 'Transliteration',
    );
    setLanguagesList(languagesList);
    setTranslationsData(filterArray);
  };

 const saveTranslationSettings = (language, translationId, goBack = true) => {
  dispatch(setTranslationLanguage(language));
  setStorageItem('translationLanguage', language);

  dispatch(setTranslationList(translationId));
  setStorageItem('translationList', translationId);

  if (goBack) {
    navigation?.goBack();
  }
};
  const selectTranslationLanguage = item => {
  setSelectLanguage(item);

  const selectedTranslationGroup = translationDataByLanguages[item.language];

  const filterArray = selectedTranslationGroup?.filter(
    translation => translation?.authorName !== 'Transliteration',
  );

  setTranslationsData(filterArray);
  if (filterArray?.length > 0) {
    setSelectedItems(filterArray[0].id);
  }
};

  const renderItem = ({item}) => {
    const isSelected = selectedItems === item?.id;
    const borderColor = isSelected ? COLORS.yellow : COLORS.lightSlateGray;
    return (
      <View>
        <HorizontalView
          mainViewCustomeStyle={[
            styles.horizontalViewCustomeStyle,
            {borderColor: borderColor},
          ]}
          leftViewTextStyle={{color: COLORS?.wasilnewthemecolorsecondGray}}
          leftViewText={item?.translatedName?.name}
          isLeftImage={IMAGES.unSelectBackGroundImg}
        
         onPress={() => {
  setSelectedItems(item.id);
  saveTranslationSettings(selectLanguage, item.id);
}}
        />
      </View>
    );
  };

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.mainView}>
        <DropDownComponent
          data={languagesList}
          maxHeight={250}
          labelField="name"
          valueField="id"
          placeholderText="Select Language"
          searchPlaceholder="Search..."
          onChange={item => {
            selectTranslationLanguage(item);
          }}
          value={selectLanguage}
        />
      </View>
      <View style={styles.flatListView}>
        <FlatList
          data={translationsData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
  },
  mainView: {paddingVertical: '13@s', paddingHorizontal: '15@s',backgroundColor:'#FFFFFF'},
  flatListView: {
    flex: 1,
    paddingVertical: '10@s',
    paddingHorizontal: '15@s',
    backgroundColor: '#FFFFFF',
  },
  horizontalViewCustomeStyle: {
    paddingHorizontal: '12@s',
    marginVertical: '5@s',
    paddingVertical: '8@s',
    borderRadius: '10@s',
    borderWidth: 1.3,
    backgroundColor: '#FFFFFF',
  },
  leftIcon: {
    height: '65@s',
    width: '65@s',
    borderRadius: '35@s',
    backgroundColor: COLORS.paleGray,
  },
  buttonMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '5@s',
    padding: '10@s',
  },
  buttonViewStyle: {flex: 1, marginHorizontal: '5@s'},
});
export default Translations;
