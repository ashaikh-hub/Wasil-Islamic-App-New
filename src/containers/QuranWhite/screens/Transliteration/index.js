import {groupBy, isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {getAvailableTranslations} from '../../api';
import Button from '../../components/Button';
import DropDownComponent from '../../components/DropDownComponent';
import HorizontalView from '../../components/HorizontalView';
import {setStorageItem} from '../../mmkvStorage/storeData';
import {
  setTransliterationLanguage,
  setTransliterationList,
} from '../../redux/reduxToolkit/store/servicesSlice';
import {COLORS, IMAGES} from '../../theme';

const Transliteration = ({navigation}) => {
  //
  const transliterationList = useSelector(
    state => state.services.transliterationList,
  );
  const transliterationLanguage = useSelector(
    state => state.services.transliterationLanguage,
  );

  const defaultLanguage = {
    _index: 0,
    id: 1,
    language: 'english',
    name: 'English',
  };

  const [selectLanguage, setSelectLanguage] = useState(transliterationLanguage);
  const [selectedItems, setSelectedItems] = useState(transliterationList);
  const [transliterationData, setTransliterationData] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [transliterationDataByLanguages, setTransliterationDataByLanguages] =
    useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getTransliterationLanguages();
  }, []);

  useEffect(() => {
    if (!isEmpty(transliterationDataByLanguages)) {
      getTranslationsData(selectLanguage?.language);
    }
  }, [transliterationDataByLanguages, selectLanguage]);

  const getTransliterationLanguages = async () => {
    const translationData = await getAvailableTranslations('en');
    const translationByLanguages = groupBy(
      translationData?.translations,
      'languageName',
    );
    setTransliterationDataByLanguages(translationByLanguages);
  };
  const getTranslationsData = async selectLanguage => {
    const selectedTranslationGroup =
      transliterationDataByLanguages[selectLanguage];
    const filterArray = selectedTranslationGroup?.filter(
      item => item?.authorName != 'Transliteration',
    );

    setLanguagesList([defaultLanguage]);
    setTransliterationData(filterArray);
  };

  const onClickSave = () => {
    dispatch(setTransliterationList(selectedItems));
    setStorageItem('transliterationList', selectedItems);

    dispatch(setTransliterationLanguage(selectLanguage));
    setStorageItem('transliterationLanguage', selectLanguage);
    navigation?.goBack();
  };

  const onClickReset = () => {
    dispatch(setTransliterationList(131));
    setStorageItem('transliterationList', 131);

    dispatch(setTransliterationLanguage(defaultLanguage));
    setStorageItem('transliterationLanguage', defaultLanguage);
    navigation?.goBack();
  };

  const selectTransliterationLanguage = item => {
    setSelectLanguage(item);
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
            setSelectedItems(item?.id);
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
            selectTransliterationLanguage(item);
          }}
          value={selectLanguage}
        />
      </View>
      <View style={styles.flatListView}>
        <FlatList
          data={transliterationData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={styles.buttonMainView}>
        <View style={styles.buttonViewStyle}>
          <Button
            title="Reset"
            onPress={() => {
              onClickReset();
            }}
            textColor={COLORS.white}
            style={{
              backgroundColor: COLORS.yellow,
              borderRadius: 10,
            }}
          />
        </View>

        <View style={styles.buttonViewStyle}>
          <Button
            title="Save"
            onPress={() => {
              onClickSave();
            }}
            textColor={COLORS.white}
            style={{
              backgroundColor: COLORS.wasilnewthemecolorsecondBlue,
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
  },
  mainView: {paddingVertical: '13@s', paddingHorizontal: '15@s'},
  flatListView: {
    flex: 1,
    paddingVertical: '10@s',
    paddingHorizontal: '15@s',
    backgroundColor: COLORS.white,
  },
  horizontalViewCustomeStyle: {
    paddingHorizontal: '12@s',
    marginVertical: '5@s',
    paddingVertical: '8@s',
    borderRadius: '10@s',
    borderWidth: 1.3,
    backgroundColor: COLORS.white,
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
export default Transliteration;
