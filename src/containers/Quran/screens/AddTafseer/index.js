import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Header from '../../components/Header';
import {COLORS, FONTS, FONTSTYLE} from '../../theme';

import RenderHTML from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import {getTafsirContent, getTafsirs} from '../../api';
import DropDownComponent from '../../components/DropDownComponent';
import {getTafsirsLanguageOptions} from '../../helper/helperUtils';
import {capitalizeWords} from '../../helper/utils';
import {setStorageItem} from '../../mmkvStorage/storeData';
import {
  setTafseerAuthor,
  setTafseerLanguage,
} from '../../redux/reduxToolkit/store/servicesSlice';

const AddTafseer = ({navigation, route}) => {
  const dispatch = useDispatch();
  const tafseerLanguage = useSelector(state => state.services.tafseerLanguage);
  const tafseerAuthor = useSelector(state => state.services.tafseerAuthor);
  const [showLoader, setShowLoader] = useState(false);
  const [languagesList, setLanguagesList] = useState([]);
  const [selectLanguage, setSelectLanguage] = useState(tafseerLanguage);

  const [authorList, setAuthorList] = useState([]);
  const [selectAuthor, setSelectAuthor] = useState(tafseerAuthor);
  const [authorContaintent, setAuthorContaintent] = useState([]);

  useEffect(() => {
    getTafseerAuthorContent(tafseerAuthor?.id);
  }, []);
  useEffect(() => {
    if (selectLanguage) {
      getTafseerAuthor(selectLanguage?.language);
    }
  }, [selectLanguage]);

  const getTafseerAuthor = async selectLanguage => {
    const tafseerAuthorData = await getTafsirs(selectLanguage);
    const filterLanguage = tafseerAuthorData?.tafsirs?.filter(item => {
      return item?.languageName == selectLanguage;
    });
    setAuthorList(filterLanguage);

    const languageOptions = tafseerAuthorData
      ? getTafsirsLanguageOptions(filterLanguage)
      : [];
    const translationLanguages = languageOptions;

    const languagesList = translationLanguages?.map((language, index) => ({
      ...language,
      id: index + 1,
      name: capitalizeWords(language?.name),
      language: language?.name,
    }));
    setLanguagesList(languagesList);

    setSelectAuthor(filterLanguage[0]);
    dispatch(setTafseerAuthor(filterLanguage[0]));
    setStorageItem('tafseerAuthor', filterLanguage[0]);
    setAuthorContaintent(filterLanguage[0]);

    getTafseerAuthorContent(filterLanguage[0]?.id);
  };
  const getTafseerAuthorContent = async authorId => {
    if (authorId) {
      setShowLoader(true);
      try {
        const tafseerAuthorData = await getTafsirContent(
          authorId,
          route?.params?.verseKey,
        );
        setAuthorContaintent(tafseerAuthorData?.tafsir?.text);
        setShowLoader(false);
      } catch (err) {
        setShowLoader(false);
        console.error('Error error message==>', err);
      }
    } else {
      Alert.alert(
        '',
        'Please select author ',
        [
          {
            text: 'OK',
            onPress: () => {},
            style: 'default',
          },
        ],
        {cancelable: false},
      );
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

    getTafseerAuthorContent(item?.id);
  };
  return (
    <View style={styles.safeAreaView}>
      <Header
        title={'Tafsir'}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        rightIcon={false}
      />

      {showLoader ? (
        <View style={styles?.loaderViewStyle}>
          <ActivityIndicator size="large" color={COLORS.wasilnewthemecolorsecondBlue} />
        </View>
      ) : (
        <>
          {authorContaintent?.length == 0 ? (
            <View style={styles.noDataViewStyle}>
              <Text style={styles.noDataTextStyle}>No Data Found</Text>
            </View>
          ) : (
            <ScrollView style={styles.container}>
              <RenderHTML
                contentWidth={400}
                tagsStyles={{
                  h1: {
                    fontFamily: FONTS.poppinsRegular,
                    fontSize: 26,
                    lineHeight: 26,
                    color: COLORS.blue,
                  },
                  h2: {
                    fontFamily: FONTS.poppinsMedium,
                    fontSize: 16,
                    lineHeight: 18,
                    color: COLORS.wasilnewthemecolorsecondBlue,
                    top:5
                  },
                  h3: {
                    fontFamily: FONTS.poppinsMedium,
                    fontSize: 14,
                    lineHeight: 16,
                    color: COLORS.wasilnewthemecolorsecondBlue,
                   
                  },
                  h4: {
                    ...FONTSTYLE(FONTS.poppinsMedium).inputBody,
                    color: COLORS.black,
                  },
                  h5: {
                    ...FONTSTYLE(FONTS.poppinsRegular).inputBody,
                    color: COLORS.black,
                  },
                  h6: {
                    ...FONTSTYLE(FONTS.poppinsMedium).body,
                    color: COLORS.black,
                  },
                  p: {
                    marginTop: 12,
                    ...FONTSTYLE(FONTS.poppinsMedium).inputs,
                    lineHeight: 22,
                    color: COLORS.black,
                  },
                }}
                source={{html: authorContaintent}}
                baseStyle={styles.webview}
              />
            </ScrollView>
          )}
        </>
      )}

      <View style={styles.buttonMainView}>
        <View style={styles.buttonViewStyle}>
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
        <View style={styles.buttonViewStyle}>
          <DropDownComponent
            data={authorList}
            maxHeight={250}
            labelField="name"
            valueField="id"
            placeholderText="Select Author"
            searchPlaceholder="Search..."
            onChange={item => {
              selectTafseerAuthor(item);
            }}
            value={selectAuthor}
          />
        </View>
      </View>
    </View>
  );
};

export default AddTafseer;

const styles = ScaledSheet.create({
  container: {
    padding: '10@s',
  },
  loaderViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainView: {
    backgroundColor: '#FFFFFF',
    paddingVertical: '8@s',
    paddingHorizontal: '15@s',
    marginBottom: '8@s',
    flex: 1,
  },
  buttonMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5@s',
    padding: '10@s',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.25,
    elevation: 2,
  },
  buttonViewStyle: {flex: 1, marginHorizontal: '5@s'},
  webview: {
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
});
