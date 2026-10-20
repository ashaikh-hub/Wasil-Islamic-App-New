import React, { useEffect, useState,useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  useWindowDimensions,
  BackHandler,
  ScrollView,
  Text,
  Platform
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { getTafsirs } from '../../api';

import {
  setArabic,
  setArabicFont,
  setArabicFontSize,
  setChapterDetail,
  setJuzList,
  setPagesList,
  setTafseerAuthor,
  setTafseerLanguage,
  setTranslation,
  setTranslationFontSize,
  setTranslationLanguage,
  setTranslationList,
  setTransliteration,
  setTransliterationLanguage,
  setTransliterationList,
} from '../../redux/reduxToolkit/store/servicesSlice';
import { COLORS, FONTS, FONTSTYLE } from '../../theme';
import { getAllChaptersData } from '../../utils/chapter';
import JuzList from '../JuzList';
import SurahList from '../SurahList';
import Rukuz from '../Rukuz';
import { useFocusEffect } from '@react-navigation/native';
import { juzDataList } from '../../data/juzDataList';
import localeLanguage from '../../helper/localLanguage';
import { getStorageItem, setStorageItem } from '../../mmkvStorage/storeData';
import { setRecitersDataList } from '../../redux/reduxToolkit/store/recitersDataList';
import recitersData from '../../utils/reciters.json'
import { Colors } from '../../../../theme';

const DashBoard = ({ navigation, route }) => {
  const selectedTafseerLanguage = useSelector(
    state => state.services.tafseerLanguage,
  );
  const reciters = getStorageItem('reciters');
  const dynamicArabicFontSize = getStorageItem('dynamicArabicFontSize');
  const dynamicTranslationFontSize = getStorageItem(
    'dynamicTranslationFontSize',
  );
  const isArabicFont = getStorageItem('isArabicFont');
  const isArabic = getStorageItem('isArabic');
  const isTranslation = getStorageItem('isTranslation');
  const isTransliteration = getStorageItem('isTransliteration');
  const translationList = getStorageItem('translationList');
  const translationLanguage = getStorageItem('translationLanguage');
  const transliterationList = getStorageItem('transliterationList');
  const transliterationLanguage = getStorageItem('transliterationLanguage');
  const tafseerLanguage = getStorageItem('tafseerLanguage');
  const tafseerAuthor = getStorageItem('tafseerAuthor');

  const [index, setIndex] = useState(0);
  const [searchbarVisible, setSearchbarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [allSurahList, setAllSurahList] = useState([]);
  const [allJuzList, setAllJuzList] = useState([]);
  const [allPagesList, setAllPagesList] = useState([]);
  const tabScrollRef = useRef(null);
  const tabLayouts = useRef({});

  const dispatch = useDispatch();
  const layout = useWindowDimensions();
  const [routes] = useState([
    { key: 'surah', title: 'Surah' },
    { key: 'juz', title: 'Juz' },
    { key: 'rukus', title: 'Rukus' },
    
  ]);

  const MemoizedSurahList = React.memo(SurahList);
  const MemoizedJuzList = React.memo(JuzList);
  const MemoizedRukuzList = React.memo(Rukuz);

  const renderScene = SceneMap({
    surah: () => <MemoizedSurahList navigation={navigation} route={route} />,
    juz: () => <MemoizedJuzList navigation={navigation} />,
    rukus: () => <MemoizedRukuzList navigation={navigation} />,
  });

const renderTabBar = props => {
  const currentIndex = props.navigationState.index;

  return (
    <View style={styles.tabWrapper}>
      <View style={styles.browseRow}>

        <View style={styles.titleContainer}>
          <View style={styles.leftIndicator} />
          <Text style={styles.headerText}>Browse Quran</Text>
        </View>

        <View style={styles.segmentContainer}>
          {props.navigationState.routes.map((route, i) => {
            const isFocused = currentIndex === i;

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.8}
                onPress={() => setIndex(i)}
                style={[
                  styles.segmentButton,
                  isFocused && styles.segmentButtonActive,
                ]}>
                <Text
                  style={[
                    styles.segmentText,
                    isFocused && styles.segmentTextActive,
                  ]}>
                  {route.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>
    </View>
  );
};

  const onClickSearchIcon = () => {
    setSearchText('');
    getChaptersData(localeLanguage);
    getJuzData();
    setSearchbarVisible(true);
  };
  useEffect(() => {
    getChaptersData(localeLanguage);
    getJuzData();
    pagesListData();
  }, [localeLanguage]);
  useFocusEffect(React.useCallback(() => { }, []));
  useEffect(() => {
    if (route?.params?.selectedSurahItems) {
      setIndex(route?.params?.tabIndex);
    }
  }, [route?.params]);
  useEffect(() => {
   getAll();
  }, []);
 const getAll = async () => {
    if (dynamicArabicFontSize?.length != 0) {
      dispatch(setArabicFontSize(dynamicArabicFontSize));
    }
    if (dynamicTranslationFontSize?.length != 0) {
      dispatch(setTranslationFontSize(dynamicTranslationFontSize));
    }
    if (isArabicFont?.length != 0) {
      dispatch(setArabicFont(isArabicFont));
    }

    if (isArabic?.length != 0) {
      dispatch(setArabic(isArabic));
    }
    if (isTranslation?.length != 0) {
      dispatch(setTranslation(isTranslation));
    }
    if (isTransliteration?.length != 0) {
      dispatch(setTransliteration(isTransliteration));
    }

    if (translationList?.length != 0) {
      dispatch(setTranslationList(translationList));
    }
    if (translationLanguage?.length != 0) {
      dispatch(setTranslationLanguage(translationLanguage));
    }

    if (transliterationList?.length != 0) {
      dispatch(setTransliterationList(transliterationList));
    }
    if (transliterationLanguage?.length != 0) {
      dispatch(setTransliterationLanguage(transliterationLanguage));
    }

    if (tafseerLanguage?.length != 0) {
      dispatch(setTafseerLanguage(tafseerLanguage));
    }

    if (tafseerAuthor?.length != 0) {
      dispatch(setTafseerAuthor(tafseerAuthor));
    }
    getReciterData();
    if (tafseerAuthor?.length == 0) {
      getTafseerAuthor();
    }

    const unsubscribe = navigation.addListener('blur', async () => {
      setSearchText('');
      setSearchbarVisible(false);
    });
    return () => {
      unsubscribe();
    };
  };
  const getChaptersData = async lag => {
    const chaptersData = await getAllChaptersData();
  
    const chapterDataWithIds = Object.entries(chaptersData).map(
      ([id, chapter]) => ({
        ...chapter,
        id, 
      }),
    );
  
    setAllSurahList(chapterDataWithIds);

    dispatch(setChapterDetail(chapterDataWithIds));
  };
  const getJuzData = async () => {
    const juzData = juzDataList;
    const juzList = juzData.map((item, index) => ({
      ...item,
      id: item.index + 1,
      juzNumber: `Juz ${item.index + 1}`,
    }));
    setAllJuzList(juzList);
    dispatch(setJuzList(juzList));
  };
  const pagesListData = () => {
    const pageItems = [];
    for (let i = 1; i <= 604; i++) {
      pageItems.push({ id: i, pageNumber: `Page ${i}` });
    }
    setAllPagesList(pageItems);
    dispatch(setPagesList(pageItems));
  };
  const getReciterData = async () => {
  const updatedArray = recitersData
    ?.filter(
      (value, index, self) =>
        index === self.findIndex(item => item?.name === value?.name)
    )
    .filter(item => ![161, 168, 173].includes(item?.id));

  dispatch(setRecitersDataList(updatedArray));

  if (reciters?.length === 0) {
    setStorageItem('reciters', updatedArray[0]);
  } else {
    console.log("Data");
  }
  };
  const getTafseerAuthor = async () => {
    const lang = selectedTafseerLanguage?.name
      ? selectedTafseerLanguage?.name
      : 'english';
    const tafseerAuthorData = await getTafsirs(lang);
    dispatch(setTafseerAuthor(tafseerAuthorData?.tafsirs[0]));
  };
  useEffect(() => {
    handleSearchBySurah(searchText);
    handleSearchByJuz(searchText);
    handleSearchByPage(searchText);
  }, [searchText]);
  const handleSearchBySurah = text => {
    if (text) {
      const filterChapterDetail = allSurahList?.filter(item => {
        const itemData = item?.transliteratedName?.toUpperCase();
        const textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      dispatch(setChapterDetail(filterChapterDetail));
    } else {
      getChaptersData(localeLanguage);
    }
  };
  const handleSearchByJuz = text => {
    if (text) {
      const filterJuzDetail = allJuzList.filter(item => {
        const itemData = item?.juzNumber;
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      dispatch(setJuzList(filterJuzDetail));
    } else {
      getJuzData();
    }
  };
  const handleSearchByPage = text => {
    if (text) {
      const filterPagesDetail = allPagesList?.filter(item => {
        const itemData = String(item?.pageNumber);
        const textData = String(text);
        return itemData.indexOf(textData) > -1;
      });
      dispatch(setPagesList(filterPagesDetail));
    } else {
      pagesListData();
    }
  };
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('QuranMainDashboard');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
    
    
     <TabView
  navigationState={{ index, routes }}
  renderScene={renderScene}
  renderTabBar={renderTabBar}
  onIndexChange={setIndex}
  initialLayout={{ width: layout.width }}
  lazy
/>
    </View>
  );
};

export default DashBoard;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.intermediate1
  },
  tabBarContent: {
  paddingHorizontal: 30,
  alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: '10@s',
  },
  chip: {
    paddingVertical: '8@s',
    paddingHorizontal: '18@s',
    borderRadius: '8@s',
    borderWidth: 1,
    marginHorizontal: '2@s',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '5@s',
    paddingBottom: '14@s',
  },

  tabWrapper: {
  backgroundColor: Colors.intermediate1,
  paddingHorizontal: 16,
  paddingVertical: 12,
},

browseRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

titleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},

leftIndicator: {
  width: 4,
  left:5,
  height: 32,
  borderRadius: 10,
  backgroundColor: Colors.secondary1,
},

headerText: {
  marginLeft: 15,
  fontSize: 14,
  fontWeight: '700',
  color: Colors.white,
},

segmentContainer: {
  backgroundColor:Colors.secondary1,
  flexDirection: 'row',
  width: 230, 
  height: 42,
  borderWidth: 2,
  borderColor: Colors.secondary1,
  borderRadius: 10,
  overflow: 'hidden',
},

segmentButton: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},

segmentButtonActive: {
  backgroundColor: Colors.primary,
},

segmentText: {
  fontSize: 15,
  color: Colors.black,
  fontFamily: Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
},

segmentTextActive: {
  color: '#FFFFFF',
  fontWeight: '600',
},
});
