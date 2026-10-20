import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { OnboardingForward } from '../../assets/icons';

const SIZE = 60;
const STROKE = 2.5;
const R = SIZE / 2 - STROKE;
const C = 2 * Math.PI * R;

// Forward button wrapped in a ring that fills as the user moves through the slides.
export const Nextbutton = ({ percentage, scrollTo, label = 'Next' }) => (
  <TouchableOpacity onPress={scrollTo} activeOpacity={0.7} style={styles.hit} accessibilityRole="button" accessibilityLabel={label}>
    <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
      <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(255,255,255,0.3)" strokeWidth={STROKE} fill="none" />
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        stroke="#FFFFFF"
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={C}
        strokeDashoffset={C - (C * Math.min(percentage, 100)) / 100}
        strokeLinecap="round"
        rotation={-90}
        origin={`${SIZE / 2}, ${SIZE / 2}`}
      />
    </Svg>
    <View style={styles.icon}>
      <OnboardingForward />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  hit: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  icon: { alignItems: 'center', justifyContent: 'center' },
});

export default Nextbutton;
