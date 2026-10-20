import { Platform } from 'react-native';

const ios = Platform.OS === 'ios';

// Font families already bundled with the app, resolved per platform in one place.
export const Fonts = {
  body: ios ? 'Nunito Sans 7pt' : 'NunitoSansRegular',
  bodyBold: 'NunitoSans-Bold',
  bodySemiBold: 'NunitoSans-SemiBold',
  heading: ios ? 'Asul-Bold' : 'AsulBold',
  headingRegular: ios ? 'Asul-Regular' : 'AsulRegular',
  arabic: ios ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',
};

// Type scale. Nothing in the app should go below `caption`.
export const TypeScale = {
  caption: 11,
  small: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  headline: 24,
  display: 28,
};

export default Fonts;
