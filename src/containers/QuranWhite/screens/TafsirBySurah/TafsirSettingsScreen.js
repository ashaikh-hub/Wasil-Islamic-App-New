import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Platform
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Header from '../../components/Header';
import {COLORS, FONTS, FONTSTYLE} from '../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {getTafsirs} from '../../api';
import {getTafsirsLanguageOptions} from '../../helper/helperUtils';
import {capitalizeWords} from '../../helper/utils';
import {setStorageItem} from '../../mmkvStorage/storeData';
import {
  setTafseerAuthor,
  setTafseerLanguage,
} from '../../redux/reduxToolkit/store/servicesSlice';
import {Colors} from '../../../../theme';

const TafsirSettingsScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const tafseerLanguage = useSelector(
    state => state.services.tafseerLanguage,
  );
  const tafseerAuthor = useSelector(
    state => state.services.tafseerAuthor,
  );

  const [languagesList, setLanguagesList] = useState([]);
  const [selectLanguage, setSelectLanguage] = useState(
    tafseerLanguage,
  );

  const [authorList, setAuthorList] = useState([]);
  const [selectAuthor, setSelectAuthor] = useState(
    tafseerAuthor,
  );

  useEffect(() => {
    if (selectLanguage) {
      getTafseerAuthor(selectLanguage.language);
    }
  }, [selectLanguage]);

  const getTafseerAuthor = async language => {
    const tafseerAuthorData = await getTafsirs(language);

    const filterLanguage = tafseerAuthorData?.tafsirs?.filter(item => {
      return item.languageName === language;
    });

    setAuthorList(filterLanguage);

    const languageOptions = tafseerAuthorData
      ? getTafsirsLanguageOptions(filterLanguage)
      : [];

    const formattedLanguages = languageOptions.map((item, index) => ({
      ...item,
      id: index + 1,
      name: capitalizeWords(item.name),
      language: item.name,
    }));

    setLanguagesList(formattedLanguages);

    if (filterLanguage.length > 0) {
      setSelectAuthor(filterLanguage[0]);
      dispatch(setTafseerAuthor(filterLanguage[0]));
      setStorageItem('tafseerAuthor', filterLanguage[0]);
    }
  };

  const selectTranslationLanguage = item => {
    setSelectLanguage(item);
    dispatch(setTafseerLanguage(item));
    setStorageItem('tafseerLanguage', item);
  };

  const selectTafseerAuthor = item => {
    setSelectAuthor(item);
    dispatch(setTafseerAuthor(item));
    setStorageItem('tafseerAuthor', item);
  };

  return (
    <View style={styles.safeAreaView}>
      <Header
        title="Tafsir"
        onPressLeftIcon={() => navigation.goBack()}
        rightIcon={false}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Language */}
        <Text style={styles.heading}>Please Select Language</Text>

        <View style={styles.gridContainer}>
  {languagesList.map(item => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.gridItem,
        selectLanguage?.id === item.id && styles.selectedGridItem,
      ]}
      onPress={() => selectTranslationLanguage(item)}>
      <Text
        style={[
          styles.gridItemText,
          selectLanguage?.id === item.id &&
            styles.selectedGridItemText,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ))}
</View>

        {/* Mufassir */}
        <Text style={[styles.heading, {marginTop: 20}]}>
          Please Select Mufassir
        </Text>

      <View style={styles.gridContainer}>
  {authorList.map(item => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.gridItem,
        selectAuthor?.id === item.id && styles.selectedGridItem,
      ]}
      onPress={() => selectTafseerAuthor(item)}>
      <Text
        style={[
          styles.gridItemText,
          selectAuthor?.id === item.id &&
            styles.selectedGridItemText,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ))}
</View>
      </ScrollView>
    </View>
  );
};

export default TafsirSettingsScreen;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  container: {
    padding: '16@s',
    paddingBottom: '30@s',
  },

  heading: {
    fontFamily:Platform.OS === 'ios' ? "Asul-Regular" : "AsulRegular",
    fontSize: '16@s',
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: '12@s',
  },

  listItem: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 20,
    paddingVertical: '16@s',
    paddingHorizontal: '18@s',
    marginBottom: '12@s',
  },

  selectedListItem: {
    backgroundColor: Colors.wasilnewthemecolorsecond,
    borderColor: Colors.wasilnewthemecolorsecond,
  },

  listItemText: {
    fontSize: '12@s',
    color: Colors.secondary,
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
    fontWeight: '500',
  },

  selectedListItemText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  loaderViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  mainView: {
    backgroundColor: Colors.white,
    paddingVertical: '8@s',
    paddingHorizontal: '15@s',
    marginBottom: '8@s',
    flex: 1,
  },

  noDataViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noDataTextStyle: {
    ...FONTSTYLE(FONTS.poppinsMedium).inputBody,
  },

  gridContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},

gridItem: {
  width: '48%',
  backgroundColor: Colors.white,
  borderWidth: 1,
  borderColor: '#E2E2E2',
  borderRadius: 20,
  paddingVertical: '16@s',
  paddingHorizontal: '10@s',
  marginBottom: '12@s',
  alignItems: 'center',
  justifyContent: 'center',
},

selectedGridItem: {
  backgroundColor: Colors.wasilnewthemecolorsecond,
  borderColor: Colors.wasilnewthemecolorsecond,
      fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
},

gridItemText: {
  fontSize: '12@s',
  color: Colors.secondary,
  textAlign: 'center',
  fontWeight: '500',
      fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
},

selectedGridItemText: {
  color: Colors.white,
  fontWeight: '600',
},
});