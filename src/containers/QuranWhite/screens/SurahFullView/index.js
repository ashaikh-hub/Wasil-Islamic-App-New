import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  InteractionManager,
  Platform,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {getAudioUrlByPage, getPageVerses, getPagesLookup} from '../../api';
import BottomView from '../../components/BottomView';
import Header from '../../components/Header';
import ReciterModal from '../../components/ReciterModal';
import SearchModalComponent from '../../components/SearchModalComponent';
import ar from '../../data/chapters/ar.json';
import localeLanguage from '../../helper/localLanguage';
import {getStorageItem} from '../../mmkvStorage/storeData';
import {getQuranReaderStylesInitialState} from '../../redux/defaultSettings/util';
import {
  setSpeedCounting,
  setVerseList,
} from '../../redux/reduxToolkit/store/servicesSlice';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../../theme';
import {getDefaultWordFields, getMushafId} from '../../utils/api';
import {getAllChaptersData} from '../../utils/chapter';
import {
  ONE_WEEK_REVALIDATION_PERIOD_SECONDS,
  REVALIDATION_PERIOD_ON_ERROR_SECONDS,
} from '../../utils/staticPageGeneration';
import {isValidPageId} from '../../utils/validator';
const { height} = Dimensions.get('window');
const SurahFullView = ({navigation, route}) => {
  const {selectedPageItem} = route.params;
  const totalPages = 604;
  const isArabicFont = useSelector(state => state.services.isArabicFont);
  const isSpeedCounting = useSelector(state => state.services.isSpeedCounting);
  const verseList = useSelector(state => state.services.verseList);
  const recitersList = useSelector(state => state.reciters.recitersDetaList);
  const arabicFontSize = useSelector(state => state.services.arabicFontSize);
  const reciters = getStorageItem('reciters');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [reciteModalVisible, setReciteModalVisible] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(selectedPageItem);
  const [verseDetailList, setVerseDetailList] = useState(verseList?.verses);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(true);
  const [audioList, setAudioList] = useState([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(null);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [indexLayout, setIndexLayout] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [layout, setLayout] = useState(null);
  const progress = useProgress();
  const scrollingRef = useRef();
  const ayahRefs = useRef([]);
  const animationFrameId = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const dispatch = useDispatch();

  const handleLayout = event => {
    const {x, y, width, height} = event?.nativeEvent?.layout;
    setLayout({x, y, width, height});
  };

  const {height: HEIGHT} = Dimensions.get('window');

  useEffect(() => {
    const backAction = async () => {
      navigation.goBack();
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
    TrackPlayer.setupPlayer().then(() => {});

    TrackPlayer.addEventListener('playback-queue-ended', async () => {
      console.log('Track ended', surahDetail?.id);
      setIsPlaying(false);
    });
    const unsubscribe = navigation.addListener('blur', async () => {
      await TrackPlayer.stop();
      setIsPlaying(false);
    });
    return async () => {
      await TrackPlayer.reset();
      handleStopAutoScrolling();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getRecitationsData(reciters?.reciter_id, currentPageIndex, false);
  }, []);

  const getRecitationsData = async (reciter_id, currentPageIndex, isReset) => {
    try {
      const recitationsData = await getAudioUrlByPage(
        reciter_id,
        currentPageIndex,
      );

      if (recitationsData?.audioFiles?.length != 0) {
        const updatedRecitationsData = recitationsData?.audioFiles.map(
          (item, index) => ({
            ...item,
            id: index + 1,
            url: `https://verses.quran.com/${item?.url}`,
          }),
        );

        setAudioList(updatedRecitationsData);

        await TrackPlayer.stop();
        setIsPlaying(false);
        await TrackPlayer.reset(); // Reset TrackPlayer instance
        setCurrentSegmentIndex(0); // Reset segment index
        await TrackPlayer.add(
          updatedRecitationsData?.map(item => ({
            id: item?.id,
            url: item?.url,
            verseKey: item?.verseKey,
          })),
        );
        if (isReset) {
          await TrackPlayer.play();
          setIsPlaying(true);
        }
      } else {
        Alert.alert(
          '',
          'Please select other reciter',
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
          console.error('Error==>', error);
        }
      }
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

  useEffect(() => {
    getPageVerse({id: currentPageIndex, locale: localeLanguage});
  }, [currentPageIndex]);

  const onClickPlayCircle = () => {
    togglePlayAudio();
    setIsPlay(true);
  };
  const onClickPlayNextAyah = async () => {
    if (
      currentAyahIndex !== null &&
      currentAyahIndex <= audioList?.length - 1
    ) {
      const nextTrackIndex = currentAyahIndex + 1;
      try {
        await TrackPlayer.stop();
        // console.log('Stopping current track');
        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
        setIsPlaying(true);
        setCurrentAyahIndex(nextTrackIndex);
      } catch (error) {
        console.error('error---->', error);
      }
    } else {
      console.log('====No next track available====');
    }
  };

  const onClickPlayPreviousAyah = async () => {
    if (currentAyahIndex !== null && currentAyahIndex >= 0) {
      const previousTrackIndex = currentAyahIndex - 1;
      try {
        await TrackPlayer.stop();
        // console.log('Stopping current track');

        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
        setIsPlaying(true);
        setCurrentAyahIndex(previousTrackIndex);
      } catch (error) {
        console.error('error---->', error);
      }
    } else {
      console.log('====No previous track available====');
    }
  };

  const onClickPlaySetting = () => {
    navigation.navigate('Setting', {
      isFromPage: true,
      selectedPageItem: currentPageIndex,
    });
    stopAudioPlay();
  };
  const onClickPlayMusic = () => {
    setReciteModalVisible(true);
  };
  const onClickPlayMenu = async () => {
    handleAutoScroll();
    stopAudioPlay();
  };

  const onPressPreviousPage = async () => {
    await TrackPlayer.pause();

    let currentIndex = currentPageIndex - 1;
    if (currentIndex < 1) {
      currentIndex = totalPages;
    }
    setCurrentPageIndex(currentIndex);
    getRecitationsData(reciters?.reciter_id, currentIndex, false);
  };

  const onPressNextPage = async () => {
    await TrackPlayer.pause();

    let currentIndex = currentPageIndex + 1;
    if (currentIndex > totalPages) {
      currentIndex = 1;
    }
    setCurrentPageIndex(currentIndex);
    getRecitationsData(reciters?.reciter_id, currentIndex, false);
  };
  const clickOnReciter = item => {
    setReciteModalVisible(false);
    getRecitationsData(item?.reciter_id, currentPageIndex, true);
  };
  const onCloseReciter = () => {
    setReciteModalVisible(false);
  };

  useEffect(() => {
    const fetchCurrentTrackIndex = async () => {
      const trackId = await TrackPlayer.getActiveTrack();
      setCurrentPlayingAyah(trackId);

      if (trackId) {
        const index = audioList?.findIndex(item => item?.id === trackId?.id);
        setCurrentAyahIndex(index + 1);
        const scrollIndex = Math.round(
          layout?.height / (audioList?.length + 1),
        );
        scrollToCurrentAyah(scrollIndex * index);
      }
    };
    fetchCurrentTrackIndex();

    return () => {};
  }, [progress?.position]);

  const togglePlayAudio = async () => {
    if (isPlaying) {
      TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.setRate(playbackSpeed); // Set playback speed
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };
  const changePlaybackSpeed = async () => {
    const newSpeed = playbackSpeed === 1.0 ? 1.5 : playbackSpeed === 1.5 ? 2.0 : 1.0;
    setPlaybackSpeed(newSpeed);
    await TrackPlayer.setRate(newSpeed);
  };
  const scrollToCurrentAyah = index => {
    if (scrollingRef?.current) {
      scrollingRef?.current.scrollTo({
        y: index,
        animated: true,
      });
    }
  };
  let currentPosition = 0;

  const scrollToEnd = () => {
    const scrollStep = () => {
      TrackPlayer.pause();
      setIsPlaying(false);

      if (isSpeedCounting <= 3) {
        dispatch(setSpeedCounting(isSpeedCounting + 1));
      } else {
        dispatch(setSpeedCounting(1));
        return;
      }
      const stepIncrement = isSpeedCounting * 2;
      InteractionManager.runAfterInteractions(() => {
        if (scrollingRef?.current) {
          console.log(
            'layout?.height00000',
            HEIGHT - 200 >= layout?.height,
            HEIGHT,
            layout?.height,
          );
          if (HEIGHT - 200 >= layout?.height) {
            handleStopAutoScrolling();
            return;
          }
          setCurrentOffset(prevOffset => {
            const offsetValue = prevOffset + stepIncrement;
            scrollingRef?.current?.scrollTo({y: offsetValue, animated: true});
            return offsetValue;
          });
          animationFrameId.current = requestAnimationFrame(scrollStep);
        }
      });
    };
    scrollStep();
  };

  const handleAutoScroll = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    scrollToEnd();
  };

  const handleStopAutoScrolling = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    setCurrentOffset(0);
    dispatch(setSpeedCounting(1));
  };

  const stopAudioPlay = async () => {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    setIsPlaying(false);
  };

  const getPageVerse = async ({id, locale}) => {
    setShowLoader(true);
    const pageId = String(id);
    if (!isValidPageId(pageId)) {
      return {
        notFound: true,
      };
    }
    const defaultMushafId = getMushafId(
      getQuranReaderStylesInitialState(locale).quranFont,
      getQuranReaderStylesInitialState(locale).mushafLines,
    ).mushaf;
    try {
      const pageVersesResponse = await getPageVerses(pageId, locale, {
        perPage: 'all',
        mushaf: defaultMushafId,
        filterPageWords: true,
        ...getDefaultWordFields(
          getQuranReaderStylesInitialState(locale).quranFont,
        ),
      });

      dispatch(setVerseList(pageVersesResponse));
      setVerseDetailList(pageVersesResponse?.verses);
      setShowLoader(false);
      const pagesLookupResponse = await getPagesLookup({
        pageNumber: Number(pageId),
        mushaf: defaultMushafId,
      });
      const chaptersData = await getAllChaptersData(locale);
      setShowLoader(false);
      return {
        props: {
          chaptersData,
          pageVerses: {
            ...pageVersesResponse,
            pagesLookup: pagesLookupResponse,
            metaData: {numberOfVerses: pageVersesResponse.verses.length},
          },
        },
        revalidate: ONE_WEEK_REVALIDATION_PERIOD_SECONDS, // verses will be generated at runtime if not found in the cache, then cached for subsequent requests for 7 days.
      };
    } catch (error) {
      setShowLoader(false);
      return {
        props: {
          hasError: true,
        },
        revalidate: REVALIDATION_PERIOD_ON_ERROR_SECONDS, // 35 seconds will be enough time before we re-try generating the page again.
      };
    }
  };
  const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('PageList');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.safeAreaView}>
      <Header
        title={`Page  ${currentPageIndex}`}
        onPressLeftIcon={() => {
          navigation.navigate('PageList');
        }}
      />

      <ImageBackground
        source={IMAGES.backGroundImgOne}
        resizeMode="cover"
        style={styles.backgroundImageStyle}>
        {showLoader ? (
          <View style={styles?.loaderViewStyle}>
            <ActivityIndicator size="large" color={COLORS.wasilnewthemecolorsecondBlue} />
          </View>
        ) : (
          <View
            style={[
              styles.mainView,
              {
                paddingBottom:
                  HEIGHT - 170 <= layout?.height ? verticalScale(50) : 0,
              },
            ]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={scrollingRef}
              onScroll={({nativeEvent}) => {
                if (isReachedEnd(nativeEvent)) {
                  handleStopAutoScrolling();
                }
              }}>
             {verseDetailList &&
              verseDetailList[0]?.verseKey.split(':')[1] == 1 ? (
                <Text
                  style={[
                    {
                      ...FONTSTYLE(
                        Platform.OS === 'android'
                          ? isArabicFont?.key
                          : FONTS[isArabicFont?.key],
                        arabicFontSize,
                      ).bigTitle,
                      lineHeight: Platform.OS === 'android' ? 40 : 0,
                    },
                    styles.ayahTitleText,
                  ]}>
                 سورة {verseDetailList
                    ? verseDetailList[0]?.verseKey.split(':')[1] == 1
                      ? ar[verseDetailList[0]?.verseKey.split(':')[0]]
                          ?.transliteratedName
                      : null
                    : null}
                    
                </Text>
              ) : null}
              <View
                style={{marginBottom: 2}}
                ref={ayahRefs}
                onLayout={handleLayout}>

                <Text style={{ flex: 1,marginTop: 15,textAlign: "justify"}}>
          {verseDetailList &&
            verseDetailList.map((item, index) => (
              <Text key={index} allowFontScaling={false} selectable={true}>
                 <Text
                            style={{
                              ...FONTSTYLE(
                                Platform.OS === 'android'
                                  ? isArabicFont?.key
                                  : FONTS[isArabicFont?.key],
                                arabicFontSize,
                              ).arabicText,
                              lineHeight:
                                Platform.OS === 'android'
                                  ? arabicFontSize * 1.9
                                  : 0,
                              color:
                                currentPlayingAyah?.verseKey == item?.verseKey
                                  ? COLORS.yellow
                                  : COLORS.wasilnewthemecolorsecondGray,
                            }}>
                            {item?.textUthmani}
                          </Text>
                <Text style={[
                                  {
                                    ...FONTSTYLE(
                                      FONTS.trochutBold,
                                      arabicFontSize *
                                        (item?.id < 100
                                          ? 0.5
                                          : item?.id < 1000
                                          ? 0.4
                                          : 0.3),
                                    ).arabicText,
                                    color:
                                      currentPlayingAyah?.verseKey ==
                                      item?.verseKey
                                        ? COLORS.yellow
                                        : COLORS.wasilnewthemecolorsecondGray,
                                    position: 'absolute',
                                  },
                                ]}
                                onLayout={event => {
                                  setIndexLayout(event?.nativeEvent?.layout);
                                }}>{" "}﴿{`${item?.id}`}﴾{" "}</Text>
              </Text>
            ))}
        </Text>
              </View>
            </ScrollView>
          </View>
        )}
      </ImageBackground>

      {isPlaying &&(
               <View style = {{resizeMode:"contain",top:height*0.7,right:35,alignSelf:"flex-end",width:50,height:50,position:"absolute"}}>
                <TouchableOpacity style={styles.fab} onPress={changePlaybackSpeed}>
                  <Text style={styles.fabText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
                </View>
                )}
      <View>
        <BottomView
          onPressPlaySetting={() => {
            onClickPlaySetting();
            handleStopAutoScrolling();
          }}
          onPressPlayMusic={() => {
            onClickPlayMusic();
            handleStopAutoScrolling();
          }}
          onPressPlayPrevious={() => {
            onClickPlayPreviousAyah();
            handleStopAutoScrolling();
          }}
          playImageSource={isPlaying ? IMAGES.playOnIcon : IMAGES.playOffIcon}
          onPressPlayCircle={() => {
            onClickPlayCircle();
            handleStopAutoScrolling();
          }}
          onPressPlayNext={() => {
            onClickPlayNextAyah();
            handleStopAutoScrolling();
          }}
          onPressPlayMenu={() => {
            onClickPlayMenu();
          }}
          onPressPreviousPage={() => {
            onPressPreviousPage();
            handleStopAutoScrolling();
          }}
          onPressNextPage={() => {
            onPressNextPage();
            handleStopAutoScrolling();
          }}
          previousPageNumber={
            (currentPageIndex - 1 + totalPages) % totalPages || totalPages
          }
          nextPageNumber={(currentPageIndex % totalPages) + 1}
          isFromPage={true}
          isVisibleSpeedIcon={isSpeedCounting == 1 ? true : false}
          disabled={HEIGHT - 180 <= layout?.height ? false : true}
          currentPageIndex={currentPageIndex}
        />
      </View>

      <SearchModalComponent
        visible={searchModalVisible}
        title="Search"
        subtitle="Note: Typing on the search field will auto search the surah by
        name."
        searchText={searchText}
        onChangeText={text => setSearchText(text)}
        onClickSearch={() => {}}
        onClickReturn={() => {}}
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
    </View>
  );
};

export default SurahFullView;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  backgroundImageStyle: {
    resizeMode: 'contain',
    flex: 1,
  },
  mainView: {
    margin: '12@s',
    borderRadius: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: '10@s',
    marginBottom: '15@s',
  },
  detailTextView: {
    color: COLORS.black,
  },
  numberBackStyle: {
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ayahTitleText: {
    textAlign: 'center',
    color: COLORS.darkblue,
    paddingTop: '5@s',
  },
  loaderViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
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
});
