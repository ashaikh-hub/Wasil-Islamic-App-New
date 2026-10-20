import React, { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Pressable,
  Animated,
  Platform,
  Modal,
} from "react-native";

import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from "react-native-track-player";

import { SURAH_NAMES } from "../../../Reciters/surahNames";

import {
  WasilNewRecitersBTPlayIcon,
  WasilNewRecitersBTPauseIcon,
  SearchSVG,
  IslamicStoryPlayPreviousSVG,
  IslamicStoryPlayNextSVG,
  IslamicStoryPlayRewindSVG,
  IslamicStoryPlayForwardSVG,
  IslamicStoryPlayBTAudioSVG,
  IslamicStoryPauseBTAudioSVG,
  DuaListNumberBTSVGG,
} from "../../../../assets/icons";

import { Colors } from "../../../../theme";

import { savePlayerState } from "./playerStorageB";


export default function TranslatorDetail({ route }) {

  // ============================================================
  // 1. INITIAL RECITER
  // ============================================================

  const initialReciterId =
    route?.params?.reciterId || null;


  // ============================================================
  // 2. STATES
  // ============================================================

  const [languages, setLanguages] = useState([]);

  const [selectedLanguage, setSelectedLanguage] =
    useState(null);

  const [
    languageDropdownVisible,
    setLanguageDropdownVisible,
  ] = useState(false);

  const [reciterId, setReciterId] =
    useState(initialReciterId);

  const [data, setData] = useState([]);

  const [loadingLanguages, setLoadingLanguages] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [currentIndex, setCurrentIndex] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [playDisabled, setPlayDisabled] =
    useState(false);

  const [playerReady, setPlayerReady] =
    useState(false);

  const [playerLoadingTracks, setPlayerLoadingTracks] =
    useState(false);


  // ============================================================
  // 3. REFS
  // ============================================================

  const flatListRef =
    useRef(null);

  const isUserScrolling =
    useRef(false);

  const shouldAutoScroll =
    useRef(false);

  const progressAnim =
    useRef(new Animated.Value(0)).current;

  const progressBarWidth =
    useRef(0);


  // ============================================================
  // 4. TRACK PROGRESS
  // ============================================================

  const {
    position,
    duration,
  } = useProgress(250);


  // ============================================================
  // 5. FETCH LANGUAGES
  // ============================================================

  useEffect(() => {

    fetchLanguages();

  }, []);


  const fetchLanguages = async () => {

    try {

      setLoadingLanguages(true);

      const res = await fetch(
        "https://islamicapp.vercel.app/api/translator"
      );

      if (!res.ok) {

        throw new Error(
          `Translator API Error: ${res.status}`
        );
      }

      const json = await res.json();

      console.log(
        "TRANSLATOR API:",
        json
      );


      // --------------------------------------------------------
      // SUPPORT DIFFERENT RESPONSE STRUCTURES
      // --------------------------------------------------------

      const languageData =
        Array.isArray(json)
          ? json
          : json.data || [];


      console.log(
        "LANGUAGE DATA:",
        languageData
      );


      setLanguages(languageData);


      // --------------------------------------------------------
      // SELECT DEFAULT LANGUAGE
      // --------------------------------------------------------

      if (languageData.length > 0) {

        let defaultLanguage = null;


        // If route contains reciterId,
        // find matching translator

        if (initialReciterId) {

          defaultLanguage =
            languageData.find(
              item =>
                String(item.reciterid) ===
                String(initialReciterId)
            );
        }


        // Otherwise use first language

        if (!defaultLanguage) {

          defaultLanguage =
            languageData[0];
        }


        setSelectedLanguage(
          defaultLanguage
        );


        setReciterId(
          defaultLanguage.reciterid
        );
      }

    } catch (error) {

      console.error(
        "LANGUAGE API ERROR:",
        error
      );

    } finally {

      setLoadingLanguages(false);
    }
  };


  // ============================================================
  // 6. FETCH TRANSLATOR AUDIO WHEN RECITER CHANGES
  // ============================================================

  useEffect(() => {

    if (!reciterId) {
      return;
    }

    fetchRecitations(
      reciterId
    );

  }, [reciterId]);


  const fetchRecitations =
    async selectedReciterId => {

      try {

        setLoading(true);


        // ------------------------------------------------------
        // RESET PLAYER
        // ------------------------------------------------------

        try {

          await TrackPlayer.reset();

        } catch (e) {

          console.log(
            "TrackPlayer reset error:",
            e
          );
        }


        // ------------------------------------------------------
        // RESET UI
        // ------------------------------------------------------

        setCurrentIndex(null);

        setIsPlaying(false);

        setPlayerReady(false);

        setData([]);


        // ------------------------------------------------------
        // TRANSLATOR AUDIO API
        // ------------------------------------------------------

        const url =
          `https://islamicapp.vercel.app/api/translatoraudiosreciterid?reciterid=${selectedReciterId}`;


        console.log(
          "TRANSLATOR AUDIO API:",
          url
        );


        const res =
          await fetch(url);


        if (!res.ok) {

          throw new Error(
            `Audio API Error: ${res.status}`
          );
        }


        const json =
          await res.json();


        console.log(
          "AUDIO API RESPONSE:",
          json
        );


        // ------------------------------------------------------
        // SUPPORT DIFFERENT RESPONSE STRUCTURES
        // ------------------------------------------------------

        let audioFiles = [];


        if (Array.isArray(json)) {

          audioFiles = json;

        } else if (
          Array.isArray(json.audio_files)
        ) {

          audioFiles =
            json.audio_files;

        } else if (
          Array.isArray(json.data)
        ) {

          audioFiles =
            json.data;

        } else if (
          Array.isArray(json.audioFiles)
        ) {

          audioFiles =
            json.audioFiles;
        }


        console.log(
          "FINAL AUDIO FILES:",
          audioFiles
        );


        setData(
          audioFiles
        );


        setPlayerReady(
          audioFiles.length > 0
        );

      } catch (error) {

        console.error(
          "AUDIO API ERROR:",
          error
        );

        setData([]);

      } finally {

        setLoading(false);
      }
    };


  // ============================================================
  // 7. SELECT LANGUAGE
  // ============================================================

  const onSelectLanguage =
    async language => {

      try {

        setLanguageDropdownVisible(
          false
        );


        // Same language selected

        if (
          selectedLanguage?.reciterid ===
          language?.reciterid
        ) {

          return;
        }


        console.log(
          "SELECTED LANGUAGE:",
          language.language
        );


        console.log(
          "SELECTED RECITER ID:",
          language.reciterid
        );


        // ------------------------------------------------------
        // UPDATE SELECTED LANGUAGE
        // ------------------------------------------------------

        setSelectedLanguage(
          language
        );


        // ------------------------------------------------------
        // THIS WILL TRIGGER fetchRecitations()
        // ------------------------------------------------------

        setReciterId(
          language.reciterid
        );


        // ------------------------------------------------------
        // CLEAR SEARCH
        // ------------------------------------------------------

        setSearch("");

      } catch (error) {

        console.error(
          "LANGUAGE SELECT ERROR:",
          error
        );
      }
    };


  // ============================================================
  // 8. TRACK PLAYER INITIAL SYNC
  // ============================================================

  useEffect(() => {

    setCurrentIndex(null);

    setIsPlaying(false);


    const syncTrack =
      async () => {

        try {

          const activeTrack =
            await TrackPlayer.getActiveTrack();


          if (
            activeTrack?.reciterId &&
            String(activeTrack.reciterId) ===
            String(reciterId)
          ) {

            const index =
              await TrackPlayer.getActiveTrackIndex();


            setCurrentIndex(
              index
            );


            const state =
              await TrackPlayer.getState();


            setIsPlaying(
              state === State.Playing
            );

          } else {

            setCurrentIndex(null);

            setIsPlaying(false);
          }

        } catch (e) {

          console.log(
            "SYNC TRACK ERROR:",
            e
          );
        }
      };


    if (reciterId) {

      syncTrack();
    }

  }, [reciterId]);


  // ============================================================
  // 9. TRACK PLAYER EVENTS
  // ============================================================

  useTrackPlayerEvents(
    [
      Event.PlaybackTrackChanged,
      Event.PlaybackState,
    ],

    async event => {

      // --------------------------------------------------------
      // TRACK CHANGED
      // --------------------------------------------------------

      if (
        event.type ===
        Event.PlaybackTrackChanged
      ) {

        if (
          event.nextTrack !== null
        ) {

          setCurrentIndex(
            event.nextTrack
          );


          shouldAutoScroll.current =
            true;


          if (
            !isUserScrolling.current
          ) {

            flatListRef.current?.scrollToIndex({

              index:
                event.nextTrack,

              animated:
                true,

              viewPosition:
                0.5,
            });
          }
        }
      }


      // --------------------------------------------------------
      // PLAYBACK STATE
      // --------------------------------------------------------

      if (
        event.type ===
        Event.PlaybackState
      ) {

        setIsPlaying(
          event.state ===
          State.Playing
        );
      }
    }
  );


  // ============================================================
  // 10. PROGRESS ANIMATION
  // ============================================================

  useEffect(() => {

    if (!duration) {
      return;
    }


    Animated.timing(
      progressAnim,
      {
        toValue:
          position / duration,

        duration:
          200,

        useNativeDriver:
          false,
      }
    ).start();

  }, [
    position,
    duration,
  ]);


  // ============================================================
  // 11. SAVE PLAYER STATE
  // ============================================================

  useEffect(() => {

    if (
      currentIndex !== null
    ) {

      savePlayerState();
    }

  }, [
    currentIndex,
    isPlaying,
    position,
  ]);


  // ============================================================
  // 12. SEARCH
  // ============================================================

  const filteredData =
    data.filter(item => {

      const surah =
        SURAH_NAMES[
          item.chapter_id
        ];


      if (!surah) {

        return false;
      }


      return surah.english
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );
    });


  // ============================================================
  // 13. PLAY TRACK
  // ============================================================

  const playTrack =
    async index => {

      try {

        setPlayerLoadingTracks(
          true
        );


        // ------------------------------------------------------
        // RESET PLAYER
        // ------------------------------------------------------

        await TrackPlayer.reset();


        let tracks;


        // ------------------------------------------------------
        // ANDROID
        // ------------------------------------------------------

        if (
          Platform.OS === "android"
        ) {

          tracks =
            data

              .filter(
                item =>
                  item.audio_url
              )

              .map(
                (item, idx) => ({

                  id:
                    `${reciterId}-${idx}`,

                  url:
                    item.audio_url,

                  title:
                    SURAH_NAMES[
                      item.chapter_id
                    ]?.english ||
                    `Surah ${item.chapter_id}`,

                  artist:
                    selectedLanguage?.name ||
                    "Wasil Islamic App",

                  reciterId:
                    reciterId,

                  chapterId:
                    item.chapter_id,

                  type:
                    "translator",

                  artwork:
                    "https://res.cloudinary.com/daof5pne5/image/upload/v1786029254/notificationbg.png",
                })
              );

        }


        // ------------------------------------------------------
        // IOS
        // ------------------------------------------------------

        else {

          tracks =
            data

              .filter(
                item =>
                  item.audio_url
              )

              .map(
                (item, idx) => ({

                  id:
                    `${reciterId}-${idx}`,

                  url:
                    item.audio_url,

                  title:
                    SURAH_NAMES[
                      item.chapter_id
                    ]?.english ||
                    `Surah ${item.chapter_id}`,

                  artist:
                    selectedLanguage?.name ||
                    "Wasil Islamic App",

                  reciterId:
                    reciterId,

                  type:
                    "translator",

                  chapterId:
                    item.chapter_id,
                })
              );
        }


        // ------------------------------------------------------
        // NO TRACKS
        // ------------------------------------------------------

        if (!tracks.length) {

          console.log(
            "NO AUDIO TRACKS FOUND"
          );

          return;
        }


        // ------------------------------------------------------
        // ADD TRACKS
        // ------------------------------------------------------

        await TrackPlayer.add(
          tracks
        );


        console.log(
          "Tracks added:",
          tracks.length
        );


        // ------------------------------------------------------
        // SELECT TRACK
        // ------------------------------------------------------

        await TrackPlayer.skip(
          index
        );


        console.log(
          "Skipped:",
          index
        );


        // ------------------------------------------------------
        // PLAY
        // ------------------------------------------------------

        await TrackPlayer.play();


        console.log(
          "Playing"
        );


        // ------------------------------------------------------
        // STATE
        // ------------------------------------------------------

        const state =
          await TrackPlayer.getState();


        console.log(
          "Player state:",
          state
        );


        // ------------------------------------------------------
        // ACTIVE TRACK
        // ------------------------------------------------------

        const active =
          await TrackPlayer.getActiveTrack();


        console.log(
          "Active track:",
          active
        );


        setCurrentIndex(
          index
        );


        setIsPlaying(
          true
        );

      } catch (e) {

        console.log(
          "PLAY ERROR:",
          e
        );

      } finally {

        setPlayerLoadingTracks(
          false
        );
      }
    };


  // ============================================================
  // 14. TRACK CLICK
  // ============================================================

  const onPressTrack =
    async index => {

      try {

        const activeTrack =
          await TrackPlayer.getActiveTrack();


        const sameReciter =
          activeTrack?.reciterId &&
          String(
            activeTrack.reciterId
          ) ===
          String(reciterId);


        if (
          sameReciter &&
          currentIndex === index
        ) {

          togglePlayPause();

        } else {

          playTrack(index);
        }

      } catch (error) {

        console.log(
          "TRACK PRESS ERROR:",
          error
        );
      }
    };


  // ============================================================
  // 15. PLAY / PAUSE
  // ============================================================

  const togglePlayPause =
    async () => {

      try {

        const state =
          await TrackPlayer.getState();


        console.log(
          "CURRENT STATE:",
          state
        );


        if (
          state === State.Playing
        ) {

          await TrackPlayer.pause();

          setIsPlaying(
            false
          );

        } else {

          await TrackPlayer.play();

          setIsPlaying(
            true
          );
        }

      } catch (error) {

        console.log(
          "PLAY PAUSE ERROR:",
          error
        );
      }
    };


  // ============================================================
  // 16. PREVIOUS
  // ============================================================

  const playPrevious =
    async () => {

      try {

        await TrackPlayer.skipToPrevious();

      } catch (_) {}
    };


  // ============================================================
  // 17. NEXT
  // ============================================================

  const playNext =
    async () => {

      try {

        await TrackPlayer.skipToNext();

      } catch (_) {}
    };


  // ============================================================
  // 18. REWIND 10
  // ============================================================

  const rewind10 =
    async () => {

      try {

        const pos =
          await TrackPlayer.getPosition();


        await TrackPlayer.seekTo(
          Math.max(
            0,
            pos - 10
          )
        );

      } catch (error) {

        console.log(
          "REWIND ERROR:",
          error
        );
      }
    };


  // ============================================================
  // 19. FORWARD 10
  // ============================================================

  const forward10 =
    async () => {

      try {

        const pos =
          await TrackPlayer.getPosition();


        const dur =
          await TrackPlayer.getDuration();


        await TrackPlayer.seekTo(
          Math.min(
            dur,
            pos + 10
          )
        );

      } catch (error) {

        console.log(
          "FORWARD ERROR:",
          error
        );
      }
    };


  // ============================================================
  // 20. PROGRESS BAR
  // ============================================================

  const onProgressLayout =
    e => {

      progressBarWidth.current =
        e.nativeEvent.layout.width;
    };


  const onProgressPress =
    async e => {

      if (!duration) {
        return;
      }


      const x =
        e.nativeEvent.locationX;


      const percentage =
        x /
        progressBarWidth.current;


      const seekTime =
        percentage *
        duration;


      await TrackPlayer.seekTo(
        seekTime
      );
    };


  // ============================================================
  // 21. FORMAT TIME
  // ============================================================

  const formatTime =
    (sec = 0) => {

      const m =
        Math.floor(
          sec / 60
        );


      const s =
        Math.floor(
          sec % 60
        );


      return `${m}:${
        s < 10 ? "0" : ""
      }${s}`;
    };


  // ============================================================
  // 22. SCROLL FAILURE
  // ============================================================

  const onScrollToIndexFailed =
    info => {

      setTimeout(() => {

        flatListRef.current?.scrollToIndex({

          index:
            info.index,

          animated:
            true,
        });

      }, 300);
    };


  // ============================================================
  // 23. LANGUAGE LOADING
  // ============================================================

  if (
    loadingLanguages
  ) {

    return (

      <View
        style={{
          flex: 1,

          justifyContent:
            "center",

          alignItems:
            "center",

          backgroundColor:
            Colors.intermediate1,
        }}
      >

        <ActivityIndicator
          size="large"
          color={
            Colors.white
          }
        />

      </View>
    );
  }


  // ============================================================
  // 24. MAIN UI
  // ============================================================

  return (

    <View
      style={styles.container}
    >

      {/* ====================================================== */}
      {/* LANGUAGE DROPDOWN */}
      {/* ====================================================== */}

      {/* <TouchableOpacity
        style={
          styles.languageDropdown
        }

        onPress={() =>
          setLanguageDropdownVisible(
            true
          )
        }

        activeOpacity={0.8}
      >

        <View
          style={{
            flex: 1,
          }}
        >

          <Text
            style={
              styles.dropdownLabel
            }
          >
            Language
          </Text>


          <Text
            style={
              styles.selectedLanguage
            }
          >
            {
              selectedLanguage?.language ||
              "Select Language"
            }
          </Text>

        </View>


        <Text
          style={
            styles.dropdownArrow
          }
        >
          ▼
        </Text>

      </TouchableOpacity> */}


      {/* ====================================================== */}
      {/* LANGUAGE MODAL */}
      {/* ====================================================== */}

      <Modal
        visible={
          languageDropdownVisible
        }

        transparent

        animationType="fade"

        onRequestClose={() =>
          setLanguageDropdownVisible(
            false
          )
        }
      >

        <Pressable
          style={
            styles.modalOverlay
          }

          onPress={() =>
            setLanguageDropdownVisible(
              false
            )
          }
        >

          <Pressable
            style={
              styles.dropdownContainer
            }

            onPress={() => {}}
          >

            <Text
              style={
                styles.modalTitle
              }
            >
              Select Language
            </Text>


            <FlatList
              data={
                languages
              }

              keyExtractor={
                item =>
                  item._id ||
                  String(
                    item.reciterid
                  )
              }

              showsVerticalScrollIndicator={
                false
              }

              renderItem={({
                item,
              }) => {

                const isSelected =
                  String(
                    selectedLanguage?.reciterid
                  ) ===
                  String(
                    item.reciterid
                  );


                return (

                  <TouchableOpacity
                    style={[
                      styles.languageItem,

                      isSelected &&
                        styles.selectedLanguageItem,
                    ]}

                    onPress={() =>
                      onSelectLanguage(
                        item
                      )
                    }
                  >

                    <View
                      style={{
                        flex: 1,
                      }}
                    >

                      <Text
                        style={[
                          styles.languageName,

                          isSelected &&
                            styles.selectedLanguageText,
                        ]}
                      >
                        {
                          item.language
                        }
                      </Text>


                      <Text
                        style={[
                          styles.reciterName,

                          isSelected &&
                            styles.selectedLanguageText,
                        ]}
                      >
                        {
                          item.name
                        }
                      </Text>

                    </View>


                    {isSelected && (

                      <Text
                        style={
                          styles.checkMark
                        }
                      >
                        ✓
                      </Text>

                    )}

                  </TouchableOpacity>
                );
              }}
            />

          </Pressable>

        </Pressable>

      </Modal>


      {/* ====================================================== */}
      {/* SEARCH */}
      {/* ====================================================== */}

      <View
        style={
          styles.searchBox
        }
      >

        <SearchSVG />


        <TextInput
          placeholder="Search Surah"

          value={search}

          onChangeText={
            setSearch
          }

          style={
            styles.searchInput
          }

          placeholderTextColor={
            Colors.white
          }
        />

      </View>


      {/* ====================================================== */}
      {/* LOADING AUDIO */}
      {/* ====================================================== */}

      {loading ? (

        <View
          style={{
            flex: 1,

            justifyContent:
              "center",

            alignItems:
              "center",
          }}
        >

          <ActivityIndicator
            size="large"
            color={
              Colors.white
            }
          />

        </View>

      ) : filteredData.length === 0 ? (

        <View
          style={{
            alignItems:
              "center",

            marginTop:
              40,
          }}
        >

          <Text
            style={
              styles.noMatch
            }
          >
            No Match Found
          </Text>

        </View>

      ) : (

        <FlatList
          ref={
            flatListRef
          }

          data={
            filteredData
          }

          keyExtractor={
            item =>
              item.chapter_id.toString()
          }

          onScrollToIndexFailed={
            onScrollToIndexFailed
          }

          onScrollBeginDrag={() => {

            isUserScrolling.current =
              true;

          }}

          onScrollEndDrag={() => {

            isUserScrolling.current =
              false;

          }}

          onMomentumScrollEnd={() => {

            isUserScrolling.current =
              false;

          }}

          contentContainerStyle={{
            paddingBottom:
              10,
          }}

          renderItem={({
            item,
            index,
          }) => {

            const surah =
              SURAH_NAMES[
                item.chapter_id
              ];


            if (!surah) {
              return null;
            }


            const isCurrent =
              currentIndex ===
              index;


            return (

              <View
                style={[
                  styles.row,

                  isCurrent &&
                    styles.activeRow,
                ]}
              >

                {/* ========================================== */}
                {/* SURAH NUMBER */}
                {/* ========================================== */}

                <View
                  style={{
                    flex: 0.8,
                  }}
                >

                  <View
                    style={{
                      height:
                        Platform.OS ===
                        "ios"
                          ? 30
                          : 30,
                    }}
                  />


                  <View
                    style={{
                      left:
                        Platform.OS ===
                        "ios"
                          ? 16
                          : 16,
                    }}
                  >

                    <DuaListNumberBTSVGG />

                  </View>


                  <Text
                    style={{
                      left:
                        Platform.OS ===
                        "ios"
                          ? 0
                          : 2,

                      bottom:
                        Platform.OS ===
                        "ios"
                          ? 33
                          : 33,

                      textAlign:
                        "center",

                      fontWeight:
                        "500",

                      color:
                        Colors.white,

                      fontSize:
                        18,

                      fontFamily:
                        Platform.OS ===
                        "ios"
                          ? "Poppins-Regular"
                          : "Raleway",
                    }}
                  >
                    {
                      item.chapter_id
                    }
                  </Text>

                </View>


                {/* ========================================== */}
                {/* SURAH NAME */}
                {/* ========================================== */}

                <View
                  style={
                    styles.left
                  }
                >

                  <Text
                    style={[
                      styles.english,

                      isCurrent &&
                        styles.activeText,
                    ]}
                  >
                    {
                      surah.english
                    }
                  </Text>


                  <Text
                    style={[
                      styles.meaning,

                      isCurrent &&
                        styles.activeText,
                    ]}
                  >
                    {
                      surah.meaning
                    }
                  </Text>

                </View>


                {/* ========================================== */}
                {/* ARABIC */}
                {/* ========================================== */}

                <View
                  style={
                    styles.middle
                  }
                >

                  <Text
                    style={[
                      styles.arabic,

                      isCurrent &&
                        styles.activeArabic,
                    ]}
                  >
                    {
                      surah.arabic
                    }
                  </Text>

                </View>


                {/* ========================================== */}
                {/* PLAY BUTTON */}
                {/* ========================================== */}

                <TouchableOpacity
                  style={
                    styles.playButton
                  }

                  onPress={() =>
                    onPressTrack(
                      index
                    )
                  }

                  disabled={
                    playerLoadingTracks
                  }
                >

                  {isCurrent &&
                  isPlaying ? (

                    <WasilNewRecitersBTPauseIcon />

                  ) : (

                    <WasilNewRecitersBTPlayIcon />

                  )}

                </TouchableOpacity>

              </View>
            );
          }}
        />
      )}


      {/* ====================================================== */}
      {/* AUDIO PLAYER */}
      {/* ====================================================== */}

      {currentIndex !== null && (

        <View
          style={
            styles.audioContainer
          }
        >

          {/* ================================================ */}
          {/* PROGRESS */}
          {/* ================================================ */}

          <View
            style={{
              width:
                "100%",

              marginTop:
                30,

              paddingHorizontal:
                24,
            }}
          >

            <Pressable
              onPress={
                onProgressPress
              }

              onLayout={
                onProgressLayout
              }
            >

              <View
                style={
                  styles.progressBarBackground
                }
              >

                <Animated.View
                  style={[
                    styles.progressFill,

                    {
                      width:
                        progressAnim.interpolate({
                          inputRange:
                            [
                              0,
                              1,
                            ],

                          outputRange:
                            [
                              "0%",
                              "100%",
                            ],
                        }),
                    },
                  ]}
                />


                <Animated.View
                  style={[
                    styles.progressThumb,

                    {
                      left:
                        progressAnim.interpolate({
                          inputRange:
                            [
                              0,
                              1,
                            ],

                          outputRange:
                            [
                              0,

                              Math.max(
                                0,

                                progressBarWidth.current -
                                  16
                              ),
                            ],
                        }),
                    },
                  ]}
                />

              </View>

            </Pressable>


            {/* ============================================== */}
            {/* TIME */}
            {/* ============================================== */}

            <View
              style={
                styles.timeRow
              }
            >

              <Text
                style={
                  styles.timeText
                }
              >
                {
                  formatTime(
                    position
                  )
                }
              </Text>


              <Text
                style={
                  styles.timeText
                }
              >
                {
                  formatTime(
                    duration
                  )
                }
              </Text>

            </View>

          </View>


          {/* ================================================ */}
          {/* CONTROLS */}
          {/* ================================================ */}

          <View
            style={
              styles.controlRow
            }
          >

            <Pressable
              onPress={
                playPrevious
              }
            >

              <IslamicStoryPlayPreviousSVG />

            </Pressable>


            <Pressable
              onPress={
                rewind10
              }
            >

              <IslamicStoryPlayRewindSVG />

            </Pressable>


            <Pressable
              onPress={
                togglePlayPause
              }

              disabled={
                playDisabled
              }
            >

              <View
                style={[
                  styles.playButton,

                  playDisabled && {
                    opacity:
                      0.6,
                  },
                ]}
              >

                {playerLoadingTracks ? (

                  <ActivityIndicator
                    color={
                      Colors.white
                    }
                  />

                ) : isPlaying ? (

                  <IslamicStoryPauseBTAudioSVG />

                ) : (

                  <IslamicStoryPlayBTAudioSVG />

                )}

              </View>

            </Pressable>


            <Pressable
              onPress={
                forward10
              }
            >

              <IslamicStoryPlayForwardSVG />

            </Pressable>


            <Pressable
              onPress={
                playNext
              }
            >

              <IslamicStoryPlayNextSVG />

            </Pressable>

          </View>

        </View>
      )}

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================
// BLUE THEME — KEPT FROM YOUR ORIGINAL CODE
// ============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      Colors.intermediate1,
  },


  // ==========================================================
  // LANGUAGE DROPDOWN
  // ==========================================================

  languageDropdown: {
    flexDirection:
      "row",

    alignItems:
      "center",

    alignSelf:
      "center",

    width:
      "95%",

    minHeight:
      58,

    borderWidth:
      1,

    borderColor:
      Colors.bordercolor1,

    borderRadius:
      10,

    paddingHorizontal:
      14,

    marginTop:
      14,

    backgroundColor:
      Colors.intermediate1,
  },


  dropdownLabel: {
    fontSize:
      9,

    color:
      Colors.white,

    fontFamily:
      Platform.OS === "ios"
        ? "Asul-Bold"
        : "AsulBold",

    marginBottom:
      2,
  },


  selectedLanguage: {
    fontSize:
      14,

    color:
      Colors.white,

    fontFamily:
      "Poppins-Medium",
  },


  dropdownArrow: {
    fontSize:
      14,

    color:
      Colors.white,
  },


  // ==========================================================
  // MODAL
  // ==========================================================

  modalOverlay: {
    flex: 1,

    backgroundColor:
      "rgba(0,0,0,0.45)",

    justifyContent:
      "center",

    alignItems:
      "center",
  },


  dropdownContainer: {
    width:
      "90%",

    maxHeight:
      "70%",

    backgroundColor:
      Colors.intermediate1,

    borderRadius:
      14,

    padding:
      15,
  },


  modalTitle: {
    fontSize:
      18,

    color:
      Colors.white,

    fontFamily:
      "Poppins-Medium",

    marginBottom:
      10,
  },


  languageItem: {
    flexDirection:
      "row",

    alignItems:
      "center",

    minHeight:
      58,

    paddingHorizontal:
      12,

    borderRadius:
      8,

    marginBottom:
      6,

    borderWidth:
      1,

    borderColor:
      Colors.bordercolor1,
  },


  selectedLanguageItem: {
    backgroundColor:
      Colors.secondary1,
  },


  languageName: {
    fontSize:
      14,

    color:
      Colors.white,

    fontFamily:
      "Poppins-Medium",
  },


  reciterName: {
    fontSize:
      10,

    color:
      Colors.white,

    marginTop:
      2,

    fontFamily:
      "Poppins-Regular",
  },


  selectedLanguageText: {
    color:
      Colors.white,
  },


  checkMark: {
    fontSize:
      20,

    color:
      Colors.white,

    fontWeight:
      "bold",
  },


  // ==========================================================
  // SEARCH
  // ==========================================================

  searchBox: {
    flexDirection:
      "row",

    alignItems:
      "center",

    alignSelf:
      "center",

    borderWidth:
      1,

    borderColor:
      Colors.bordercolor1,

    borderRadius:
      10,

    paddingHorizontal:
      12,

    height:
      46,

    width:
      "95%",

    marginVertical:
      14,
  },


  searchInput: {
    flex: 1,

    marginLeft:
      5,

    top:
      2,

    fontSize:
      14,

    paddingBottom:
      Platform.OS ===
      "ios"
        ? 4
        : 10,

    color:
      Colors.white,

    fontFamily:
      "Poppins-Medium",
  },


  // ==========================================================
  // SURAH ROW
  // ==========================================================

  row: {
    flexDirection:
      "row",

    alignItems:
      "center",

    width:
      "95%",

    height:
      70,

    alignSelf:
      "center",

    borderRadius:
      10,

    borderWidth:
      1,

    marginTop:
      10,

    borderColor:
      Colors.bordercolor1,
  },


  left: {
    flex:
      1.5,

    justifyContent:
      "center",
  },


  middle: {
    flex:
      1.5,

    alignSelf:
      "flex-start",

    top:
      15,
  },


  english: {
    fontSize:
      12,

    color:
      Colors.white,

    fontFamily:
      Platform.OS ===
      "ios"
        ? "Asul-Bold"
        : "AsulBold",

    fontWeight:
      "400",
  },


  meaning: {
    fontSize:
      9,

    color:
      Colors.white,

    fontFamily:
      Platform.OS ===
      "ios"
        ? "Asul-Bold"
        : "AsulBold",
  },


  arabic: {
    fontSize:
      32,

    right:
      30,

    color:
      Colors.white,

    textAlign:
      "right",

    fontFamily:
      "sura_names",
  },


  activeRow: {
    backgroundColor:
      Colors.secondary1,
  },


  activeText: {
    color:
      Colors.white,

    fontWeight:
      "600",
  },


  activeArabic: {
    color:
      Colors.white,
  },


  playButton: {
    padding:
      10,
  },


  playAllButton: {
    margin:
      10,

    padding:
      12,

    backgroundColor:
      Colors.wasilnewthemecolorsecond,

    borderRadius:
      8,

    alignItems:
      "center",
  },


  playAllText: {
    color:
      Colors.white,

    fontSize:
      16,
  },


  // ==========================================================
  // AUDIO PLAYER
  // ==========================================================

  audioContainer: {
    position:
      "absolute",

    bottom:
      0,

    width:
      "100%",

    backgroundColor:
      Colors.white,

    padding:
      16,

    borderTopLeftRadius:
      16,

    borderTopRightRadius:
      16,

    borderTopWidth:
      1,

    borderColor:
      "#eaeaea",
  },


  topPlayerRow: {
    flexDirection:
      "row",

    justifyContent:
      "space-between",

    alignItems:
      "center",
  },


  progressBarBackground: {
    height:
      4,

    backgroundColor:
      "#E0E0E0",

    borderRadius:
      2,

    overflow:
      "hidden",
  },


  progressFill: {
    height:
      4,

    backgroundColor:
      Colors.wasilnewthemecolorsecond,

    borderRadius:
      2,
  },


  progressThumb: {
    position:
      "absolute",

    width:
      16,

    height:
      16,

    borderRadius:
      8,

    backgroundColor:
      Colors.wasilnewthemecolorsecond,

    top:
      -6,
  },


  timeRow: {
    flexDirection:
      "row",

    justifyContent:
      "space-between",

    marginTop:
      8,
  },


  timeText: {
    fontSize:
      12,

    color:
      "#666",
  },


  controlRow: {
    flexDirection:
      "row",

    justifyContent:
      "space-around",

    alignItems:
      "center",

    marginTop:
      20,
  },


  speedContainer: {
    marginTop:
      25,

    borderRadius:
      20,

    borderWidth:
      1,

    borderColor:
      Colors.wasilnewthemecolorthird,

    alignSelf:
      "center",

    backgroundColor:
      Colors.wasilnewthemecolorthird,
  },


  speedButton: {
    paddingHorizontal:
      12,

    paddingVertical:
      8,
  },


  speedText: {
    color:
      Colors.white,

    fontWeight:
      "600",
  },


  // ==========================================================
  // NO MATCH
  // ==========================================================

  noMatch: {
    height:
      "100%",

    top:
      300,

    fontSize:
      15,

    alignSelf:
      "center",

    color:
      Colors.white,

    fontFamily:
      "Poppins-Light",
  },

});