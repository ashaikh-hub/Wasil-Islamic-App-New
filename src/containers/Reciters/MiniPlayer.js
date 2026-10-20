import React, { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Image,
  Platform,
  PanResponder,
  Dimensions,
} from "react-native";

import TrackPlayer, {
  usePlaybackState,
  useProgress,
  State,
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";

import {
  IslamicStoryPlayNextSVG,
  IslamicStoryPlayPreviousSVG,
  IslamicStoryPlayBTAudioSVG,
  IslamicStoryPauseBTAudioSVG,
} from "../../assets/icons";

import { Colors } from "../../theme";

import reciters from "../../containers/Reciters/newreciters";

export default function MiniPlayer() {
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(Colors), [Colors]);
  const PlayIcon = theme === "white" ? IslamicStoryPlayAudioSVG : IslamicStoryPlayBTAudioSVG;
  const PauseIcon = theme === "white" ? IslamicStoryPauseAudioSVG : IslamicStoryPauseBTAudioSVG;
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciter, setReciter] = useState(null);

  const playbackState = usePlaybackState();

  const { position, duration } = useProgress(250);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const progressBarWidth = useRef(0);

  const screenWidth = Dimensions.get("window").width;

  const translateX = useRef(new Animated.Value(0)).current;

  const lastDirection = useRef(-1);

  // IMPORTANT:
  // This prevents TrackPlayer events from bringing
  // the MiniPlayer back after the user manually closes it.
  const isMiniPlayerClosed = useRef(false);

  // ---------------------------------------------------------
  // GET RECITER INFO
  // ---------------------------------------------------------

  const getReciterInfo = (url) => {
    if (!url) return null;

    const slug = url.split("/")[4]?.toLowerCase();

    if (!slug) return null;

    const normalize = (text = "") =>
      text
        .toLowerCase()
        .replace(/[`']/g, "")
        .replace(/-/g, "_")
        .replace(/\s+/g, "_")
        .replace(/\./g, "");

    const reciterMap = {
      mishari_al_afasy: "mishari rashid al afasy",
      abdulbasit_murattal: "abdul baset abdul samad",
      abdulbasit_mujawwad: "abdul baset abdul samad",
      abdurrahmaan_as_sudais: "abdur rahman as sudais",
      "saud_ash-shuraym": "saud ash shuraim",
      husary: "mahmoud khalil al husary",
      abu_bakr_shatri: "abu bakr al shatri",
      hani_ar_rifai: "hani ar rifai",
      siddiq_minshawi: "mohamed siddiq al minshawi",
      khalifah_taniji: "khalifah al tunaiji",
    };

    const search =
      reciterMap[slug] || slug.replace(/_/g, " ");

    return reciters.find((item) =>
      normalize(item.name).includes(normalize(search))
    );
  };

  // ---------------------------------------------------------
  // LOAD CURRENT TRACK
  // ---------------------------------------------------------

  const loadTrack = async () => {
    try {
      // User manually closed the MiniPlayer.
      // Don't allow playback state events to restore it.
      if (isMiniPlayerClosed.current) {
        return;
      }

      const current = await TrackPlayer.getActiveTrack();

      // No active track
      if (!current) {
        setTrack(null);
        return;
      }

      // Don't show MiniPlayer for Quran
      if (current?.type === "quran") {
        setTrack(null);
        return;
      }

      setTrack(current);
    } catch (error) {
      console.log("loadTrack error:", error);
    }
  };

  // ---------------------------------------------------------
  // SYNC PLAYBACK STATE
  // ---------------------------------------------------------

  const syncPlayerState = async () => {
    try {
      const state = await TrackPlayer.getState();

      setIsPlaying(state === State.Playing);
    } catch (error) {
      console.log("syncPlayerState error:", error);
    }
  };

  // ---------------------------------------------------------
  // INITIAL / PLAYBACK STATE
  // ---------------------------------------------------------

  useEffect(() => {
    if (isMiniPlayerClosed.current) {
      return;
    }

    loadTrack();
  }, [playbackState]);

  useEffect(() => {
    syncPlayerState();
  }, [playbackState]);

  // ---------------------------------------------------------
  // TRACK PLAYER EVENTS
  // ---------------------------------------------------------

  useTrackPlayerEvents(
    [Event.PlaybackActiveTrackChanged],
    async () => {
      try {
        const current = await TrackPlayer.getActiveTrack();

        // Track was removed / queue reset
        if (!current) {
          return;
        }

        // If user manually closed MiniPlayer,
        // don't restore it because of TrackPlayer events.
        if (isMiniPlayerClosed.current) {
          return;
        }

        // Don't show MiniPlayer for Quran
        if (current.type === "quran") {
          setTrack(null);
          return;
        }

        // A new audio has started.
        // Allow MiniPlayer again.
        isMiniPlayerClosed.current = false;

        setTrack(current);
      } catch (error) {
        console.log(
          "PlaybackActiveTrackChanged error:",
          error
        );
      }
    }
  );

  // ---------------------------------------------------------
  // PROGRESS ANIMATION
  // ---------------------------------------------------------

  useEffect(() => {
    if (!duration) {
      progressAnim.setValue(0);
      return;
    }

    const progress = Math.min(
      Math.max(position / duration, 0),
      1
    );

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [position, duration]);

  // ---------------------------------------------------------
  // RECITER
  // ---------------------------------------------------------

  useEffect(() => {
    if (track?.url) {
      setReciter(getReciterInfo(track.url));
    } else {
      setReciter(null);
    }
  }, [track]);

  // ---------------------------------------------------------
  // CLOSE MINIPLAYER
  // ---------------------------------------------------------

  const closeMiniPlayer = async () => {
    /*
     * VERY IMPORTANT:
     *
     * Set this BEFORE stop/reset.
     *
     * TrackPlayer can fire events when stop/reset happens.
     * This flag prevents those events from restoring the player.
     */
    isMiniPlayerClosed.current = true;

    /*
     * Remove MiniPlayer immediately from UI.
     */
    setTrack(null);
    setIsPlaying(false);
    setReciter(null);

    translateX.setValue(0);

    /*
     * Stop and completely reset TrackPlayer.
     */
    try {
      await TrackPlayer.stop();

      await TrackPlayer.reset();
    } catch (error) {
      console.log(
        "Error closing MiniPlayer:",
        error
      );
    }
  };

  // ---------------------------------------------------------
  // PAN RESPONDER
  // ---------------------------------------------------------

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 20 &&
          Math.abs(gestureState.dx) >
            Math.abs(gestureState.dy)
        );
      },

      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },

      onPanResponderRelease: (_, gestureState) => {
        const shouldDismiss =
          Math.abs(gestureState.dx) > 120 ||
          Math.abs(gestureState.vx) > 0.8;

        if (shouldDismiss) {
          /*
           * Remember swipe direction.
           *
           * -1 = left
           *  1 = right
           */
          lastDirection.current =
            gestureState.dx < 0 ? -1 : 1;

          /*
           * First animate MiniPlayer away.
           */
          Animated.timing(translateX, {
            toValue:
              lastDirection.current === -1
                ? -screenWidth
                : screenWidth,

            duration: 220,

            useNativeDriver: true,
          }).start(() => {
            /*
             * After animation finishes:
             *
             * Stop audio
             * Reset queue
             * Remove MiniPlayer
             */
            closeMiniPlayer();
          });
        } else {
          /*
           * Swipe wasn't large enough.
           * Return MiniPlayer to original position.
           */
          Animated.spring(translateX, {
            toValue: 0,
            friction: 7,
            tension: 60,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ---------------------------------------------------------
  // PLAY / PAUSE
  // ---------------------------------------------------------

  const togglePlay = async () => {
    try {
      const state = await TrackPlayer.getState();

      if (state === State.Playing) {
        await TrackPlayer.pause();

        setIsPlaying(false);
      } else {
        /*
         * If user starts playing again after MiniPlayer
         * wasn't manually closed, keep it active.
         */
        isMiniPlayerClosed.current = false;

        await TrackPlayer.play();

        setIsPlaying(true);
      }
    } catch (error) {
      console.log(
        "togglePlay error:",
        error
      );
    }
  };

  // ---------------------------------------------------------
  // NEXT
  // ---------------------------------------------------------

  const playNext = async () => {
    try {
      isMiniPlayerClosed.current = false;

      await TrackPlayer.skipToNext();
    } catch (error) {
      console.log(
        "playNext error:",
        error
      );
    }
  };

  // ---------------------------------------------------------
  // PREVIOUS
  // ---------------------------------------------------------

  const playPrev = async () => {
    try {
      isMiniPlayerClosed.current = false;

      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.log(
        "playPrev error:",
        error
      );
    }
  };

  // ---------------------------------------------------------
  // PROGRESS BAR LAYOUT
  // ---------------------------------------------------------

  const onProgressLayout = (e) => {
    progressBarWidth.current =
      e.nativeEvent.layout.width;
  };

  // ---------------------------------------------------------
  // SEEK
  // ---------------------------------------------------------

  const onSeek = async (e) => {
    try {
      if (!duration) return;

      if (!progressBarWidth.current) return;

      const percent =
        e.nativeEvent.locationX /
        progressBarWidth.current;

      const safePercent = Math.min(
        Math.max(percent, 0),
        1
      );

      await TrackPlayer.seekTo(
        safePercent * duration
      );
    } catch (error) {
      console.log(
        "onSeek error:",
        error
      );
    }
  };

  // ---------------------------------------------------------
  // IMAGE
  // ---------------------------------------------------------

  const imageSource = reciter?.image
    ? reciter.image
    : track?.artwork
    ? { uri: track.artwork }
    : require("../../assets/speakerbg.png");

  // ---------------------------------------------------------
  // NO TRACK = NO MINIPLAYER
  // ---------------------------------------------------------

  if (!track) {
    return null;
  }

  // ---------------------------------------------------------
  // MINIPLAYER
  // ---------------------------------------------------------

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { bottom: insets.bottom + 12 },
        {
          opacity: translateX.interpolate({
            inputRange: [-screenWidth, 0, screenWidth],
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          }),

          transform: [
            {
              translateX,
            },
          ],
        },
      ]}
    >
      <View style={styles.row}>

        {/* COVER */}
        {reciter ? (
          <ReciterAvatar reciter={reciter} size={52} />
        ) : (
          <Image source={imageSource} style={styles.cover} />
        )}
        {/* INFORMATION */}
        <View style={styles.info}>

          {/* TITLE */}
          <Text
            numberOfLines={1}
            style={styles.title}
          >
            {track.title}
          </Text>

          {/* ARTIST / RECITER */}
          <Text
            numberOfLines={1}
            style={styles.artist}
          >
            {reciter?.name || track.artist}
          </Text>

          {/* PROGRESS */}
          <Pressable
            onLayout={onProgressLayout}
            onPress={onSeek}
          >
            <View
              style={styles.progressBackground}
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
            </View>
          </Pressable>

        </View>

        {/* CONTROLS */}
        <View style={styles.controls}>

          {/* PREVIOUS */}
          <TouchableOpacity
            onPress={playPrev}
            activeOpacity={0.7}
            style={styles.control}
            accessibilityRole="button"
            accessibilityLabel="Previous"
          >
            <IslamicStoryPlayPreviousSVG />
          </TouchableOpacity>

          {/* PLAY / PAUSE */}
          <TouchableOpacity
            style={styles.control}
            onPress={togglePlay}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </TouchableOpacity>

          {/* NEXT */}
          <TouchableOpacity
            onPress={playNext}
            activeOpacity={0.7}
            style={styles.control}
            accessibilityRole="button"
            accessibilityLabel="Next"
          >
            <IslamicStoryPlayNextSVG />
          </TouchableOpacity>

        </View>

      </View>
    </Animated.View>
  );
}

// =========================================================
// STYLES
// =========================================================

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      alignSelf: "center",
      width: "94%",
      maxWidth: 560,
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#E6E1F0",
      paddingHorizontal: 10,
      paddingVertical: 10,
      elevation: 10,
      shadowColor: "#000000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    row: { flexDirection: "row", alignItems: "center" },
    cover: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#F5F5F5" },
    info: { flex: 1, marginHorizontal: 10 },
    title: { color: Colors.inkAccent, fontSize: TypeScale.body + 1, fontFamily: Fonts.headingRegular },
    artist: { color: "#5E5970", marginTop: 2, marginBottom: 8, fontSize: TypeScale.small, fontFamily: Fonts.body },
    progressBackground: { height: 3, backgroundColor: "#E6E1F0", borderRadius: 2, overflow: "hidden" },
    progressFill: { height: 3, backgroundColor: Colors.inkAccent, borderRadius: 2 },
    controls: { flexDirection: "row", alignItems: "center" },
    control: { minWidth: MIN_TOUCH - 4, minHeight: MIN_TOUCH, alignItems: "center", justifyContent: "center" },
  });
