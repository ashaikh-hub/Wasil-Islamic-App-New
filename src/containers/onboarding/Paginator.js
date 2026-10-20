import React from 'react';
import { View, Animated } from 'react-native';
import { useScreen } from '../../theme';

export const Paginator = ({ data, scrollx }) => {
  const { width } = useScreen();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        return (
          <Animated.View
            key={String(i)}
            style={{
              height: 8,
              borderRadius: 4,
              marginHorizontal: 3,
              width: scrollx.interpolate({ inputRange, outputRange: [8, 22, 8], extrapolate: 'clamp' }),
              backgroundColor: scrollx.interpolate({ inputRange, outputRange: ['rgba(255,255,255,0.4)', '#FFFFFF', 'rgba(255,255,255,0.4)'], extrapolate: 'clamp' }),
            }}
          />
        );
      })}
    </View>
  );
};

export default Paginator;
