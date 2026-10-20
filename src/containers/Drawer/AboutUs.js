import React, { useMemo } from 'react';
import { StatusBar, StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import InfoText from './InfoText';

const HERO = { uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1734071182/aboutusimage.png' };

const FEATURES = [
  ['Accurate Prayer Times', 'Stay up-to-date with precise prayer times based on your location.'],
  ['Qur’an Reader', 'Access a beautifully designed Qur’an reader with translation and tafsir.'],
  ['Daily Duas & Supplications', 'A collection of daily duas to enhance your connection to Allah.'],
  ['Hadith Collections', 'Explore authentic Hadith to gain deeper knowledge of the Prophet’s teachings.'],
  ['Qibla Direction & Mosque Locator', 'Easily find the direction of Qibla and nearby mosques.'],
  ['Audio & Video Content', 'Listen to Islamic lectures, podcasts, and watch videos on various topics.'],
];

const AboutUs = () => {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);

  return (
    <View style={s.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + Spacing.xxl }]}>
        <Image source={HERO} style={s.hero} resizeMode="contain" />

        <InfoText style={s.body} highlightStyle={s.highlight}>
          Welcome to Wasil: Islamic App, your trusted companion on a spiritual journey through Islam. We’ve designed Wasil to be more than just an app. It’s a comprehensive platform that merges timeless Islamic teachings with the convenience of modern technology. Whether you're a lifelong follower, a new revert, or simply curious about the beauty of Islam, Wasil provides the tools and resources to deepen your faith, learn, and grow.
        </InfoText>
        <InfoText style={s.body} highlightStyle={s.highlight}>
          At Wasil, we believe that your spiritual path is personal and unique. Our goal is to support that journey by offering a seamless experience, helping you stay connected to your faith through daily prayer guides, Qur'anic insights, community engagement, and much more. With a user-friendly interface and carefully curated features, Wasil ensures that your Islamic experience is not only easy but enriching.
        </InfoText>

        <Text style={s.heading}>Key Features</Text>
        <View style={s.card}>
          {FEATURES.map(([title, text]) => (
            <View key={title} style={s.feature}>
              <View style={s.dot} />
              <Text style={s.featureText}>
                <Text style={s.featureTitle}>{title}: </Text>
                {text}
              </Text>
            </View>
          ))}
        </View>

        <InfoText style={s.body} highlightStyle={s.highlight}>
          Join the Wasil Islamic App community today, where faith meets innovation. Let us guide you in nurturing your spiritual connection every step of the way.
        </InfoText>
        <Text style={s.quote}>“Wasil Islamic App” — your ultimate Islamic companion, now and always.</Text>

        <Text style={s.signName}>Akif M Shaikh</Text>
        <Text style={s.signRole}>Founder</Text>
      </ScrollView>
    </View>
  );
};

export default AboutUs;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    hero: { width: '100%', aspectRatio: 2.6, marginTop: Spacing.md },
    body: { fontSize: TypeScale.body, lineHeight: 22, color: Colors.textPrimary, fontFamily: Fonts.body },
    highlight: { color: Colors.gold, fontFamily: Fonts.bodySemiBold },
    heading: { marginTop: Spacing.md, fontSize: TypeScale.title, color: Colors.heading, fontFamily: Fonts.heading },
    card: { padding: Spacing.lg, gap: Spacing.md, borderRadius: Radius.lg, backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface },
    feature: { flexDirection: 'row', gap: Spacing.md },
    dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7, backgroundColor: Colors.gold },
    featureText: { flex: 1, fontSize: TypeScale.body, lineHeight: 21, color: Colors.textPrimary, fontFamily: Fonts.body },
    featureTitle: { fontFamily: Fonts.bodyBold, color: Colors.heading },
    quote: { fontSize: TypeScale.body + 1, lineHeight: 22, fontStyle: 'italic', color: Colors.textSecondary, fontFamily: Fonts.body },
    signName: { marginTop: Spacing.md, fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading },
    signRole: { marginTop: -Spacing.sm, fontSize: TypeScale.small + 1, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
};
