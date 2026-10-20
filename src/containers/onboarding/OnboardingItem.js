import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts, TypeScale, Spacing, useScreen } from '../../theme';

// One full-screen slide: artwork with its title and description anchored above the controls.
export const OnboardingItem = ({ item, bottomInset, note }) => {
  const { width, height } = useScreen();
  return (
    <ImageBackground source={item.image} style={{ width, height }} resizeMode="cover">
      <LinearGradient
        colors={['rgba(20,10,60,0)', 'rgba(20,10,60,0.55)', 'rgba(20,10,60,0.85)']}
        locations={[0, 0.35, 1]}
        style={[styles.textArea, { paddingBottom: bottomInset, minHeight: height * 0.5 }]}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {item.title}
        </Text>
        <Text style={styles.description} maxFontSizeMultiplier={1.3}>
          {item.description}
        </Text>
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  textArea: { position: 'absolute', left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', paddingHorizontal: Spacing.xl, gap: Spacing.md },
  title: { textAlign: 'center', fontSize: TypeScale.headline + 2, lineHeight: 34, color: '#FFFFFF', fontFamily: Fonts.heading },
  description: { textAlign: 'center', fontSize: TypeScale.body + 1, lineHeight: 23, color: 'rgba(255,255,255,0.9)', fontFamily: Fonts.body },
  note: { textAlign: 'center', fontSize: TypeScale.small, lineHeight: 17, color: 'rgba(255,255,255,0.7)', fontFamily: Fonts.body },
});

export default OnboardingItem;
