import Fonts from './fonts';

// Standard stack header for the current theme.
export const headerOptions = (Colors, title) => ({
  ...(title !== undefined ? { title } : null),
  animation: 'slide_from_right',
  headerTitleAlign: 'center',
  headerTintColor: Colors.headerText,
  headerTitleStyle: { color: Colors.headerText, fontSize: 18, fontFamily: Fonts.heading },
  headerStyle: { backgroundColor: Colors.headerBg },
  headerShadowVisible: false,
});
