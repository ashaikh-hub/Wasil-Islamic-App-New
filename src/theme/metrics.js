import { useWindowDimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const s = scale;
export const vs = verticalScale;
export const ms = (size, factor = 0.3) => moderateScale(size, factor);

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const Radius = { sm: 8, md: 12, lg: 16, pill: 999 };
export const MIN_TOUCH = 44;

// Live window size (updates on rotation / split screen / foldables).
export const useScreen = () => {
  const { width, height } = useWindowDimensions();
  return { width, height, isSmall: width < 360, isTablet: Math.min(width, height) >= 600 };
};
