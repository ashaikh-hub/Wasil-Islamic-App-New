import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius, useScreen } from '../../theme';
import {
  WasilNewSteptwoayahIcon,
  WasilNewSteptwohandIcon,
  WasilNewGSteptwoayahIcon,
  WasilNewGSteptwohandIcon,
  WasilNewShahadahVideoPlayBTIcon,
  WasilNewShahadahVideoPlayGIcon,
  WasilNewShahadahVideoPlayIcon,
} from '../../assets/icons';

const VIDEO_ID = 'SsXHcObCLJw';
const CLOUD = 'https://res.cloudinary.com/daof5pne5/image/upload';

// Per-theme artwork. Everything else comes from theme tokens.
const ART = {
  blue: {
    stepsBg: `${CLOUD}/v1766518380/shahadah/shahadahstepbg.png`,
    AyahIcon: WasilNewSteptwoayahIcon,
    HandIcon: WasilNewSteptwohandIcon,
    PlayIcon: WasilNewShahadahVideoPlayBTIcon,
  },
  green: {
    stepsBg: `${CLOUD}/v1786531171/shahadah/shahadahstepbgtwo.png`,
    AyahIcon: WasilNewGSteptwoayahIcon,
    HandIcon: WasilNewGSteptwohandIcon,
    PlayIcon: WasilNewShahadahVideoPlayGIcon,
  },
  white: {
    stepsBg: `${CLOUD}/v1766518380/shahadah/shahadahstepbg.png`,
    AyahIcon: WasilNewSteptwoayahIcon,
    HandIcon: WasilNewSteptwohandIcon,
    PlayIcon: WasilNewShahadahVideoPlayIcon,
  },
};
const HERO_IMAGE = { uri: `${CLOUD}/v1766518381/shahadah/shahadahbg.png` };
const WELCOME_IMAGE = { uri: `${CLOUD}/v1766518381/shahadah/shahadahwelbg.png` };

const StepCard = ({ step, title, description, background, styles, children }) => (
  <ImageBackground source={{ uri: background }} style={styles.card} imageStyle={styles.cardBgImage}>
    <View style={styles.stepBadge}>
      <Text style={styles.stepText}>STEP {step}</Text>
    </View>
    <Text style={styles.cardTitle} accessibilityRole="header">
      {title}
    </Text>
    <Text style={styles.cardDesc}>{description}</Text>
    {children}
  </ImageBackground>
);

const ShahadahNew = () => {
  const { Colors, theme } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const art = ART[theme] || ART.white;
  const { AyahIcon, HandIcon, PlayIcon } = art;

  const [videoVisible, setVideoVisible] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const videoWidth = Math.min(width - Spacing.lg * 2, 640);
  const videoHeight = Math.round((videoWidth * 9) / 16);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        showsVerticalScrollIndicator={false}>
        <Image source={HERO_IMAGE} style={styles.heroImage} accessibilityIgnoresInvertColors />
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            If you're ready to enter Islam, the process begins with the Shahadah, the declaration of
            faith. This step is simple but deeply meaningful.
          </Text>
        </View>

        <StepCard
          step="01"
          title="Understand What You’re Declaring"
          description="Before you say the Shahadah, it’s important to know what you’re committing to:"
          background={art.stepsBg}
          styles={styles}>
          <Text style={styles.highlightTitle}>Belief in One God (Allah):</Text>
          <Text style={styles.paragraph}>
            You’re affirming that there is no god worthy of worship except Allah.
          </Text>
          <Text style={[styles.highlightTitle, styles.spacedTitle]}>
            Belief in Muhammad as the Final Prophet:
          </Text>
          <Text style={styles.paragraph}>
            You’re declaring that Muhammad (peace be upon him) is Allah’s final messenger who
            brought the teachings of Islam.
          </Text>
        </StepCard>

        <StepCard
          step="02"
          title="Recite the Shahadah"
          description="When you’re ready, say the following words with sincerity:"
          background={art.stepsBg}
          styles={styles}>
          <View style={styles.shahadahRow}>
            <View style={styles.ayahContainer}>
              <AyahIcon />
              <Text style={styles.shahadahEnglish}>
                “Ashadu an la ilaha illa-llah, wa ashadu anna muhammadan rasul ullah.”
              </Text>
            </View>
            <View style={styles.handContainer}>
              <HandIcon />
            </View>
          </View>

          <TouchableOpacity
            style={styles.videoButton}
            onPress={() => setVideoVisible(true)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Watch how to say the Shahadah">
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <PlayIcon />
            </Animated.View>
            <Text style={styles.videoButtonText}>Watch how to say it</Text>
          </TouchableOpacity>
        </StepCard>

        <ImageBackground source={WELCOME_IMAGE} style={styles.welcomeCard} imageStyle={styles.welcomeImage}>
          <Text style={styles.welcomeTitle}>Welcome to Islam</Text>
          <Text style={styles.welcomeText}>May Allah guide and bless you on this beautiful path!</Text>
        </ImageBackground>
      </ScrollView>

      <Modal
        isVisible={videoVisible}
        onBackdropPress={() => setVideoVisible(false)}
        onBackButtonPress={() => setVideoVisible(false)}
        backdropOpacity={0.8}
        useNativeDriver
        style={styles.modal}>
        <View style={[styles.videoSheet, { width: videoWidth }]}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoTitle}>The Shahadah</Text>
            <TouchableOpacity
              onPress={() => setVideoVisible(false)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close video">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: videoWidth, height: videoHeight, backgroundColor: Colors.black }}>
            {videoVisible ? (
              <YoutubePlayer width={videoWidth} height={videoHeight} play videoId={VIDEO_ID} />
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    heroImage: { width: '100%', aspectRatio: 16 / 9, backgroundColor: Colors.surface },
    introCard: {
      marginTop: -Spacing.xxl,
      marginHorizontal: Spacing.lg,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      backgroundColor: Colors.cardBg,
      borderWidth: 1,
      borderColor: Colors.cardBorder,
      shadowColor: Colors.black,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    introText: {
      fontSize: TypeScale.subtitle - 1,
      lineHeight: 22,
      textAlign: 'center',
      color: Colors.cardTitle,
      fontFamily: Fonts.bodySemiBold,
    },

    card: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.cardBorder,
      backgroundColor: Colors.cardBg,
      overflow: 'hidden',
    },
    cardBgImage: { resizeMode: 'cover' },
    stepBadge: {
      backgroundColor: Colors.action,
      paddingHorizontal: Spacing.md + 2,
      paddingVertical: Spacing.xs + 2,
      borderRadius: Radius.pill,
      marginBottom: Spacing.md,
      alignSelf: 'flex-start',
    },
    stepText: { color: Colors.onAction, fontFamily: Fonts.bodyBold, fontSize: TypeScale.small, letterSpacing: 1 },
    cardTitle: { fontSize: TypeScale.title, color: Colors.cardTitle, marginBottom: Spacing.sm, fontFamily: Fonts.heading },
    cardDesc: { fontSize: TypeScale.body, lineHeight: 20, color: Colors.cardText, marginBottom: Spacing.md, fontFamily: Fonts.body },
    highlightTitle: { fontSize: TypeScale.subtitle - 1, color: Colors.cardTitle, fontFamily: Fonts.bodyBold },
    spacedTitle: { marginTop: Spacing.lg },
    paragraph: { fontSize: TypeScale.body, color: Colors.cardText, marginTop: Spacing.xs + 2, lineHeight: 20, fontFamily: Fonts.body },

    shahadahRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
    ayahContainer: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm, gap: Spacing.sm },
    handContainer: { width: 80, alignItems: 'center' },
    shahadahEnglish: {
      color: Colors.cardText,
      fontSize: TypeScale.body,
      lineHeight: 20,
      textAlign: 'center',
      fontFamily: Fonts.bodySemiBold,
    },

    videoButton: {
      marginTop: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'center',
      gap: Spacing.sm,
      minHeight: 60,
      paddingVertical: Spacing.xs + 2,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.cardTitle,
    },
    videoButtonText: { color: Colors.cardTitle, fontSize: TypeScale.subtitle - 1, fontFamily: Fonts.bodyBold },

    welcomeCard: {
      margin: Spacing.lg,
      minHeight: 170,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.cardBorder,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      padding: Spacing.lg,
      paddingBottom: Spacing.xl,
    },
    welcomeImage: { resizeMode: 'cover' },
    welcomeTitle: { fontSize: TypeScale.display, color: isLight ? Colors.heading : Colors.white, fontFamily: Fonts.heading },
    welcomeText: {
      marginTop: Spacing.xs,
      maxWidth: '75%',
      fontSize: TypeScale.body,
      lineHeight: 20,
      color: isLight ? Colors.textPrimary : Colors.white,
      fontFamily: Fonts.bodySemiBold,
    },

    modal: { alignItems: 'center', justifyContent: 'center', margin: 0 },
    videoSheet: { borderRadius: Radius.md, overflow: 'hidden', backgroundColor: Colors.surface },
    videoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    videoTitle: { color: Colors.onSurface, fontSize: TypeScale.subtitle, fontFamily: Fonts.heading },
    closeText: { color: Colors.onSurface, fontSize: 20 },
  });
};

export default ShahadahNew;
