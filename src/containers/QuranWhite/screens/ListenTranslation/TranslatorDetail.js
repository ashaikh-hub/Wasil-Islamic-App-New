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
  WasilNewRecitersWhitePlayIcon,
  WasilNewRecitersWhitePauseIcon,
  SearchSVG,
  IslamicStoryPlayPreviousSVG,
  IslamicStoryPlayNextSVG,
  IslamicStoryPlayRewindSVG,
  IslamicStoryPlayForwardSVG,
  IslamicStoryPlayAudioSVG,
  IslamicStoryPauseAudioSVG,
  DuaListNumberSVGG,
} from "../../../../assets/icons";

import { Colors } from "../../../../theme";

import { savePlayerState } from "./playerStorageT";


export default function TranslatorDetail({ route }) {


  const initialReciterId = route?.params?.reciterId || null;
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageDropdownVisible, setLanguageDropdownVisible] =
    useState(false);
  const [reciterId, setReciterId] = useState(initialReciterId);

  const [data, setData] = useState([]);

  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [playDisabled, setPlayDisabled] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerLoadingTracks, setPlayerLoadingTracks] = useState(false);

  const flatListRef = useRef(null);

  const isUserScrolling = useRef(false);
  const shouldAutoScroll = useRef(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(0);

  const { position, duration } = useProgress(250);
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

      console.log("TRANSLATOR API:", json);

      const languageData = Array.isArray(json)
        ? json
        : json.data || [];

      setLanguages(languageData);


      if (languageData.length > 0) {

        let defaultLanguage = null;

        // If route has reciterId, find matching language
        if (initialReciterId) {
          defaultLanguage = languageData.find(
            item =>
              String(item.reciterid) ===
              String(initialReciterId)
          );
        }

        if (!defaultLanguage) {
          defaultLanguage = languageData[0];
        }

        setSelectedLanguage(defaultLanguage);

        setReciterId(defaultLanguage.reciterid);
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


  useEffect(() => {

    if (!reciterId) {
      return;
    }

    fetchRecitations(reciterId);

  }, [reciterId]);


  const fetchRecitations = async (selectedReciterId) => {

    try {

      setLoading(true);


      try {
        await TrackPlayer.reset();
      } catch (e) {
        console.log(
          "TrackPlayer reset error:",
          e
        );
      }

      setCurrentIndex(null);
      setIsPlaying(false);
      setPlayerReady(false);
      setData([]);


      const url =
        `https://islamicapp.vercel.app/api/translatoraudiosreciterid?reciterid=${selectedReciterId}`;

      console.log(
        "AUDIO API:",
        url
      );

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          `Audio API Error: ${res.status}`
        );
      }

      const json = await res.json();

      console.log(
        "AUDIO API RESPONSE:",
        json
      );

      let audioFiles = [];

      if (Array.isArray(json)) {

        audioFiles = json;

      } else if (Array.isArray(json.audio_files)) {

        audioFiles = json.audio_files;

      } else if (Array.isArray(json.data)) {

        audioFiles = json.data;

      } else if (Array.isArray(json.audioFiles)) {

        audioFiles = json.audioFiles;

      }

      console.log(
        "FINAL AUDIO FILES:",
        audioFiles
      );

      setData(audioFiles);

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


  const onSelectLanguage = async (language) => {

    try {

      setLanguageDropdownVisible(false);

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

      /*
       * Save selected language
       */

      setSelectedLanguage(language);

      /*
       * This triggers fetchRecitations()
       */

      setReciterId(language.reciterid);

      /*
       * Clear search
       */

      setSearch("");

    } catch (error) {

      console.error(
        "LANGUAGE SELECT ERROR:",
        error
      );
    }
  };


  // ============================================================
  // 5. TRACK PLAYER SYNC
  // ============================================================

  useEffect(() => {

    setCurrentIndex(null);
    setIsPlaying(false);

    const syncTrack = async () => {

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

          setCurrentIndex(index);

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
  // 6. TRACK PLAYER EVENTS
  // ============================================================

  useTrackPlayerEvents(
    [
      Event.PlaybackTrackChanged,
      Event.PlaybackState
    ],
    async event => {

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

          shouldAutoScroll.current = true;

          if (
            !isUserScrolling.current
          ) {

            flatListRef.current?.scrollToIndex({
              index: event.nextTrack,
              animated: true,
              viewPosition: 0.5,
            });
          }
        }
      }

      if (
        event.type ===
        Event.PlaybackState
      ) {

        setIsPlaying(
          event.state === State.Playing
        );
      }
    }
  );


  // ============================================================
  // 7. PROGRESS
  // ============================================================

  useEffect(() => {

    if (!duration) {
      return;
    }

    Animated.timing(
      progressAnim,
      {
        toValue: position / duration,
        duration: 200,
        useNativeDriver: false,
      }
    ).start();

  }, [position, duration]);


  // ============================================================
  // 8. SAVE PLAYER STATE
  // ============================================================

  useEffect(() => {

    if (currentIndex !== null) {
      savePlayerState();
    }

  }, [
    currentIndex,
    isPlaying,
    position
  ]);


  // ============================================================
  // 9. SEARCH
  // ============================================================

  const filteredData = data.filter(
    item => {

      const surah =
        SURAH_NAMES[item.chapter_id];

      if (!surah) {
        return false;
      }

      return surah.english
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );
    }
  );


  // ============================================================
  // 10. PLAY TRACK
  // ============================================================

  const playTrack = async index => {

    try {

      setPlayerLoadingTracks(true);

      await TrackPlayer.reset();

      let tracks;

      if (
        Platform.OS === "android"
      ) {

        tracks = data
          .filter(
            item => item.audio_url
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

      } else {

        tracks = data
          .filter(
            item => item.audio_url
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

      if (!tracks.length) {

        console.log(
          "NO AUDIO TRACKS FOUND"
        );

        return;
      }

      await TrackPlayer.add(
        tracks
      );

      console.log(
        "Tracks added:",
        tracks.length
      );

      await TrackPlayer.skip(
        index
      );

      await TrackPlayer.play();

      setCurrentIndex(index);

      setIsPlaying(true);

    } catch (e) {

      console.log(
        "PLAY ERROR:",
        e
      );

    } finally {

      setPlayerLoadingTracks(false);
    }
  };


  // ============================================================
  // 11. TRACK CLICK
  // ============================================================

  const onPressTrack = async index => {

    try {

      const activeTrack =
        await TrackPlayer.getActiveTrack();

      const sameReciter =
        activeTrack?.reciterId &&
        String(activeTrack.reciterId) ===
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
  // 12. PLAY / PAUSE
  // ============================================================

  const togglePlayPause = async () => {

    try {

      const state =
        await TrackPlayer.getState();

      if (
        state === State.Playing
      ) {

        await TrackPlayer.pause();

        setIsPlaying(false);

      } else {

        await TrackPlayer.play();

        setIsPlaying(true);
      }

    } catch (error) {

      console.log(
        "PLAY PAUSE ERROR:",
        error
      );
    }
  };


  // ============================================================
  // 13. PREVIOUS
  // ============================================================

  const playPrevious = async () => {

    try {

      await TrackPlayer.skipToPrevious();

    } catch (_) {}
  };


  // ============================================================
  // 14. NEXT
  // ============================================================

  const playNext = async () => {

    try {

      await TrackPlayer.skipToNext();

    } catch (_) {}
  };


  // ============================================================
  // 15. REWIND
  // ============================================================

  const rewind10 = async () => {

    const pos =
      await TrackPlayer.getPosition();

    await TrackPlayer.seekTo(
      Math.max(0, pos - 10)
    );
  };


  // ============================================================
  // 16. FORWARD
  // ============================================================

  const forward10 = async () => {

    const pos =
      await TrackPlayer.getPosition();

    const dur =
      await TrackPlayer.getDuration();

    await TrackPlayer.seekTo(
      Math.min(dur, pos + 10)
    );
  };


  // ============================================================
  // 17. PROGRESS BAR
  // ============================================================

  const onProgressLayout = e => {

    progressBarWidth.current =
      e.nativeEvent.layout.width;
  };


  const onProgressPress = async e => {

    if (!duration) {
      return;
    }

    const x =
      e.nativeEvent.locationX;

    const percentage =
      x / progressBarWidth.current;

    const seekTime =
      percentage * duration;

    await TrackPlayer.seekTo(
      seekTime
    );
  };


  // ============================================================
  // 18. FORMAT TIME
  // ============================================================

  const formatTime = (sec = 0) => {

    const m =
      Math.floor(sec / 60);

    const s =
      Math.floor(sec % 60);

    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };


  // ============================================================
  // 19. SCROLL
  // ============================================================

  const onScrollToIndexFailed =
    info => {

      setTimeout(() => {

        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
        });

      }, 300);
    };


  // ============================================================
  // LOADING LANGUAGES
  // ============================================================

  if (loadingLanguages) {

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.white,
        }}
      >

        <ActivityIndicator
          size="large"
          color={
            Colors.wasilnewthemecolorsecond
          }
        />

      </View>
    );
  }


  // ============================================================
  // UI
  // ============================================================

  return (

    <View style={styles.container}>

      {/* ================================================= */}
      {/* LANGUAGE DROPDOWN */}
      {/* ================================================= */}

      {/* <TouchableOpacity
        style={styles.languageDropdown}
        onPress={() =>
          setLanguageDropdownVisible(true)
        }
        activeOpacity={0.8}
      >

        <View style={{ flex: 1 }}>

          <Text
            style={styles.dropdownLabel}
          >
            Language
          </Text>

          <Text
            style={styles.selectedLanguage}
          >
            {selectedLanguage?.language ||
              "Select Language"}
          </Text>

        </View>

        <Text
          style={styles.dropdownArrow}
        >
          ▼
        </Text>

      </TouchableOpacity> */}


      {/* ================================================= */}
      {/* LANGUAGE MODAL */}
      {/* ================================================= */}

      <Modal
        visible={
          languageDropdownVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setLanguageDropdownVisible(false)
        }
      >

        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setLanguageDropdownVisible(false)
          }
        >

          <Pressable
            style={styles.dropdownContainer}
            onPress={() => {}}
          >

            <Text
              style={styles.modalTitle}
            >
              Select Language
            </Text>


            <FlatList
              data={languages}
              keyExtractor={item =>
                item._id ||
                String(item.reciterid)
              }
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {

                const isSelected =
                  selectedLanguage?.reciterid ===
                  item.reciterid;

                return (

                  <TouchableOpacity
                    style={[
                      styles.languageItem,
                      isSelected &&
                        styles.selectedLanguageItem,
                    ]}
                    onPress={() =>
                      onSelectLanguage(item)
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
                        {item.language}
                      </Text>

                      <Text
                        style={[
                          styles.reciterName,
                          isSelected &&
                            styles.selectedLanguageText,
                        ]}
                      >
                        {item.name}
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


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <View style={styles.searchBox}>

        <SearchSVG />

        <TextInput
          placeholder="Search Surah"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={
            Colors.secondary
          }
        />

      </View>


      {/* ================================================= */}
      {/* AUDIO/SURAH LOADING */}
      {/* ================================================= */}

      {loading ? (

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <ActivityIndicator
            size="large"
            color={
              Colors.wasilnewthemecolorsecond
            }
          />

        </View>

      ) : filteredData.length === 0 ? (

        <View
          style={{
            alignItems: "center",
            marginTop: 40,
          }}
        >

          <Text style={styles.noMatch}>
            No Match Found
          </Text>

        </View>

      ) : (

        <FlatList
          ref={flatListRef}
          data={filteredData}
          keyExtractor={item =>
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
            paddingBottom: 10,
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
              currentIndex === index;

            return (

              <View
                style={[
                  styles.row,
                  isCurrent &&
                    styles.activeRow,
                ]}
              >

                {/* SURAH NUMBER */}

                <View
                  style={{
                    flex: 0.8,
                  }}
                >

                  <View
                    style={{
                      height: 30,
                    }}
                  />

                  <View
                    style={{
                      left: 16,
                    }}
                  >

                    <DuaListNumberSVGG />

                  </View>

                  <Text
                    style={{
                      left:
                        Platform.OS ===
                        "ios"
                          ? 0
                          : 2,

                      bottom: 33,

                      textAlign:
                        "center",

                      fontWeight: "500",

                      color:
                        isCurrent
                          ? Colors.white
                          : Colors.wasilnewthemecolorsecond,

                      fontSize: 18,

                      fontFamily:
                        Platform.OS ===
                        "ios"
                          ? "Poppins-Regular"
                          : "Raleway",
                    }}
                  >
                    {item.chapter_id}
                  </Text>

                </View>


                {/* SURAH NAME */}

                <View style={styles.left}>

                  <Text
                    style={[
                      styles.english,
                      isCurrent &&
                        styles.activeText,
                    ]}
                  >
                    {surah.english}
                  </Text>

                  <Text
                    style={[
                      styles.meaning,
                      isCurrent &&
                        styles.activeText,
                    ]}
                  >
                    {surah.meaning}
                  </Text>

                </View>


                {/* ARABIC */}

                <View
                  style={styles.middle}
                >

                  <Text
                    style={[
                      styles.arabic,
                      isCurrent &&
                        styles.activeArabic,
                    ]}
                  >
                    {surah.arabic}
                  </Text>

                </View>


                {/* PLAY BUTTON */}

                <TouchableOpacity
                  style={
                    styles.playButton
                  }
                  onPress={() =>
                    onPressTrack(index)
                  }
                  disabled={
                    playerLoadingTracks
                  }
                >

                  {isCurrent &&
                  isPlaying ? (

                    <WasilNewRecitersWhitePauseIcon />

                  ) : (

                    <WasilNewRecitersWhitePlayIcon />

                  )}

                </TouchableOpacity>

              </View>
            );
          }}
        />
      )}


      {/* ================================================= */}
      {/* AUDIO PLAYER */}
      {/* ================================================= */}

      {currentIndex !== null && (

        <View
          style={styles.audioContainer}
        >

          <View
            style={{
              width: "100%",
              marginTop: 30,
              paddingHorizontal: 24,
            }}
          >

            {/* PROGRESS */}

            <Pressable
              onPress={onProgressPress}
              onLayout={onProgressLayout}
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
                          inputRange: [0, 1],
                          outputRange: [
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
                          inputRange: [
                            0,
                            1,
                          ],
                          outputRange: [
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


            {/* TIME */}

            <View
              style={styles.timeRow}
            >

              <Text
                style={styles.timeText}
              >
                {formatTime(position)}
              </Text>

              <Text
                style={styles.timeText}
              >
                {formatTime(duration)}
              </Text>

            </View>

          </View>


          {/* CONTROLS */}

          <View
            style={styles.controlRow}
          >

            <Pressable
              onPress={playPrevious}
            >
              <IslamicStoryPlayPreviousSVG />
            </Pressable>


            <Pressable
              onPress={rewind10}
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
                    opacity: 0.6,
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

                  <IslamicStoryPauseAudioSVG />

                ) : (

                  <IslamicStoryPlayAudioSVG />

                )}

              </View>

            </Pressable>


            <Pressable
              onPress={forward10}
            >
              <IslamicStoryPlayForwardSVG />
            </Pressable>


            <Pressable
              onPress={playNext}
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },


  // ----------------------------------------------------------
  // LANGUAGE DROPDOWN
  // ----------------------------------------------------------

  languageDropdown: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "95%",
    minHeight: 58,
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 14,
    backgroundColor: Colors.white,
  },

  dropdownLabel: {
    fontSize: 9,
    color: Colors.secondary,
    fontFamily:
      Platform.OS === "ios"
        ? "Asul-Bold"
        : "AsulBold",
    marginBottom: 2,
  },

  selectedLanguage: {
    fontSize: 14,
    color:
      Colors.wasilnewthemecolorsecond,
    fontFamily: "Poppins-Medium",
  },

  dropdownArrow: {
    fontSize: 14,
    color:
      Colors.wasilnewthemecolorsecond,
  },


  // ----------------------------------------------------------
  // MODAL
  // ----------------------------------------------------------

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  dropdownContainer: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 15,
  },

  modalTitle: {
    fontSize: 18,
    color: Colors.secondary,
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },

  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor:
      Colors.bordercolor,
  },

  selectedLanguageItem: {
    backgroundColor:
      Colors.wasilnewthemecolor,
  },

  languageName: {
    fontSize: 14,
    color: Colors.secondary,
    fontFamily: "Poppins-Medium",
  },

  reciterName: {
    fontSize: 10,
    color: "#777",
    marginTop: 2,
    fontFamily: "Poppins-Regular",
  },

  selectedLanguageText: {
    color: Colors.white,
  },

  checkMark: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "bold",
  },


  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    width: "95%",
    marginVertical: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 5,
    top: 2,
    fontSize: 14,
    paddingBottom:
      Platform.OS === "ios"
        ? 4
        : 10,
    color: Colors.secondary,
    fontFamily: "Poppins-Medium",
  },


  // ----------------------------------------------------------
  // SURAH ROW
  // ----------------------------------------------------------

  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    height: 70,
    alignSelf: "center",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    borderColor: Colors.bordercolor,
  },

  left: {
    flex: 1.5,
    justifyContent: "center",
  },

  middle: {
    flex: 1.5,
    alignSelf: "flex-start",
    top: 15,
  },

  english: {
    fontSize: 12,
    color: Colors.secondary,
    fontFamily:
      Platform.OS === "ios"
        ? "Asul-Bold"
        : "AsulBold",
  },

  meaning: {
    fontSize: 9,
    color: Colors.secondary,
    fontFamily:
      Platform.OS === "ios"
        ? "Asul-Bold"
        : "AsulBold",
  },

  arabic: {
    fontSize: 32,
    right: 30,
    color:
      Colors.wasilnewthemecolorsecond,
    textAlign: "right",
    fontFamily: "sura_names",
  },

  activeRow: {
    backgroundColor:
      Colors.wasilnewthemecolor,
  },

  activeText: {
    color: Colors.white,
    fontWeight: "600",
  },

  activeArabic: {
    color: Colors.white,
  },

  playButton: {
    padding: 10,
  },


  // ----------------------------------------------------------
  // AUDIO PLAYER
  // ----------------------------------------------------------

  audioContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.white,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: "#eaeaea",
  },

  progressBarBackground: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },

  progressFill: {
    height: 4,
    backgroundColor:
      Colors.wasilnewthemecolorsecond,
    borderRadius: 2,
  },

  progressThumb: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor:
      Colors.wasilnewthemecolorsecond,
    top: -6,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  timeText: {
    fontSize: 12,
    color: "#666",
  },

  controlRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },

  noMatch: {
    height: "100%",
    top: 300,
    fontSize: 15,
    alignSelf: "center",
    color: Colors.black,
    fontFamily: "Poppins-Light",
  },
});