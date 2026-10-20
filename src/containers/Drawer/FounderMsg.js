import React, { useMemo } from 'react';
import { StatusBar, StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Images, Fonts, TypeScale, Spacing, useScreen } from '../../theme';
import InfoText from './InfoText';

const BANNER_HEIGHT = 170;
const PORTRAIT = 148;

const FounderMsg = () => {
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);

  return (
    <View style={s.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}>
        <View style={{ height: BANNER_HEIGHT + PORTRAIT / 2 }}>
          {/* Slanted brand banner, drawn to the screen width */}
          <Svg width={width} height={BANNER_HEIGHT} style={StyleSheet.absoluteFill}>
            <Polygon points={`0,0 ${width},0 ${width},${BANNER_HEIGHT} 0,${BANNER_HEIGHT * 0.6}`} fill={Colors.surface} />
          </Svg>
          <View style={s.portraitRing}>
            <Image source={Images.FounderTwo} style={s.portrait} accessibilityLabel="Akif M Shaikh" />
          </View>
        </View>

        <View style={s.content}>
          <Text style={s.greeting}>Assalamu Alaikum,</Text>
          <InfoText style={s.body} highlightStyle={s.highlight}>
            The journey of Wasil: Islamic App began with a simple vision to create a platform that seamlessly integrates the timeless wisdom of Islam with the power of modern technology. As Muslims, we face the challenge of staying connected to our faith amidst the fast pace of life. Wasil was born out of the desire to make that connection easier, more accessible, and deeply personal for everyone.
          </InfoText>
          <InfoText style={s.body} highlightStyle={s.highlight}>
            Our vision is to empower Muslims around the world with a digital companion that supports their spiritual growth, fosters learning, and builds a global community rooted in Islamic values. Through Wasil, we aim to inspire and guide you on your journey of faith whether you are a seasoned practitioner or just beginning to explore Islam.
          </InfoText>
          <InfoText style={s.body} highlightStyle={s.highlight}>
            Together, let's embark on this transformative journey with Wasil, your ultimate Islamic companion.
          </InfoText>
          <Text style={[s.body, s.regards]}>Regards</Text>
          <Text style={s.signName}>Akif M Shaikh</Text>
          <Text style={s.signRole}>Founder</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default FounderMsg;

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    portraitRing: {
      position: 'absolute',
      bottom: 0,
      alignSelf: 'center',
      width: PORTRAIT,
      height: PORTRAIT,
      borderRadius: PORTRAIT / 2,
      padding: 4,
      backgroundColor: Colors.gold,
    },
    portrait: { width: '100%', height: '100%', borderRadius: PORTRAIT / 2 },
    content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.md },
    greeting: { fontSize: TypeScale.title + 2, color: Colors.heading, fontFamily: Fonts.heading },
    body: { fontSize: TypeScale.body, lineHeight: 22, color: Colors.textPrimary, fontFamily: Fonts.body },
    highlight: { color: Colors.gold, fontFamily: Fonts.bodySemiBold },
    regards: { marginTop: Spacing.sm },
    signName: { fontSize: TypeScale.subtitle, color: Colors.heading, fontFamily: Fonts.heading },
    signRole: { marginTop: -Spacing.sm, fontSize: TypeScale.small + 1, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
