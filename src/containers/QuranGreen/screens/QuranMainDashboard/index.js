import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  LogBox,
  Text,
  Dimensions,
  Platform,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Alert,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getTafsirs } from '../../api';
import { Colors } from '../../../../theme';

import {
  WasilNewQuranReadGSvg,
  WasilNewQuranListenGSvg,
  WasilNewReadTranslationGSvg,
  WasilNewReadTafsirGSvg,
  WasilNewQuranReadSvgGBox,
  WasilNewQuranListenSvgGBox,
  WasilNewTransGSvg,
  WasilNewTafsirGSvg,
  WasilNewDailyWSvg,
  WasilNewDailyBWSvg
} from '../../../../assets/icons';

import {
  setArabic,
  setArabicFont,
  setArabicFontSize,
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

import { setRecitersDataList } from '../../redux/reduxToolkit/store/recitersDataList';
import { getStorageItem, setStorageItem } from '../../mmkvStorage/storeData';
import localeLanguage from '../../helper/localLanguage';
import recitersData from '../../utils/reciters.json';

LogBox.ignoreAllLogs();

const { width } = Dimensions.get('window');

const homebackgroundimage = { uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1790082663/home/homelatestbgtwo.png' };

const QuranMainDashboard = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [ayahData, setAyahData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPagesList, setAllPagesList] = useState([]);
  const selectedTafseerLanguage = useSelector(
    state => state.services.tafseerLanguage,
  );

  const reciters = getStorageItem('reciters');
  const dynamicArabicFontSize = getStorageItem('dynamicArabicFontSize');
  const dynamicTranslationFontSize = getStorageItem('dynamicTranslationFontSize');
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

  const QUICK_ACTIONS = [
    {
      id: '1',
      label: 'Read',
      subtitle: 'Holy Quran',
      icon: <WasilNewQuranReadGSvg />,
      route: 'DashBoard',
    },
    {
      id: '2',
      label: 'Listen',
      subtitle: 'Holy Quran',
      icon: <WasilNewQuranListenGSvg  />,
      route: 'RecitersList',
    },
    {
      id: '3',
      label: 'Translated',
      subtitle: 'Holy Quran',
      icon: <WasilNewReadTranslationGSvg />,
      route: 'SurahBySurah',
    },
    {
      id: '4',
      label: 'Tafsir',
      subtitle: 'Holy Quran',
      icon: <WasilNewReadTafsirGSvg />,
      route: 'TafsirBySurah',
    },
  ];

  const EXPLORE_ACTIONS = [
    {
      id: '1',
      title: 'Quran Karim',
      description: 'Read and reflect with the divine words.',
      icon: <WasilNewQuranReadSvgGBox />,
      route: 'DashBoard',
    },
    {
      id: '2',
      title: 'Listen Quran',
      description: 'Beautiful recitations by renowned Reciters.',
      icon: <WasilNewQuranListenSvgGBox />,
      route: 'RecitersList',
    },
  ];

  const LEARN_ACTIONS = [
    {
      id: '1',
      title: 'Listen Translation',
      description: 'Understand the meaning of The Quran',
      icon: <WasilNewTransGSvg />,
      route: 'TranslatorDetail',
      comingSoon: false,
    },
    {
      id: '2',
      title: 'Listen Tafsir',
      description: 'Explore the deeper wisdom of The Quran',
      icon: <WasilNewTafsirGSvg />,
      route: 'TafsirBySurah',
      comingSoon: false,
    },
  ];

 const DAILY_ACTIONS = [
  {
    id: '1',
    title: 'Daily Duas',
    subtitle: 'Duas for every moment',
    bgColor: '#F3E8FF',
    iconColor: '#8B5CF6',
    icon: <WasilNewDailyWSvg />,
    route: null, 
  },
  {
    id: '2',
    title: 'Bookmarks',
    subtitle: 'Save and revisit',
    bgColor: '#ECFDF5',
    iconColor: '#10B981',
    icon: <WasilNewDailyBWSvg />,
    route: null,
  },
];

  const pagesListData = () => {
    const pages = [];
    for (let i = 1; i <= 604; i++) {
      pages.push({ id: i, pageNumber: `Page ${i}` });
    }
    setAllPagesList(pages);
    dispatch(setPagesList(pages));
  };

  const getReciterData = async () => {
    const updatedArray = recitersData
      ?.filter(
        (value, index, self) =>
          index === self.findIndex(item => item?.name === value?.name),
      )
      .filter(item => ![161, 168, 173].includes(item?.id));

    dispatch(setRecitersDataList(updatedArray));

    if (reciters?.length === 0) {
      setStorageItem('reciters', updatedArray[0]);
    }
  };

  const getTafseerAuthor = async () => {
    const lang = selectedTafseerLanguage?.name
      ? selectedTafseerLanguage?.name
      : 'english';
    const tafseerAuthorData = await getTafsirs(lang);
    dispatch(setTafseerAuthor(tafseerAuthorData?.tafsirs[0]));
  };

  const init = async () => {
    if (dynamicArabicFontSize?.length) {
      dispatch(setArabicFontSize(dynamicArabicFontSize));
    }
    if (dynamicTranslationFontSize?.length) {
      dispatch(setTranslationFontSize(dynamicTranslationFontSize));
    }
    if (isArabicFont?.length) {
      dispatch(setArabicFont(isArabicFont));
    }
    if (isArabic?.length) {
      dispatch(setArabic(isArabic));
    }
    if (isTranslation?.length) {
      dispatch(setTranslation(isTranslation));
    }
    if (isTransliteration?.length) {
      dispatch(setTransliteration(isTransliteration));
    }
    if (translationList?.length) {
      dispatch(setTranslationList(translationList));
    }
    if (translationLanguage?.length) {
      dispatch(setTranslationLanguage(translationLanguage));
    }
    if (transliterationList?.length) {
      dispatch(setTransliterationList(transliterationList));
    }
    if (transliterationLanguage?.length) {
      dispatch(setTransliterationLanguage(transliterationLanguage));
    }
    if (tafseerLanguage?.length) {
      dispatch(setTafseerLanguage(tafseerLanguage));
    }
    if (tafseerAuthor?.length) {
      dispatch(setTafseerAuthor(tafseerAuthor));
    }

    await getReciterData();

    if (!tafseerAuthor?.length) {
      await getTafseerAuthor();
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://islamicapp.vercel.app/api/ayahoftheday',
        );
        setAyahData(response.data[0]);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    init();
    pagesListData();
    fetchData();
  }, [localeLanguage]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('GuestNew');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color={Colors.wasilnewthemecolorsecond}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text>Error fetching data</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <ImageBackground style={styles.ayahCard} resizeMode="contain" source={homebackgroundimage}>
          <View style={styles.ayahContent}>

            <View style={styles.ayahBadge}>
              <Text style={styles.ayahBadgeText}>AYAH OF THE DAY</Text>
            </View>

            <Text style={styles.arabicAyah}>
              {ayahData?.arabic ||
                ' وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ'}
            </Text>

            <Text style={styles.englishAyah}>
              {ayahData?.english ||
                'Do not falter or grieve, for you will have the upper hand, if you are "true" believers.'}
            </Text>

            <Text style={styles.surahRef}>
              {ayahData?.surah
                ? `${ayahData.surah}, verse ${ayahData.ayah}`
                : "Surah Ali-'Imran, verse 139"}
            </Text>

          </View>

        </ImageBackground>

        <Text style={styles.sectionTitle1}>Quick Actions</Text>

        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickAction}
              activeOpacity={0.8}
              onPress={() => {
                if (item.route) navigation.navigate(item.route);
              }}
            >
              <View style={styles.quickIconWrap}>{item.icon}</View>
              <Text style={styles.quickTitle}>{item.label}</Text>
              <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Explore Quran</Text>

        <Text style={styles.sectionSubtitle}>
          Deepen your connection with the words of Allah
        </Text>

        {EXPLORE_ACTIONS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.exploreCard}
            activeOpacity={0.85}
            onPress={() => {
              if (item.route) navigation.navigate(item.route);
            }}
          >
            <View style={styles.exploreIconBox}>{item.icon}</View>
            
            
            <View style={styles.exploreText}>
              <Text style={styles.exploreTitle}>{item.title}</Text>
              <Text style={styles.exploreDesc}>{item.description}</Text>
            </View>
            <View style={styles.exploreArrow}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
          Listen & Understand
        </Text>

        <Text style={styles.sectionSubtitle}>
          Deepen your connection with the words of Allah
        </Text>

       <View style={styles.learnRow}>
  {LEARN_ACTIONS.map(item => (
    <TouchableOpacity
      key={item.id}
      style={styles.learnCard}
      activeOpacity={0.85}
      onPress={() => {
        if (item.comingSoon) {
          Alert.alert(
            'Coming Soon',
            'This feature will be available soon.',
          );
          return;
        }

        if (item.route) {
          navigation.navigate(item.route);
        }
      }}
    >
      {/* SVG Background */}
      <View style={styles.learnBackground}>
        {item.icon}
      </View>

      {/* Card Content */}
      <View style={styles.learnContent}>
        <Text style={styles.learnTitle}>{item.title}</Text>

        <Text style={styles.learnDesc}>
          {item.description}
        </Text>

        <View style={styles.learnArrow}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  ))}
</View>

       <Text style={styles.sectionTitleDaily}>Daily & Growth</Text>

<View style={styles.dailyGrid}>
  {DAILY_ACTIONS.map(item => (
    <TouchableOpacity
      key={item.id}
      style={[styles.dailyCard, { backgroundColor: item.bgColor }]}
      activeOpacity={0.8}
      onPress={() => {
        if (item.route) navigation.navigate(item.route);
      }}
    >
      {/* Icon on the left */}
      <View style={styles.dailyIcon}>
        <Text style={[styles.dailyIconText, { color: item.iconColor }]}>
          {item.icon}
        </Text>
      </View>

      {/* Text on the right */}
      <View style={styles.dailyTextContainer}>
        <Text style={styles.dailyTitle}>{item.title}</Text>
        <Text style={styles.dailySubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  ))}
</View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default QuranMainDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.wasilgreenthemecolor
    
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F5FF',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  ayahCard: {
    backgroundColor: '#EDE4FF',
    borderRadius: 10,
    overflow: 'hidden',
    minHeight: 200,
    width: '100%',
    flexDirection: 'row',
  },
  ayahContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  ayahBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.wasilgreenthemecolorfifth,
    paddingHorizontal: 12,
    left:40,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ayahBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  arabicAyah: {
    fontSize: 20,
    color: Colors.wasilgreenthemecolorfifth,
    textAlign: 'center',
    marginTop: 10,
    width: '60%',
    lineHeight: 28,
    fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',
  },

  englishAyah: {
    fontSize: 12,
    width: '65%',
    textAlign: 'center',
    color: Colors.white,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Nunito Sans 7pt' : 'NunitoSansRegular',
  },

  surahRef: {
    fontSize: 8,
    color: Colors.white,
    marginTop: 4,
    width: '65%',
    textAlign: 'center',
  },

  sectionTitle1: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.wasilgreenthemecolorfifth,
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.wasilgreenthemecolorfifth,
    fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.white,
    marginBottom: 14,
    fontFamily: Platform.OS === 'ios' ? 'Nunito Sans 7pt' : 'NunitoSansRegular',
  },

  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    top:10
  },
  quickAction: {
    width: (width - 48) / 4,
    backgroundColor: Colors.wasilgreenthemecolorsecond,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Colors.intermediate1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white
  },
  quickSubtitle: {
    fontSize: 10,
    color: Colors.white,
    marginTop: 2,
  },

  exploreCard: {
    flexDirection: 'row',
    backgroundColor: Colors.wasilgreenthemecolorsecond,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  exploreIconBox: {
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreText: {
    flex: 1,
    paddingHorizontal: 12,
  },
  exploreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.wasilgreenthemecolorfifth,
    marginBottom: 3,
  },
  exploreDesc: {
    fontSize: 12,
    color: Colors.white,
    lineHeight: 17,
  },
  exploreArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.wasilgreenthemecolor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: -2,
  },

  // ===== LEARN CARDS =====
 learnRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

learnCard: {
  bottom:20,
  width: (width - 44) / 2,
  height: 180,
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
},
  learnBackground: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  height:180
},

learnContent: {
  flex: 1,
  padding: 14,
  zIndex: 2,
},
  learnTitle: {
  fontSize: 12,
  fontWeight: '700',
  color: Colors.white,
  marginTop: 80,
},

learnDesc: {
  width:"70%",
  top:5,
  fontSize: 10,
  color: Colors.white,
  flex: 1,
},

learnArrow: {
  alignSelf: 'flex-end',
  width: 34,
  height: 34,
  bottom:22,
  borderRadius: 18,
  backgroundColor: Colors.wasilgreenthemecolor,
  justifyContent: 'center',
  alignItems: 'center',
},

arrowText: {
  color: '#FFF',
  fontSize: 22,
  fontWeight: '600',
  marginTop: -2,
},

sectionTitleDaily: {
  fontSize: 18,
  fontWeight: '700',
  color: Colors.wasilgreenthemecolorfifth,
  bottom: 23,
  marginBottom: 14,
  fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
},

dailyGrid: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 2,
},

dailyCard: {
  width: (width - 44) / 2,
  flexDirection: 'row', 
  alignItems: 'center',
  borderRadius: 16,
  bottom: 20,
  paddingVertical: 14,
  paddingHorizontal: 14,
},

dailyIcon: {
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,  
  top:2
},

dailyIconText: {
  fontSize: 18,
  fontWeight: '600',

},

dailyTextContainer: {
  flex: 1,
},

dailyTitle: {
  fontSize: 14,
  fontWeight: '700',
  color: '#1A1A1A',
},

dailySubtitle: {
  fontSize: 8,
  color: '#6B7280',
},
});