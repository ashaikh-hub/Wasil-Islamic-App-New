import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {StatusBar,ActivityIndicator,Alert,AppState,BackHandler,Image,ImageBackground,TouchableOpacity,Platform,ScrollView,Text,View,Dimensions,Modal,} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {getAudioUrlByChapter,getAudioUrlByJuz,getChapterIdBySlug,getChapterVerses,getJuzVerses,getPagesLookup,getRangeVerses} from '../../api';
import AyahViewComponent from '../../components/AyahViewComponent';
import BottomView from '../../components/BottomView';
import EmptyView from '../../components/EmptyView';
import Header from '../../components/Header';
import ModalComponent from '../../components/ModalComponent';
import PinMessage from '../../components/PinMessage';
import ReciterModal from '../../components/ReciterModal';
import SearchModalComponent from '../../components/SearchModalComponent';
import TopRowComponent from '../../components/TopRowComponent';
import TopRowComponentTwo from '../../components/TopRowComponentTwo';
import localeLanguage from '../../helper/localLanguage';
import {getStorageItem, setStorageItem} from '../../mmkvStorage/storeData';
import {getQuranReaderStylesInitialState} from '../../redux/defaultSettings/util';
import {setSpeedCounting,setTrackEnded,setVerseList,} from '../../redux/reduxToolkit/store/servicesSlice';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../../theme';
import {SIZES} from '../../theme/Sizes';
import {QuranReaderDataType} from '../../types/QuranReader';
import {getDefaultWordFields, getMushafId} from '../../utils/api';
import {getAllChaptersData, getChapterData} from '../../utils/chapter';
import {formatStringNumber} from '../../utils/number';
import { getRukuVerses } from '../../api';
import { DEFAULT_RECITER } from '../../redux/defaultSettings/defaultSettings';
import { getAudioUrlByRuku } from '../../api';
import {
  ONE_WEEK_REVALIDATION_PERIOD_SECONDS,
  REVALIDATION_PERIOD_ON_ERROR_SECONDS,
} from '../../utils/staticPageGeneration';
import {
  isRangesStringValid,
  isValidChapterId,
  isValidJuzId,
  isValidVerseKey,
} from '../../utils/validator';
import {getVerseAndChapterNumbersFromKey} from '../../utils/verse';
import {generateVerseKeysBetweenTwoVerseKeys,parseVerseRange,} from '../../utils/verseKeys';
import { Colors } from '../../../../theme';
import { SURAH_NAMES } from '../../../Reciters/surahNames'; 
const { height} = Dimensions.get('window');
import {
 WasilNewMakkahSvg,WasilNewMadinaSvg
} from '../../../../assets/icons';
import {captureRef} from 'react-native-view-shot';

const SurahDetailPage = ({navigation, route}) => {
  const {ayahIdFromBookmark,ayahKeyFromBookmark,selectedAyahItems,selectedSurahItems,fromPinAyah,fromBookmarkAyah,fromjuz,from,rukuNumber,fromqc,surahNumber,headersurahname,continuePlaying} = route.params;
  const reciters = getStorageItem('reciters');
  const selectedReciter = getStorageItem('reciters');
  const saveCurrentAyah = getStorageItem('saveCurrentAyah');
  const bookmarksList = getStorageItem('bookmark');
  const isArabic = getStorageItem('isArabic');
  const isTranslation = getStorageItem('isTranslation');
  const isTransliteration = getStorageItem('isTransliteration');
  const isTrackEnded = useSelector(state => state.services.isTrackEnded);
  const arabicFontSize = useSelector(state => state.services.arabicFontSize);
  const translationFontSize = useSelector(state => state.services.translationFontSize,);
  const isArabicFont = useSelector(state => state.services.isArabicFont);
  const translationList = useSelector(state => state.services.translationList);
  const isSpeedCounting = useSelector(state => state.services.isSpeedCounting);
  const verseList = useSelector(state => state.services.verseList);
  const recitersList = useSelector(state => state.reciters.recitersDetaList);
  const pageLayout = useSelector(state => state.services.pageLayout);
  const [showLoader, setShowLoader] = useState(true);
  const [surahDetail, setSurahDetail] = useState(selectedSurahItems);
  const [verseDetailList, setVerseDetailList] = useState(verseList?.verses || [],);
  const [isPinAyahItem, setIsPinAyahItem] = useState('');
  const [isGetPinAyah, setIsGetPinAyah] = useState('');
  const [isBookmark, setBookmark] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [isPlay, setIsPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciteModalVisible, setReciteModalVisible] = useState(false);
  const [showPinMessage, setShowPinMessage] = useState(false);
  const [openAyahDetailView, setOpenAyahDetailView] = useState(false);
  const [lastPlayAyahVisible, setLastPlayAyahVisible] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState('');
  const [audioList, setAudioList] = useState([]);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState({});
  const [currentAyahIndex, setCurrentAyahIndex] = useState(null);
  const [fromPlayIcon, setFromPlayIcon] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [itemHeights, setItemHeights] = useState([]);
  const progress = useProgress();
  const scrollingRef = useRef();
  const animationFrameId = useRef(null);
  const ayahRefs = useRef(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {height: HEIGHT} = Dimensions.get('window');
  const [layout, setLayout] = useState(null);
  const [additionalTexts, setAdditionalTexts] = useState({});
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [shareImageVisible, setShareImageVisible] = useState(false);
  const shareImageRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const PLAYBACK_SPEED_KEY = 'quranPlaybackSpeed';
  const speedRef = useRef(0);
  const speedValues = [1, 2, 3];
  const eventListenerAdded = useRef(false);

  useEffect(() => {
    const handleAppStateChange = currentState => {
      if (currentState === 'inactive') {
        stopAudioPlay();
      }
      if (currentState === 'background') {
        TrackPlayer.stop();
        setIsPlaying(false);
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
      stopAudioPlay();
    };
  }, [isFocused]);

 useFocusEffect(
  React.useCallback(() => {

    setShowLoader(true);

    if (from === 'ruku' && rukuNumber) {
      getRukuVerseData({
        rukuNumber,
        locale: localeLanguage,
      });

      loadRukuAudio();
    } 
    else if (fromqc === 'qurancompletion' && surahNumber) {

      getSurahVerse({
        id: surahNumber,
        locale: localeLanguage,
      });

      loadSurahAudio();

    } 
    else if (fromjuz) {

      getJuzVerse({
        id: surahDetail?.id,
        locale: localeLanguage,
      });

    } 
    else {

      getSurahVerse({
        id: surahDetail?.id,
        locale: localeLanguage,
      });

    }

    getBookmarkList();

  }, [
    from,
    rukuNumber,
    fromqc,
    surahNumber,
    localeLanguage,
    translationList, 
  ])
);

  useEffect(() => {
    const backAction = async () => {
      if (fromBookmarkAyah) {
        navigation?.navigate('DashBoard');
      } 
      else if (fromqc) {
        navigation?.navigate('GuestNew');
      }
      else if (continuePlaying) {
            navigation?.navigate('GuestNew');
            }
      else {
        navigation.navigate('DashBoard', {
          tabIndex: 0,
        });
      }
      await TrackPlayer.pause();
      stopAudioPlay();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    getPinAyahItem();
  }, []);

  useEffect(() => {
    if (currentPlayingAyah) {
      const index = verseDetailList?.findIndex(
        item => item?.verseKey === currentPlayingAyah?.verseKey,
      );
      if (
        index !== -1 &&
        itemHeights?.length === verseDetailList?.length &&
        itemHeights?.every(height => height !== undefined)
      ) {
        scrollToCurrentAyah(index);
      }
    }
  }, [currentPlayingAyah, itemHeights]);

useEffect(() => {
  if (
    surahDetail &&
    surahDetail?.id &&
    surahDetail?.transliteratedName
  ) {
    const lastReadSurah = {
      id: surahDetail?.id,
      transliteratedName: surahDetail?.transliteratedName || '',
      translatedName: surahDetail?.translatedName || '',
      revelationPlace: surahDetail?.revelationPlace || '',
      versesCount: surahDetail?.versesCount || 0,
      verseNumber: selectedAyah?.verseNumber || 1,
    };

    setStorageItem('lastReadSurah', lastReadSurah);
  }
}, [surahDetail, selectedAyah]);

  const handleLayout = event => {
    const {x, y, width, height} = event?.nativeEvent?.layout;
    setLayout({x, y, width, height});
  };

  const getSurahVerse = async ({id, locale}) => {
    let chapterIdOrVerseKeyOrSlug = String(id);
    let isValidChapter = isValidChapterId(chapterIdOrVerseKeyOrSlug);
    const chaptersData = await getAllChaptersData(locale);
    const isValidRanges = isRangesStringValid(
      chaptersData,
      chapterIdOrVerseKeyOrSlug,
    );
    let chapterId = chapterIdOrVerseKeyOrSlug;
    if (
      !isValidRanges &&
      !isValidChapter &&
      !isValidVerseKey(chaptersData, chapterIdOrVerseKeyOrSlug)
    ) {
      if (AYAH_KURSI_SLUGS.includes(chapterIdOrVerseKeyOrSlug.toLowerCase())) {
        chapterIdOrVerseKeyOrSlug = '2:255';
      } else {
        const sluggedChapterId = await getChapterIdBySlug(
          chapterIdOrVerseKeyOrSlug,
          locale,
        );
        if (!sluggedChapterId) {
          return {notFound: true};
        }
        chapterId = sluggedChapterId;
        isValidChapter = true;
      }
    }
    const defaultMushafId = getMushafId(
      getQuranReaderStylesInitialState(locale).quranFont,
      getQuranReaderStylesInitialState(locale).mushafLines,
    ).mushaf;
    let apiParams = {
      ...getDefaultWordFields(
        getQuranReaderStylesInitialState(locale).quranFont,
      ),
      mushaf: defaultMushafId,
    };
    let numberOfVerses = 1;
    let pagesLookupResponse = null;
    try {
      if (isValidRanges) {
        const [{verseKey: fromVerseKey}, {verseKey: toVerseKey}] =
          parseVerseRange(chapterIdOrVerseKeyOrSlug);
        pagesLookupResponse = await getPagesLookup({
          mushaf: defaultMushafId,
          from: fromVerseKey,
          to: toVerseKey,
        });
        numberOfVerses = generateVerseKeysBetweenTwoVerseKeys(
          chaptersData,
          pagesLookupResponse.lookupRange.from,
          pagesLookupResponse.lookupRange.to,
        ).length;
        const firstPageOfRange = Object.keys(pagesLookupResponse.pages)[0];
        const firstPageOfChapterLookup =
          pagesLookupResponse.pages[firstPageOfRange];
        let versesResponse = await getRangeVerses(locale, {
          ...apiParams,
          ...{
            perPage: 'all',
          },
        });
        const metaData = {numberOfVerses};

        versesResponse.metaData = metaData;
        versesResponse.pagesLookup = pagesLookupResponse;
        return {
          props: {
            chaptersData,
            versesResponse,
            quranReaderDataType: QuranReaderDataType.Ranges,
          },
          revalidate: ONE_WEEK_REVALIDATION_PERIOD_SECONDS,
        };
      }
      if (!isValidChapter) {
        const [extractedChapterId, verseNumber] =
          getVerseAndChapterNumbersFromKey(chapterIdOrVerseKeyOrSlug);
        chapterId = extractedChapterId;
        apiParams = {...apiParams, ...{page: verseNumber, perPage: 1}};
        pagesLookupResponse = await getPagesLookup({
          chapterNumber: Number(chapterId),
          mushaf: defaultMushafId,
          from: chapterIdOrVerseKeyOrSlug,
          to: chapterIdOrVerseKeyOrSlug,
        });
      } else {
        pagesLookupResponse = await getPagesLookup({
          chapterNumber: Number(chapterId),
          mushaf: defaultMushafId,
        });
        numberOfVerses = generateVerseKeysBetweenTwoVerseKeys(
          chaptersData,
          pagesLookupResponse.lookupRange.from,
          pagesLookupResponse.lookupRange.to,
        ).length;
        const firstPageOfChapter = Object.keys(pagesLookupResponse.pages)[0];

        const firstPageOfChapterLookup =
          pagesLookupResponse.pages[firstPageOfChapter];

        apiParams = {
          ...apiParams,
          ...{
            perPage: 1000,
            translations: translationList,
          },
        };
      }

      let versesResponse = await getChapterVerses(
        formatStringNumber(chapterId),
        locale,
        apiParams,
      );
      const metaData = {numberOfVerses};

      versesResponse.metaData = metaData;
      versesResponse.pagesLookup = pagesLookupResponse;
      dispatch(setVerseList(versesResponse));
      setVerseDetailList(versesResponse?.verses);
      setShowLoader(false);

      return {
        props: {
          chaptersData,
          chapterResponse: {
            chapter: {
              ...getChapterData(chaptersData, chapterId),
              id: chapterId,
            },
          },
          versesResponse,
          quranReaderDataType: isValidChapter
            ? QuranReaderDataType.Chapter
            : QuranReaderDataType.Verse,
        },
        revalidate: ONE_WEEK_REVALIDATION_PERIOD_SECONDS,
      };
    } catch (error) {
      console.log('DEFAULT_VERSES_PARAMS=======error', error);

      return {
        props: {hasError: true},
        revalidate: REVALIDATION_PERIOD_ON_ERROR_SECONDS,
      };
    }
  };
  const getJuzVerse = async ({id, locale}) => {
    let juzId = String(id);

    if (!isValidJuzId(juzId)) {
      return {
        notFound: true,
      };
    }

    const chaptersData = await getAllChaptersData(locale);
    juzId = formatStringNumber(juzId);

    const defaultMushafId = getMushafId(
      getQuranReaderStylesInitialState(locale).quranFont,
      getQuranReaderStylesInitialState(locale).mushafLines,
    ).mushaf;
    try {
      const pagesLookupResponse = await getPagesLookup({
        juzNumber: Number(juzId),
        mushaf: defaultMushafId,
      });
      const firstPageOfJuz = Object.keys(pagesLookupResponse.pages)[0];
      const firstPageOfJuzLookup = pagesLookupResponse.pages[firstPageOfJuz];
      const numberOfVerses = generateVerseKeysBetweenTwoVerseKeys(
        chaptersData,
        pagesLookupResponse.lookupRange.from,
        pagesLookupResponse.lookupRange.to,
      ).length;
      const juzVersesResponse = await getJuzVerses(juzId, locale, {
        ...getDefaultWordFields(
          getQuranReaderStylesInitialState(locale).quranFont,
        ),
        mushaf: defaultMushafId,
        perPage: 1000,
        translations: translationList,
      });

      const metaData = {numberOfVerses};
      juzVersesResponse.metaData = metaData;
      juzVersesResponse.pagesLookup = pagesLookupResponse;

      dispatch(setVerseList(juzVersesResponse));
      setVerseDetailList(juzVersesResponse?.verses);
      setShowLoader(false);

      return {
        props: {
          chaptersData,
          juzVerses: juzVersesResponse,
        },
        revalidate: ONE_WEEK_REVALIDATION_PERIOD_SECONDS,
      };
    } catch (error) {
      console.log('juzVerses==er', error);

      return {
        props: {
          hasError: true,
        },
        revalidate: REVALIDATION_PERIOD_ON_ERROR_SECONDS,
      };
    }
  };

  const getRukuVerseData = async ({ rukuNumber, locale }) => {
  try {
    const defaultMushafId = getMushafId(
      getQuranReaderStylesInitialState(locale).quranFont,
      getQuranReaderStylesInitialState(locale).mushafLines,
    ).mushaf;

    const res = await getRukuVerses(
      rukuNumber,
      locale,
      {
        ...getDefaultWordFields(
          getQuranReaderStylesInitialState(locale).quranFont,
        ),
        mushaf: defaultMushafId,
        perPage: 1000,
        translations: translationList,
      }
    );

    dispatch(setVerseList(res));
    setVerseDetailList(res?.verses || []);
    setShowLoader(false);
  } catch (error) {
    console.log('Ruku verses error:', error);
    setShowLoader(false);
  }
  };
  const ARTWORK_URL =
  'https://res.cloudinary.com/daof5pne5/image/upload/v1786029254/notificationbg.png';
  const loadRukuAudio = async () => {
  try {
    if (!rukuNumber) return;

    const reciterId = reciters?.reciter_id ?? DEFAULT_RECITER.id;

    const audioRes = await getAudioUrlByRuku(reciterId, rukuNumber);

    if (!audioRes?.audioFiles?.length) return;

    const formatted = audioRes.audioFiles.map((item, index) => {
      let url = item.url;
      if (!url.includes('.com')) {
        url = `https://verses.quran.com/${url}`;
      } else if (url.startsWith('//')) {
        url = `https:${url}`;
      }

      return { ...item, 
        id: index + 1, 
        url ,
        type: "quran",
      artwork: ARTWORK_URL,
              title: `Quran Kareem`,
              artist: 'Wasil Islamic App'};
    });

    setAudioList(formatted);

    await TrackPlayer.stop();
    await TrackPlayer.reset();
    await TrackPlayer.add(formatted);
  } catch (e) {
    console.log('Ruku audio error:', e);
  }
  };
  const loadSurahAudio = async () => { 
  try {
    if (!surahNumber) return;

    const reciterId = reciters?.reciter_id ?? DEFAULT_RECITER.id;

    const audioRes = await getAudioUrlByChapter(reciterId, surahNumber);

    if (!audioRes?.audioFiles?.length) return;

    const formatted = audioRes.audioFiles.map((item, index) => {
      let url = item.url;
      if (!url.includes('.com')) {
        url = `https://verses.quran.com/${url}`;
      } else if (url.startsWith('//')) {
        url = `https:${url}`;
      }

      return { ...item,
               id: index + 1,
               url, 
               type: "quran", 
               artwork: ARTWORK_URL,
               title: `Quran Kareem`,
               artist: 'Wasil Islamic App' };
    });

    setAudioList(formatted);

    await TrackPlayer.stop();
    await TrackPlayer.reset();
    await TrackPlayer.add(formatted);
  } catch (e) {
    console.log('Ruku audio error:', e);
  }
  };

  const getBookmarkList = () => {
    setBookmark(bookmarksList);
  };

  const getPinAyahItem = () => {
    const pinAyah = getStorageItem('pin');
    setIsGetPinAyah(pinAyah);
  };

  const onClickPlaySetting = async () => {
  navigation.navigate('Setting', {
    isFromPage: false,
    fromjuz: fromjuz,
    from: from,
    rukuNumber: rukuNumber,
    fromqc: fromqc,
    surahNumber: surahNumber,
    headersurahname: headersurahname,
    selectedSurahItems: surahDetail,
  });
  setReciteModalVisible(false);
  handleStopAutoScrolling();
  onClickReturnSearch();
  stopAudioPlay();
  };
const onClickPlaySettingNew = async () => {
  navigation.navigate('TranslatePage');
  setReciteModalVisible(false);
  handleStopAutoScrolling();
  onClickReturnSearch();
  stopAudioPlay();
};
 const onClickPlaySettingFullView = async () => {
  navigation.navigate('FullView', {
    isFromPage: false,
    fromjuz: fromjuz,
    from: from,
    rukuNumber: rukuNumber,
    fromqc: fromqc,
    surahNumber: surahNumber,
    headersurahname: headersurahname,
    selectedSurahItems: surahDetail,
  });
  setReciteModalVisible(false);
  handleStopAutoScrolling();
  onClickReturnSearch();
  stopAudioPlay();
};

  const onClickPlayMusic = () => {
    setReciteModalVisible(true);
    handleStopAutoScrolling();
    onClickReturnSearch();
  };

  const clickOnReciter = async item => {
    await TrackPlayer.stop();
    dispatch(setTrackEnded(false));
    eventListenerAdded.current = false;
    getAudioUrlData(item?.reciter_id, true);
    setReciteModalVisible(false);
  };
  
  const onCloseReciter = () => {
    setReciteModalVisible(false);
  };

  const onClickPlayPrevious = async () => {
    if (currentAyahIndex !== null && currentAyahIndex >= 0) {
      try {
        await TrackPlayer.stop();
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
        setIsPlaying(true);
        setCurrentAyahIndex(prev => prev - 1);
      } catch (error) {
        console.error('error---->', error);
      }
    } else {
      console.log('====No previous track available====');
    }
    handleStopAutoScrolling();
    onClickReturnSearch();
  };

  const onPressAyahPlayIcon = async trackId => {
    const Id = trackId - 1;
    handleStopAutoScrolling();
    onClickReturnSearch();
    await TrackPlayer.skip(Id);
    await TrackPlayer.play();
    setIsPlay(true);
    setIsPlaying(true);
  };

  const onClickPlayCircle = () => {
    togglePlayAudio();
    setIsPlay(true);
  };

  const onClickPlayNext = async () => {
    if (
      currentAyahIndex !== null &&
      currentAyahIndex <= audioList?.length - 1
    ) {
      try {
        await TrackPlayer.stop();
        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
        setIsPlaying(true);
        setCurrentAyahIndex(prev => prev + 1);
      } catch (error) {
        console.error('error---->', error);
      }
    } else {
      dispatch(setTrackEnded(false));
      eventListenerAdded.current = false;
      console.log('====No next track available====');
    }
    handleStopAutoScrolling();
    onClickReturnSearch();
  };

  const onClickPlayMenu = () => {
  let next = (speedRef.current + 1) % 4;
  speedRef.current = next;
  dispatch(setSpeedCounting(next));
  if (next === 0) {
    handleStopAutoScrolling();
    return;
  }
  if (!animationFrameId.current) {
    handleAutoScroll();
  }
  };

  const onClickPlayBook = () => {
    setOpenAyahDetailView(!openAyahDetailView);
    handleStopAutoScrolling();
    onClickReturnSearch();
    setCurrentOffset(0);
  };

  const onClickReturnSearch = () => {
    setSearchText('');
    setSearchModalVisible(false);
    setVerseDetailList(verseList?.verses);
  };

  const onClickSearchQuran = () => {
    setSearchModalVisible(false);
  };

  const handleSearch = text => {
    if (text) {
      const lowerCaseText = text.toLowerCase();
      const filterVerseDetail = verseList?.verses?.filter(item => {
        const verseText = item?.translations[0]?.text?.toLowerCase() || '';
        return verseText.includes(lowerCaseText);
      });
      setVerseDetailList(filterVerseDetail);
    } else {
      setVerseDetailList(verseList?.verses);
    }
  };

  const onClickPin = item => {
    setPinModalVisible(true);
    setIsPinAyahItem(item);
  };

  const onClickCancel = () => {
    setPinModalVisible(false);
    setIsPinAyahItem('');
  };

  const onClickConfirm = () => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  });
  const currentDateTime = formatter.format(new Date());
    
    if (isPinAyahItem?.id === isGetPinAyah?.AyahItem?.id) {
      const pinItem = {};
      setStorageItem('pin', pinItem);
      setPinModalVisible(false);
      setIsGetPinAyah(pinItem);
      setAdditionalTexts(prev => {
        const newTexts = { ...prev };
        delete newTexts[isPinAyahItem.id];
        saveAdditionalTextsToStorage(newTexts);
        return newTexts;
      });

      setTimeout(() => {
        setShowPinMessage(true);
      }, 500);
      setTimeout(() => {
        setShowPinMessage(false);
      }, 3000);
    } else {
     const pinItem = {
  SurahItem: surahDetail,
  AyahItem: isPinAyahItem,
  pinnedAt: currentDateTime,

  fromjuz,
  from,
  rukuNumber,
  fromqc,
  surahNumber,
  headersurahname,
};

      setStorageItem('pin', pinItem);
      setPinModalVisible(false);
      setIsGetPinAyah(pinItem);

      setAdditionalTexts(prev => {
        const newTexts = {};
        newTexts[isPinAyahItem.id] = currentDateTime;
        saveAdditionalTextsToStorage(newTexts); 
        return newTexts;
      });

      setTimeout(() => {
        setShowPinMessage(true);
      }, 500);
      setTimeout(() => {
        setShowPinMessage(false);
      }, 3000);
    }
  };

  const saveAdditionalTextsToStorage = async (texts) => {
    setStorageItem('additionalTexts', texts);
  };

  useEffect(() => {
  const loadAdditionalTexts = async () => {
      const savedTexts = await getStorageItem('additionalTexts');
      if (savedTexts) {
          setAdditionalTexts(savedTexts);
      }
  };

  loadAdditionalTexts();
  }, []);

  const toggleBookmark = item => {
    const Bookmark = 
    {BookmarkSurahItem: surahDetail, 
    BookmarkAyahItem: item,
   fromjuz,
  from,
  rukuNumber,
  fromqc,
  surahNumber,
  headersurahname,};
    const isAlreadyBookmarked = isBookmark?.some(
      val => val.BookmarkAyahItem?.id === item?.id,
    );
    let updatedBookmark = [];
    if (isAlreadyBookmarked) {
      updatedBookmark = isBookmark?.filter(
        val => val.BookmarkAyahItem?.id !== item?.id,
      );
    } else {
      updatedBookmark = [Bookmark, ...isBookmark];
    }

    setBookmark(updatedBookmark);
    setStorageItem('bookmark', updatedBookmark);
  };

  const bookmarked = item => {
    return isBookmark.some(val => {
      return val?.BookmarkAyahItem?.id === item?.id;
    });
  };

  const scrollToEnd = () => {
  const scrollStep = () => {
    if (!speedRef.current) return;

    const speed = speedValues[speedRef.current - 1];

    setCurrentOffset(prev => {
      const offset = prev + speed;

      if (openAyahDetailView) {
        ayahRefs?.current?.scrollTo({ y: offset, animated: false });
      } else {
        scrollingRef?.current?.scrollToOffset({
          offset,
          animated: false,
        });
      }

      return offset;
    });

    animationFrameId.current = requestAnimationFrame(scrollStep);
  };

  scrollStep();
  };

  const handleAutoScroll = () => {
  if (animationFrameId.current) return;

  const scrollStep = () => {
    if (!speedRef.current) return;

    const speed = speedValues[speedRef.current - 1] || 0;

    setCurrentOffset(prev => {
      const offset = prev + speed;

      if (openAyahDetailView) {
        ayahRefs?.current?.scrollTo({ y: offset, animated: false });
      } else {
        scrollingRef?.current?.scrollToOffset({
          offset,
          animated: false,
        });
      }

      return offset;
    });

    animationFrameId.current = requestAnimationFrame(scrollStep);
  };

  scrollStep();
  };

  const handleStopAutoScrolling = () => {
  if (animationFrameId.current) {
    cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null;
  }
  speedRef.current = 0;

  dispatch(setSpeedCounting(0));
  };

  useEffect(() => {
  if (isPlaying && currentPlayingAyah) {
    setStorageItem('lastListening', {
      SurahItem: surahDetail,
      AyahItem: currentPlayingAyah,
      completed: false,
    });
  }
  }, [currentPlayingAyah, isPlaying]);

  useEffect(() => {
    setSelectedAyah(currentPlayingAyah);
  }, [currentPlayingAyah]);

  const onClickYes = () => {
    setLastPlayAyahVisible(false);

    navigation.push('SurahDetailPage', {
      selectedAyahItems: saveCurrentAyah?.AyahItem,
      selectedSurahItems: saveCurrentAyah?.SurahItem,
      fromBookmarkAyah: true,
      ayahKeyFromBookmark: item?.BookmarkAyahItem?.verseKey,
      ayahIdFromBookmark: saveCurrentAyah?.AyahItem?.id,
    });
  };

  const onClickNo = () => {
    setLastPlayAyahVisible(false);
    setStorageItem('saveCurrentAyah', []);
    if (fromPlayIcon) {
      onPressAyahPlayIcon(selectedAyah?.verseNumber);
    } else {
      onClickPlayCircle();
    }
  };

  useEffect(() => {
  dispatch(setSpeedCounting(0));  
  speedRef.current = 0;        
  }, []);

  useEffect(() => {
    if (!eventListenerAdded.current) {
      eventListenerAdded.current = true;

      const playbackQueueEndedListener = TrackPlayer.addEventListener(
        'playback-queue-ended',
        async () => {
          if (!isTrackEnded) {
            dispatch(setTrackEnded(true));
            console.log('Track ended', surahDetail?.id);
            setCurrentPlayingAyah({});
            setCurrentAyahIndex(null);
             setIsPlaying(false);
            setStorageItem('lastListening', {
                SurahItem: surahDetail,
                AyahItem: null,
                completed: true,
            });
            
            if (!continuePlaying) {
                getAudioUrlData(reciters?.reciter_id, false);
            }  
           
            if (scrollingRef?.current) {
              scrollingRef?.current?.scrollToIndex({index: 0});
            }
          }
        },
      );
      const unsubscribe = navigation.addListener('blur', async () => {
        await TrackPlayer.stop();
        setIsPlaying(false);
      });
      return async () => {
        playbackQueueEndedListener.remove();
        await TrackPlayer.reset();
        stopAudioPlay();
        handleStopAutoScrolling();
        dispatch(setSpeedCounting(0));
        unsubscribe();
      };
    }
  }, []);

  const togglePlayAudio = async () => {
    dispatch(setTrackEnded(false));
    eventListenerAdded.current = false;
    if (isPlaying) {
      TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.setRate(playbackSpeed);
      TrackPlayer.play();
      setIsPlaying(true);
    }
  };
  
  const changePlaybackSpeed = async () => {
    const newSpeed =
      playbackSpeed === 1.0
        ? 1.5
        : playbackSpeed === 1.5
        ? 2.0
        : 1.0;
  
    try {
      // Update React state
      setPlaybackSpeed(newSpeed);
  
      // Save permanently in MMKV
      setStorageItem(PLAYBACK_SPEED_KEY, newSpeed);
  
      // Apply to current TrackPlayer
      await TrackPlayer.setRate(newSpeed);
  
      console.log('Playback speed changed to:', newSpeed);
    } catch (error) {
      console.log('Error changing playback speed:', error);
    }
  };
  
  useEffect(() => {
    const restorePlaybackSpeed = async () => {
      try {
        const savedSpeed = getStorageItem(PLAYBACK_SPEED_KEY);
  
        const speed =
          savedSpeed === 1 || savedSpeed === 1.5 || savedSpeed === 2
            ? savedSpeed
            : 1.0;
  
        setPlaybackSpeed(speed);
  
        // Make sure TrackPlayer is using the saved speed
        await TrackPlayer.setRate(speed);
  
        console.log('Restored playback speed:', speed);
      } catch (error) {
        console.log('Error restoring playback speed:', error);
      }
    };
  
    restorePlaybackSpeed();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      TrackPlayer.setupPlayer().then(() => {});
      getAudioUrlData(reciters?.reciter_id, false);
    }, []),
  );

  const getAudioUrlData = async (reciter_id, isReset) => {
    let audioData = {};
    try {
       if (from === 'ruku') {
        return;
       }
       if (fromqc === 'qurancompletion') {
       return;
       }
      if (fromjuz) {
        const juzId = surahDetail?.id;
        audioData = await getAudioUrlByJuz(reciter_id, juzId);
      } else {
        const chapterId = surahDetail?.id;
        audioData = await getAudioUrlByChapter(reciter_id, chapterId);
      }
      if (audioData?.audioFiles?.length != 0) {
        const updatedRecitationsData = audioData?.audioFiles?.map(
          (item, index) => {
            let url = item?.url;
            const isUrlContainsDotCom = url.includes('.com');
            if (isUrlContainsDotCom) {
              if (url.startsWith('//')) {
                url = `https:${url}`;
              }
            } else {
              url = `https://verses.quran.com/${url}`;
            }
            return {
              ...item,
              id: index + 1,
              url: url,
              type: "quran",
              artwork: ARTWORK_URL,
              title: `Quran Kareem`,
              artist: 'Wasil Islamic App'
            };
          },
        );
        setAudioList(updatedRecitationsData);
        await TrackPlayer.stop(); 
        await TrackPlayer.reset(); 
        await TrackPlayer.add(updatedRecitationsData);

        if (isReset) {
          const Id = currentAyahIndex || 0;
          await TrackPlayer.skip(Id);
          setIsPlay(true);
          setIsPlaying(true);
          await TrackPlayer.play();
        }
      } else {
        Alert.alert(
          '',
          'Please select other reciter ',
          [
            {
              text: 'OK',
              onPress: () => setReciteModalVisible(true),
              style: 'default',
            },
          ],
          {cancelable: false},
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message.replace('API error: ', ''));
          errorStatus = errorData?.status;
          errorMessage = errorData?.error;
        } catch (error) {
        } }
        Alert.alert(
          '',
          errorMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                if (errorStatus == 404) {
                  setReciteModalVisible(true);
                }
              },
              style: 'default',
            },
          ],
          {cancelable: false},
        );
      }
  };  
    
  
  const playSingleAyah = async (ayahItem) => {
    try {
        const reciter_id = reciters?.reciter_id;
        const audioData = await getAudioUrlByChapter(reciter_id, ayahItem?.chapterId);
        const ayahAudio = audioData?.audioFiles?.find(audio => audio.verseKey === ayahItem.verseKey);
        if (ayahAudio) {
          let url = ayahAudio.url;
          const isUrlContainsDotCom = url.includes('.com');
          if (isUrlContainsDotCom) {
            if (url.startsWith('//')) {
            const updatedAudio = {
                url :  `https:${url}`,
                title: `Ayah ${ayahItem.verseNumber}`,
            };
                        
            await TrackPlayer.stop();
            await TrackPlayer.reset();
            await TrackPlayer.add(updatedAudio);
            await TrackPlayer.play();
            setCurrentAyahIndex(ayahItem.verseNumber);         
            }
          } else {
            const updatedAudio = {
                url : `https://verses.quran.com/${ayahAudio.url}`,
                title: `Ayah ${ayahItem.verseNumber}`,
          };

          await TrackPlayer.stop(); 
          await TrackPlayer.reset();
          await TrackPlayer.add(updatedAudio);
          await TrackPlayer.play(); 
          setCurrentAyahIndex(ayahItem.verseNumber);     
          }
        } else {
            Alert.alert('Audio not found', 'The audio for this Ayah is not available.');
        }
    } catch (error) {
        console.error('Error playing Ayah:', error);
        Alert.alert('Error', 'There was an error trying to play this Ayah.');
    }
  };

  useEffect(() => {
    const fetchCurrentTrackIndex = async () => {
      if (isPlay && isPlaying) {
        const currentTrackItem = await TrackPlayer.getActiveTrack();
        const trackId = currentTrackItem?.id;
        if (currentTrackItem) {
          const currentIndex = trackId - 1;
          if (!openAyahDetailView) {
            if (currentIndex && scrollingRef?.current) {
              scrollingRef?.current?.scrollToIndex({index: currentIndex});
            }
          }
          setCurrentPlayingAyah(currentTrackItem);
          setCurrentAyahIndex(trackId);
        } else {
          setCurrentPlayingAyah({});
          setCurrentAyahIndex(null);
        }

        const index = audioList?.findIndex(
          item => item?.id === currentTrackItem?.id,
        );

        const scrollIndex = Math.round(
          layout?.height / (audioList?.length + 1),
        );

        const scrollingIndex = scrollIndex * index + 2;
        scrollToCurrentAyah(scrollingIndex);
      }
    };
    fetchCurrentTrackIndex();
  }, [progress?.position, isPlay, isPlaying]);
  
  useEffect(() => {
  if (
    ayahKeyFromBookmark &&
    !isEmpty(audioList) &&
    verseDetailList?.length > 0 &&
    !showLoader
  ) {
    const playBookmarkAyah = async () => {
      try {
        const audioIndex = audioList.findIndex(
          track => track?.verseKey === ayahKeyFromBookmark
        );

        if (audioIndex === -1) {
          console.log(
            'Bookmark audio not found:',
            ayahKeyFromBookmark
          );
          return;
        }

        console.log(
          'Bookmark:',
          ayahKeyFromBookmark,
          'Audio index:',
          audioIndex
        );

        await TrackPlayer.skip(audioIndex);
        await TrackPlayer.play();

        setCurrentAyahIndex(audioIndex + 1);
        setIsPlay(true);
        setIsPlaying(true);
      } catch (error) {
        console.log('Bookmark playback error:', error);
      }
    };

    playBookmarkAyah();
  }
}, [
  ayahKeyFromBookmark,
  verseDetailList,
  audioList,
  showLoader,
  ]);

    useEffect(() => {
    if (
      ayahIdFromBookmark &&
      !isEmpty(audioList) &&
      verseDetailList?.length != 0 &&
      !showLoader
    ) {
      const playBookmarkAyah = async () => {
        const Id = ayahIdFromBookmark - 1;
        await TrackPlayer.skip(Id);
        await TrackPlayer.play();
        setIsPlay(true);
        setIsPlaying(true);
      };
      playBookmarkAyah();
    }
  }, [route?.params, verseDetailList, audioList, showLoader]);
  
  useEffect(() => {
    if (
      !showLoader &&
      fromPinAyah &&
      verseDetailList?.length &&
      verseDetailList[selectedAyahItems?.verseNumber - 1].verseNumber ===
        selectedAyahItems?.verseNumber
    ) {
      setTimeout(() => {
        const scrollToIndex = selectedAyahItems?.verseNumber - 1;
        if (scrollingRef.current) {
          scrollingRef.current.scrollToIndex({
            index: scrollToIndex,
            animated: true,
          });
        }
      }, 500);
    }
  }, [verseDetailList, showLoader]);

  const seekTo = async value => {
    await TrackPlayer?.seekTo(value);
  };

  const stopAudioPlay = async () => {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    setIsPlaying(false);
  };

  const shareMessage = async item => {
    const Ayah = item?.textUthmani;

    const transliteration = item?.words
      ?.map(item => (item?.transliteration?.text || '').replace(/null/g, ''))
      .join(' ');

    const translations = item?.translations[0]?.text?.replace(
      /<sup[^>]*>.*?<\/sup>/g,
      '',
    );
    try {
      const message = `Ayah: ${Ayah} \nTransliteration: ${transliteration} \nTranslations: ${translations}`;
      const options = {
        title: 'Quran',
        message: message,
      };
      const result = await Share.open(options);
      console.log(result);
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  const shareText = async item => {
  const ayah = item?.textUthmani || '';

  const transliteration = item?.words
    ?.map(word =>
      (word?.transliteration?.text || '').replace(/null/g, ''),
    )
    .join(' ')
    .trim();

  const translation = item?.translations?.[0]?.text
    ?.replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .trim();

  const verseKey = item?.verseKey || '';

  const [surahNumber, ayahNumber] = verseKey.split(':');

  try {
    const message =
      `Surah ${surahNumber}, Ayah ${ayahNumber}\n\n` +
      `${ayah}\n\n` +
      `${transliteration}\n\n` +
      `${translation}\n\n` +
      `Wasil Islamic App`;

    await Share.open({
      title: 'Quran',
      message,
    });
  } catch (error) {
    console.log('Error sharing text:', error?.message);
  }
  };

  const shareAsImage = async item => {
  try {
    if (!item) {
      return;
    }

    // Make sure the share card is rendered
    setShareImageVisible(true);

    // Wait for the view to render
    await new Promise(resolve => setTimeout(resolve, 500));

    const imageUri = await captureRef(shareImageRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    console.log('Share image:', imageUri);

    // IMPORTANT:
    // Hide the capture view BEFORE opening native share sheet
    setShareImageVisible(false);

    // Give React Native time to remove the view
    await new Promise(resolve => setTimeout(resolve, 150));

    await Share.open({
      title: 'Quran',
      url: imageUri,
      type: 'image/png',
    });

  } catch (error) {
    console.log('Share image cancelled/error:', error?.message);
  } finally {
    // Always clean up
    setShareImageVisible(false);
  }
  };

  const openShareSheet = item => {
  setShareItem(item);
  setShareSheetVisible(true);
  };

  const closeShareSheet = () => {
  setShareSheetVisible(false);
  };

  const versesItemRenderItem = ({item, index}) => {
    const checkIsPin = item?.id == isGetPinAyah?.AyahItem?.id;
    const lightYellowBackground = checkIsPin ? COLORS.SlateYellow : COLORS.gray;
    const pinColor = checkIsPin ? COLORS.yellow : COLORS.thirdGray;
      const skyBlueBackground =
      index + 1 == currentAyahIndex ? Colors.wasilnewthemecolor: Colors.white;
    const skyBlueTextColor =
      index + 1 == currentAyahIndex ? COLORS.darkblue : COLORS.black;
    return (
      <View
        key={item?.id}
        style={{
          marginTop:20,
          marginLeft:10,
          marginRight:10,
          borderRadius:10,
          borderWidth:1,
          borderColor:"#E0E0E0",
          
        }}>
        <AyahViewComponent
          ayahItem={item}
          detailContainerCustomeStyle={{backgroundColor: skyBlueBackground,borderRadius:10,borderBottomLeftRadius:0,borderBottomRightRadius:3,borderWidth:0.6}}
          detailTextCustomeStyle={{color: skyBlueTextColor}}
          searchingText={searchText}
          currentAyahIndex={currentAyahIndex}
          index={index}
        />
        <TopRowComponent
          index={index}
          item={item}
          surahDetail={surahDetail}
          currentAyahIndex={currentAyahIndex}
          isGetPinAyah={isGetPinAyah}
          isBookIcon={true}
          onPressBookIcon={() => {
            navigation?.navigate('AddTafseer', {verseKey: item?.verseKey});
            onClickReturnSearch();
          }}
          onPresShareIcon={() => {
            openShareSheet(item);
          }}
          onPressPlayIcon={async () => {
            dispatch(setTrackEnded(false));
            eventListenerAdded.current = false;
            setFromPlayIcon(false);
            setSelectedAyah(item);
            if (!global.isFirstTime) {
              if (!isEmpty(saveCurrentAyah)) {
                await playSingleAyah(item); 
              } else {
                await playSingleAyah(item); 
              }
            } else {
              await playSingleAyah(item); 
            }  
          }}
          saveBookmark={bookmarked(item)}
          onPressBookmarkIcon={() => {
            toggleBookmark(item);
          }}
          topViewCustomeStyle={{
            backgroundColor: lightYellowBackground,
              borderBottomLeftRadius:10,
              borderBottomRightRadius:10,
    borderWidth:0.2,
    borderColor:"#E0E0E0",
          }}
          isLeftPinIcon={true}
          pinIconCustomeStyle={{
            tintColor: pinColor,
          }}
          onPressPinIcon={() => {
            onClickPin(item);
          }}
          additionalText={additionalTexts[item.id] || ''} 
        />
      </View>
    );
  };

  const twocolumnItemRenderItem = ({ item, index }) => {
   const isActive = index + 1 === currentAyahIndex;
   const checkIsPin = item?.id == isGetPinAyah?.AyahItem?.id;
   const lightYellowBackground = checkIsPin ? COLORS.SlateYellow : COLORS.gray;
   const pinColor = checkIsPin ? COLORS.yellow : COLORS.thirdGray;
   
  return (
    <View
      key={item.id}
      style={[
        styles.splitCard,
        isActive && { backgroundColor: Colors.wasilnewthemecolor},
      ]}
    >
      <View style={{flexDirection:"row"}}>
      <View style={styles.leftColumn}>
         {isTransliteration && (
        <Text
           style={[
              { ...FONTSTYLE(FONTS.poppinsLight, translationFontSize)
                .arabicText,
                        },
                        styles.transliteration,
                      ]}>
                      {item?.words
                        ?.map(item =>
                          (item?.transliteration?.text || '').replace(/null/g, ''),
                        )
                        .join('  ')}
        </Text>
         )}
         {isTranslation && (
                   <View>
                     {item?.translations?.map((item, index) => (
                       <View key={item?.id}>
                           <Text
                            style={[
              { ...FONTSTYLE(FONTS.poppinsLight, translationFontSize)
                .arabicText,
                        },
                        styles.translation,
                      ]}>
                          
                             {item?.text?.replace(/<sup[^>]*>.*?<\/sup>/g, '')}
                         
                         </Text>
                         {index !== item?.translations?.length - 1 && (
                           <View style={styles.line} />
                         )}
                       </View>
                     ))}
                   </View>
        )}
      </View>
      <View style={styles.rightColumn}>
        {isArabic && (
        <Text
          style={[
            styles.arabicText,
            {
              ...FONTSTYLE(
                Platform.OS === 'android'
                  ? isArabicFont?.key
                  : FONTS[isArabicFont?.key],
                arabicFontSize
              ).arabicText,
            },
          ]}
        >
          {item.textUthmani}
        </Text>
        )}
      </View>
      </View>
      <View style={{height:20,backgroundColor:"#E0E0E0",width:1,alignSelf:"center",left:5,

      }}></View>
      <View>
        <TopRowComponentTwo
          index={index}
          item={item}
          surahDetail={surahDetail}
          currentAyahIndex={currentAyahIndex}
          isGetPinAyah={isGetPinAyah}
          isBookIcon={true}
          onPressBookIcon={() => {
            navigation?.navigate('AddTafseer', {verseKey: item?.verseKey});
            onClickReturnSearch();
          }}
          onPresShareIcon={() => {
            openShareSheet(item);
          }}
          onPressPlayIcon={async () => {
            dispatch(setTrackEnded(false));
            eventListenerAdded.current = false;
            setFromPlayIcon(false);
            setSelectedAyah(item);
            if (!global.isFirstTime) {
              if (!isEmpty(saveCurrentAyah)) {
                await playSingleAyah(item); 
              } else {
                await playSingleAyah(item); 
              }
            } else {
              await playSingleAyah(item); 
            }  
          }}
          saveBookmark={bookmarked(item)}
          onPressBookmarkIcon={() => {
            toggleBookmark(item);
          }}
          topViewCustomeStyle={{
            backgroundColor: lightYellowBackground,
              borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderWidth:0.2,
    borderColor:"#E0E0E0",
          }}
          isLeftPinIcon={true}
          pinIconCustomeStyle={{
            tintColor: pinColor,
          }}
          onPressPinIcon={() => {
            onClickPin(item);
          }}
          additionalText={additionalTexts[item.id] || ''} 
        />
      </View>
      
    </View>
  );
  };

  const renderAyahItem = ({ item, index }) => {
  const previousItem = verseDetailList[index - 1];

  const isNewSurah =
    index === 0 ||
    previousItem?.chapterId !== item?.chapterId;

  const shouldShowBismillah =
    isNewSurah &&
    item?.chapterId !== 1 &&
    item?.chapterId !== 9;

  return (
    <>
      {shouldShowBismillah && (
        <Image
          source={IMAGES.bismillah}
          resizeMode="cover"
          style={{
      height: 70,
      width: 320,
      alignSelf: 'center',
      top: 15,
    }}
        />
      )}

      {pageLayout === 'TWO_COLUMN'
        ? twocolumnItemRenderItem({ item, index })
        : versesItemRenderItem({ item, index })}
    </>
  );
  };

  const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const scrollToCurrentAyah = index => {
    if (ayahRefs?.current) {
      ayahRefs?.current.scrollTo({
        y: index,
        animated: true,
      });
    }
  };

  const shouldShowSurahHeader = 
  fromqc === 'qurancompletion' ||
  (
    !fromjuz &&
    surahDetail?.id &&
    (from !== 'ruku' || rukuNumber === 1)
  );
  
  const surahInfo = SURAH_NAMES[surahDetail?.id];
  const arabicName = surahInfo?.arabic ?? '';

  return (
    <View style={styles.safeAreaView}>
      <StatusBar backgroundColor={Colors.black}></StatusBar>
      <Header
       title={
        fromqc === 'qurancompletion'
        ? headersurahname
        :from === 'ruku'
        ? `Ruku ${rukuNumber}`
        : fromjuz
        ? surahDetail?.juzNumber
        : "Quran"}

        onPressLeftIcon={() => {
            if (fromBookmarkAyah) {
              navigation?.navigate('DashBoard');
            } 
            else if (fromqc) {
            navigation?.navigate('GuestNew');
            }
            else if (continuePlaying) {
            navigation?.navigate('GuestNew');
            }
             else {
               navigation.navigate('DashBoard', {
                tabIndex: 0,
              });
            }
            stopAudioPlay();
        }}
        onPressRightIcon={() => {
          if(!openAyahDetailView){
            onClickPlaySetting();
          }
          else{
            onClickPlaySettingFullView();
          }
        }}
        secondRightIcon={!openAyahDetailView}
        onPressSecondRightIcon={openAyahDetailView ? undefined : onClickPlaySettingNew}
      />
      
        {showLoader ? (
              <View style={styles?.loaderViewStyle}>
              <ActivityIndicator size="large" color={COLORS.wasilnewthemecolorsecondBlue} />
              </View>
              ) : (
              <>
              {!openAyahDetailView ? (
              <>
              
              {shouldShowSurahHeader && (
  <View style={styles.topMainView}>
    <View style={styles.leftTextView}>
      <View style={styles.topviewStyle}>
        <Text style={styles.titleText}>
          {surahDetail.transliteratedName}
        </Text>
      </View>

      <View style={styles.topviewStyle}>
        <Text style={styles.subText}>
          {surahDetail.translatedName}
        </Text>
      </View>

      <View style={styles.topviewStyle}>
        <Text style={styles.subText}>
          {`Revealed: ${surahDetail.revelationPlace}`}
        </Text>
      </View>

      <View style={styles.topviewStyle}>
        <Text style={styles.subText}>
          {`Total Ayahs: ${surahDetail.versesCount}`}
        </Text>
      </View>
    </View>

    <View style={styles.rightViewStyle}>
      <View style={styles.container}>
        <Text
          style={[
            styles.rightTitleText,
            {
              color:Colors.secondary,
              fontSize:35,
              fontFamily: "sura_names",
              textAlign:"center",
              right:10
              
            },
          ]}>
         {arabicName}
        </Text>
      </View>

      <View style={styles.rigntImageView}>
        {surahDetail.revelationPlace === 'makkah' && (
          <WasilNewMakkahSvg/>
        )}

        {surahDetail.revelationPlace === 'madinah' && (
          <WasilNewMadinaSvg/>
        )}
      </View>
    </View>
  </View>
  

              )}
               
<View style={{flex: 1,top:10}}>
  <FlashList
    key={pageLayout}
    ref={scrollingRef}
    data={verseDetailList}
    renderItem={renderAyahItem}
     contentContainerStyle={{
    paddingBottom: isPlaying ? 100 : 100, 
  }}
    showsVerticalScrollIndicator={false}
    keyExtractor={item => item?.id.toString()}
    estimatedItemSize={500}
    estimatedListSize={{
      height: SIZES.height,
      width: SIZES.width,
    }}
    getItemType={({item}) => item}
    onEndReached={() => {
      handleStopAutoScrolling();
      setCurrentOffset(0);
    }}
    ListEmptyComponent={
      <View style={styles.emptyViewStyle}>
        <EmptyView />
      </View>
    }
    onEndReachedThreshold={0.01}
    extraData={{
      isBookmark,
      isPinAyahItem,
      pinModalVisible,
      isGetPinAyah,
      currentAyahIndex,
      currentPlayingAyah,
      isPlay,
      isSpeedCounting,
    }}
  />
</View>
              </>
              ) : (
              <View style={{flex: 1}}>
             
            {shouldShowSurahHeader && (
  <View style={styles.topMainView}>
    <View style={styles.leftTextView}>
      <View style={styles.topviewStyle}>
        <Text style={styles.titleText}>
          {surahDetail.transliteratedName}
        </Text>
      </View>

      <View style={styles.topviewStyle}>
        <Text style={styles.subText}>
          {surahDetail.translatedName}
        </Text>
      </View>


      <View style={styles.topviewStyle}>
        <Text style={styles.subText}>
          {`Revealed: ${surahDetail.revelationPlace}`}
        </Text>
      </View>

      <View style={styles.topviewStyle}>
        <Text style={styles.subText}>
          {`Total Ayahs: ${surahDetail.versesCount}`}
        </Text>
      </View>
    </View>

    <View style={styles.rightViewStyle}>
      <View style={styles.container}>
        <Text
          style={[
            styles.rightTitleText,
            {
              color:Colors.secondary,
              fontSize:35,
              fontFamily: "sura_names",
              textAlign:"center",
              right:10
            },
          ]}>
         {arabicName}
        </Text>
      </View>

      <View style={styles.rigntImageView}>
        {surahDetail.revelationPlace === 'makkah' && (
         <WasilNewMakkahSvg/>
        )}

        {surahDetail.revelationPlace === 'madinah' && (
         <WasilNewMadinaSvg/>
        )}
      </View>
    </View>
  </View>
             )}   
     
  <ImageBackground
  source={IMAGES.backGroundImgNEWD}
  resizeMode="stretch"
  imageStyle={{
    borderRadius: 5,
  }}
  style={[
    styles.ayahMainView,
    {
      padding: 10,
     paddingBottom:
             HEIGHT - 170 <= layout?.height
               ? isPlaying
                 ? verticalScale(50)
                 : verticalScale(30)
               : 10,
    },
  ]}
  onLayout={handleLayout}>
                   
                   <ScrollView
                   style={{padding: 2,}}
                    showsVerticalScrollIndicator={false}
                    ref={ayahRefs}
                    scrollEventThrottle={16} 
                    onScroll={({nativeEvent}) => {
  setCurrentOffset(nativeEvent.contentOffset.y);
  if (isReachedEnd(nativeEvent)) {
    handleStopAutoScrolling();
  }
}}>                 
                 
  <Text
    style={{textAlign: "justify" ,padding:10}}>
    {verseDetailList &&
      verseDetailList.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <Text
              key={index}
              style={{
                ...FONTSTYLE(
                  Platform.OS === "android"
                    ? isArabicFont?.key
                    : FONTS[isArabicFont?.key],
                  arabicFontSize
                ).arabicText,
                color:
                  currentAyahIndex === index + 1
                    ? COLORS?.yellow
                    : COLORS?.wasilnewthemecolorsecondGray,
              }}>
              {item?.textUthmani} 
            </Text>
            <Text
              style={[
                {
                  ...FONTSTYLE(
                    FONTS.trochutBold,
                    arabicFontSize *
                      (item?.id < 100
                        ? 0.8
                        : item?.id < 1000
                        ? 0.8
                        : 0.8)
                  ).arabicText,
                  color:
                    currentAyahIndex === index + 1
                      ? COLORS?.yellow
                      : COLORS?.wasilnewthemecolorsecondGray,
                  position: "absolute",
                },
                styles.numberTextStyle,
              ]}
            >
              {" "}
              ﴿{item?.verseKey.split(":")[1]}﴾{" "}
            </Text>

          </React.Fragment>
        );
      })}
  </Text>
                 
                
                  </ScrollView>

  </ImageBackground>
            
              </View>
              )}

                           
              {isPlay && (
              <View>
              <BottomView
                selectedReciter={selectedReciter}
                playbackSpeed={playbackSpeed}
                onChangePlaybackSpeed={changePlaybackSpeed}
                onPressPlayMusic={onClickPlayMusic}
                onPressPlayPrevious={onClickPlayPrevious}
                playImageSource={
                  isPlaying ? IMAGES.playOnIcon : IMAGES.playOffIcon
                }
                onPressPlayCircle={() => {
                  setFromPlayIcon(false);
                  if (!global.isFirstTime && !isPlaying) {
                    global.isFirstTime = true;
                    if (!isEmpty(saveCurrentAyah)) {
                      setLastPlayAyahVisible(true);
                    } else {
                      onClickPlayCircle();
                    }
                  } else {
                    onClickPlayCircle();
                  }
                  handleStopAutoScrolling();
                  onClickReturnSearch();
                }}
                onPressPlayNext={onClickPlayNext}
                onPressPlayMenu={onClickPlayMenu}
                onPressPlayBook={onClickPlayBook}
                minimumValue={0}
                maximumValue={progress?.duration}
                value={progress?.position}
                onSlidingComplete={seekTo}
                isVisibleSpeedIcon={isSpeedCounting == 0 ? true : false}
                isPlay={isPlaying}
                openAyahDetailView={openAyahDetailView}
                // disabled={
                //   openAyahDetailView
                //     ? HEIGHT - 140 <= layout?.height
                //       ? false
                //       : true
                //     : false
                // }
                
              />
              </View>
              )}
              {showPinMessage && (
              <View>
              <PinMessage
                pinText={
                  isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id ? true : false
                }
                pinItem={isPinAyahItem}
              />
              </View>
              )}
            </>
        )}

      {/* <SearchModalComponent
        visible={searchModalVisible}
        title="Search"
        subtitle="Note: Typing on the search field will auto search the surah by
          name."
        searchText={searchText}
        onChangeText={text => {
          handleSearch(text);
          setSearchText(text);
        }}
        onClickSearch={() => {
          onClickSearchQuran();
        }}
        onClickReturn={() => {
          onClickReturnSearch();
        }}
      /> */}
      <ModalComponent
        visible={pinModalVisible}
        title={
          isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id
            ? 'Would you Like to Remove This Ayah from Pinned?'
            : 'Would You Like to Pin This Ayah?'
        }
        subtitle={
          isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id
            ? 'Removing this ayah will delete it from your pinned list.'
            : 'Pinning this ayah allows for easy access in the future.'
        }
        onClickClose={() => {
          onClickCancel();
        }}
        onClickConfirm={() => {
          onClickConfirm();
        }}
        cancelButtonText={'Cancel'}
        confirmButtonText={
          isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id ? 'Delete' : 'Confirm'
        }
      />
      <ModalComponent
        visible={lastPlayAyahVisible}
        subtitle="Would you like to play the last played Ayah?"
        onClickClose={() => {
          onClickNo();
        }}
        onClickConfirm={() => {
          onClickYes();
        }}
        cancelButtonText={'No'}
        confirmButtonText={'Yes'}
      />
      <ReciterModal
        data={recitersList}
        visible={reciteModalVisible}
        clickOnReciter={item => {
          clickOnReciter(item);
        }}
        onClose={() => {
          onCloseReciter();
        }}
      />
      <Modal
  visible={shareSheetVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={closeShareSheet}>

  <TouchableOpacity
    activeOpacity={1}
    style={styles.shareOverlay}
    onPress={closeShareSheet}>

    <TouchableOpacity
      activeOpacity={1}
      style={styles.shareBottomSheet}>

      <View style={styles.shareSheetHandle} />

      <Text style={styles.shareSheetTitle}>
        Share Ayah
      </Text>

      {/* SHARE TEXT */}
      <TouchableOpacity
        style={styles.shareOption}
        onPress={async () => {
          setShareSheetVisible(false);

          if (shareItem) {
            await shareText(shareItem);
          }

          onClickReturnSearch();
        }}>

        <View style={styles.shareOptionIcon}>
          <Text style={styles.shareOptionIconText}>
            T
          </Text>
        </View>

        <View style={styles.shareOptionContent}>
          <Text style={styles.shareOptionTitle}>
            Share Text
          </Text>

          <Text style={styles.shareOptionSubtitle}>
            Share Ayah as text
          </Text>
        </View>

      </TouchableOpacity>


      {/* SHARE AS IMAGE */}
      <TouchableOpacity
        style={styles.shareOption}
        onPress={async () => {
          setShareSheetVisible(false);

          if (shareItem) {
            await shareAsImage(shareItem);
          }

          onClickReturnSearch();
        }}>

        <View style={styles.shareOptionIcon}>
          <Text style={styles.shareOptionIconText}>
            ▧
          </Text>
        </View>

        <View style={styles.shareOptionContent}>
          <Text style={styles.shareOptionTitle}>
            Share as Image
          </Text>

          <Text style={styles.shareOptionSubtitle}>
            Create an image of this Ayah
          </Text>
        </View>

      </TouchableOpacity>


      {/* CANCEL */}
      <TouchableOpacity
        style={styles.shareCancelButton}
        onPress={closeShareSheet}>

        <Text style={styles.shareCancelText}>
          Cancel
        </Text>

      </TouchableOpacity>

    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
{shareImageVisible && (
  <View
    style={styles.shareImageCaptureContainer}
    pointerEvents="none">

    <View
      ref={shareImageRef}
      collapsable={false}
      style={styles.shareImageCard}>

      {/* BRAND */}
      <Text style={styles.shareImageBrand}>
        Wasil Islamic App
      </Text>

      {/* SURAH */}
      <Text style={styles.shareImageSurah}>
        {surahDetail?.transliteratedName || ''}
      </Text>

      {/* ARABIC SURAH NAME */}
      <Text style={styles.shareImageSurahArabic}>
        {arabicName}
      </Text>

      {/* AYAH NUMBER */}
      <Text style={styles.shareImageReference}>
        Quran {shareItem?.verseKey || ''}
      </Text>

      {/* ARABIC AYAH */}
      <Text style={styles.shareImageArabic}>
        {shareItem?.textUthmani || ''}
      </Text>

      <View style={styles.shareImageDivider} />

      {/* TRANSLITERATION */}
      <Text style={styles.shareImageLabel}>
        Transliteration
      </Text>

      <Text style={styles.shareImageTransliteration}>
        {shareItem?.words
          ?.map(word =>
            (word?.transliteration?.text || '').replace(/null/g, ''),
          )
          .join(' ')}
      </Text>

      <View style={styles.shareImageDivider} />

      {/* TRANSLATION */}
      <Text style={styles.shareImageLabel}>
        Translation
      </Text>

      <Text style={styles.shareImageTranslation}>
        {shareItem?.translations?.[0]?.text?.replace(
          /<sup[^>]*>.*?<\/sup>/gi,
          '',
        ) || ''}
      </Text>

    </View>

  </View>
)}
    </View>
  );
  };

  const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '45@s',
    backgroundColor:"#FBF9FF"
  },
  topMainView: {
    width: '95%',
    height:100,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1,
    top:10,
    borderColor:"#673AB7",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '10@s',
    paddingHorizontal: '15@s',
    alignItems: 'center',
    backgroundColor: "#FBF9FF",
  },
  topviewStyle: {top:3},
  leftTextView: {width: '30%', marginRight: '3@s'},
  titleText: {
    ...FONTSTYLE(FONTS.poppinsMedium).inputs,
    color: Colors.wasilnewthemecolorsecond,
  },
  subText: {
    ...FONTSTYLE(FONTS.poppinsRegular).smallText,
    color: COLORS.wasilnewthemecolorsecondGray,
    top:3,
    textTransform:"capitalize"
  },
  rightViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
   
  },
  rightIconStyle: {
    height: '45@s',
    width: '45@s',
    resizeMode: 'contain',
  },
  rigntImageView: {marginLeft: '5@s',},
  rightTitleText: {
    textAlign: 'right',
    color: COLORS.black,
  },
  backgroundImageStyle: {
    resizeMode: 'contain',
    flex: 1,
  },
  backgroundImageStyle2: {
    resizeMode: 'contain',
    flex: 1,
  },
  ayahMainView: {
    margin: '15@s',
    borderRadius: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: '10@s',
    alignItems: 'center',
    paddingTop: '2@s',  
  },
  subTextView: {
    paddingTop: '5@s',
  },
  loaderViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  numberTextStyle: {top: '3@s'},
  emptyViewStyle: {marginTop: SIZES.height / 3},
  fab: {
    backgroundColor: '#673AB7',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  splitCard: {
  flex: 1,
  flexDirection: 'column',
  margin: 10,
  borderRadius: 10,
  backgroundColor: COLORS.white,
  borderWidth: 1,
  borderColor: COLORS.paleGray,
},

leftColumn: {
  flexDirection:"column",
  flex: 1,
  paddingRight: 10,
  borderRightWidth:1,
  borderColor:"#E0E0E0"
},

rightColumn: {
  flex: 1,
  justifyContent: 'center',
},

verseNumber: {
  fontSize: 12,
  fontWeight: '600',
  color: COLORS.wasilnewthemecolorsecond,
  marginBottom: 6,
},

translation: {
  top:5,
  padding:10,
  color: COLORS.wasilnewthemecolorsecondGray,
},

transliteration: {
  top:5,
  padding:10,
  color: COLORS.wasilnewthemecolorsecondGray,
},


arabicText: {
  padding:10,
  textAlign: 'right',
  color: COLORS.black,
},
shareOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'flex-end',
},

shareBottomSheet: {
  backgroundColor: COLORS.white,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  paddingHorizontal: 22,
  paddingTop: 12,
  paddingBottom: 30,
},

shareSheetHandle: {
  width: 45,
  height: 5,
  borderRadius: 5,
  backgroundColor: '#D0D0D0',
  alignSelf: 'center',
  marginBottom: 20,
},

shareSheetTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#673AB7',
  marginBottom: 10,
},

shareOption: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 17,
  borderBottomWidth: 1,
  borderBottomColor: '#EEEEEE',
},

shareOptionIcon: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#F3EEFF',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},

shareOptionIconText: {
  fontSize: 21,
  fontWeight: '700',
  color: '#673AB7',
},

shareOptionContent: {
  flex: 1,
},

shareOptionTitle: {
  fontSize: 17,
  fontWeight: '600',
  color: '#333333',
},

shareOptionSubtitle: {
  fontSize: 13,
  color: '#888888',
  marginTop: 4,
},

shareCancelButton: {
  height: 50,
  borderRadius: 14,
  backgroundColor: '#F5F5F5',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 18,
},

shareCancelText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#673AB7',
},


// ====================================
// SHARE IMAGE
// ====================================

shareImageModal: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.8)',
  justifyContent: 'center',
  alignItems: 'center',
},

shareImageCard: {
  width: 360,
  minHeight: 520,
  backgroundColor: '#FBF9FF',
  borderRadius: 22,
  paddingHorizontal: 25,
  paddingVertical: 30,
  alignItems: 'stretch',
},

shareImageBrand: {
  textAlign: 'center',
  fontSize: 15,
  fontWeight: '700',
  letterSpacing: 2,
  color: '#673AB7',
  marginBottom: 12,
},

shareImageSurah: {
  textAlign: 'center',
  fontSize: 26,
  fontWeight: '700',
  color: '#673AB7',
},

shareImageSurahArabic: {
  textAlign: 'center',
  fontSize: 28,
  color: '#444444',
  fontFamily: 'sura_names',
  marginTop: 5,
},

shareImageReference: {
  textAlign: 'center',
  fontSize: 14,
  color: '#888888',
  marginTop: 5,
  marginBottom: 25,
},

shareImageArabic: {
  textAlign: 'center',
  color: '#111111',
  lineHeight: 25,
  fontSize: 22,
  fontFamily:Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran'
},

shareImageDivider: {
  height: 1,
  backgroundColor: '#DCD6E8',
  marginVertical: 18,
},

shareImageLabel: {
  fontSize: 13,
  fontWeight: '600',
  color: '#673AB7',
  marginBottom: 5,
},

shareImageTransliteration: {
  fontSize: 16,
  lineHeight: 27,
  color: '#666666',
},

shareImageTranslation: {
  fontSize: 17,
  lineHeight: 28,
  color: '#555555',
},

shareImageFooter: {
  textAlign: 'center',
  fontSize: 13,
  color: '#673AB7',
  marginTop: 30,
},
shareImageCaptureContainer: {
  position: 'absolute',
  left: -2000,
  top: 0,
},
  });


export default SurahDetailPage;

