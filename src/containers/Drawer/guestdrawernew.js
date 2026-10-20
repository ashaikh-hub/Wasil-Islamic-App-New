import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from 'react-native-splash-screen';
import Modal from 'react-native-modal';
import Share from 'react-native-share';
import { useTheme, headerOptions, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';
import HomeNew from '../HomeNew/HomeNew';
import {
  WasilLogoDrawerSVG,
  HelpGreenSVG,
  FollowUsGreenSVG,
  RateGreenSVG,
  ContactGreenSVG,
  PolicyGreenSVG,
  FounderGreenSVG,
  FAQsGreenSVG,
  ShareGreenSVG,
  HijriGreenSVG,
  ClosePlayDrawerSVG,
  FacebookFollowUpSVG,
  YoutubeFollowUpSVG,
  InstagramFollowUpSVG,
  TiktokFollowUpSVG,
  WasilNoAdsSvg,
  WasilNoAdssSvg,
  WasilNoAdsGreenSvg,
} from '../../assets/icons';

const Drawer = createDrawerNavigator();
const APP_VERSION = '2.0';
const STORE_LINK = Platform.select({
  android: 'https://play.google.com/store/apps/details?id=com.wasilislamicapp',
  default: 'https://www.wasil.io',
});
const NO_ADS_BADGE = { blue: WasilNoAdsSvg, green: WasilNoAdsGreenSvg, white: WasilNoAdssSvg };

const SOCIAL = [
  { label: 'Facebook', handle: 'facebook.com/wasilislamic', url: 'https://www.facebook.com/wasilislamic', Icon: FacebookFollowUpSVG },
  { label: 'YouTube', handle: '@WasilIslamicChannel', url: 'https://www.youtube.com/@WasilIslamicChannel', Icon: YoutubeFollowUpSVG },
  { label: 'TikTok', handle: '@WasilIslamic', url: 'https://www.tiktok.com/@WasilIslamic', Icon: TiktokFollowUpSVG },
  { label: 'Instagram', handle: '@wasilislamic', url: 'https://instagram.com/wasilislamic', Icon: InstagramFollowUpSVG },
];

function CustomDrawerContent({ navigation }) {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const [followVisible, setFollowVisible] = useState(false);

  const shareApp = () => Share.open({ message: `Wasil Islamic App | www.wasil.io\n\n${STORE_LINK}` }).catch(() => {});

  const items = [
    { label: 'About Us', Icon: HelpGreenSVG, onPress: () => navigation.navigate('AboutUs') },
    { label: 'Founder Message', Icon: FounderGreenSVG, onPress: () => navigation.navigate('FounderMsg') },
    { label: 'Hijri Dates Adjustment', Icon: HijriGreenSVG, onPress: () => navigation.navigate('HijriDates') },
    { label: 'Share Wasil App', Icon: ShareGreenSVG, onPress: shareApp },
    { label: 'Follow Us', Icon: FollowUsGreenSVG, onPress: () => setFollowVisible(true) },
    { label: 'Rate & Feedback', Icon: RateGreenSVG, onPress: () => navigation.navigate('RateFeedback') },
    { label: 'Contact Us', Icon: ContactGreenSVG, onPress: () => navigation.navigate('ContactUs') },
    { label: "FAQ's", Icon: FAQsGreenSVG, onPress: () => navigation.navigate('FAQs') },
    { label: 'Privacy Policy', Icon: PolicyGreenSVG, onPress: () => navigation.navigate('Privacypolicy') },
  ];

  return (
    <DrawerContentScrollView contentContainerStyle={s.scroll} bounces={false}>
      <View style={[s.header, { paddingTop: insets.top + Spacing.xl }]}>
        <WasilLogoDrawerSVG />
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ThemeSetting')} style={s.themeCard} accessibilityRole="button">
        <LinearGradient colors={[Colors.surface, Colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.themeGradient}>
          <View style={s.themeIcon}>
            <Text style={{ fontSize: 22 }}>🎨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.themeTitle}>Theme Settings</Text>
            <Text style={s.themeSubtitle}>Blue · Green · White</Text>
          </View>
          <Text style={s.themeChevron}>›</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={s.menu}>
        {items.map(({ label, Icon, onPress }) => (
          <TouchableOpacity key={label} onPress={onPress} style={s.item} activeOpacity={0.7} accessibilityRole="button">
            <View style={s.itemIcon}>
              <Icon />
            </View>
            <Text style={s.itemText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.version, { marginBottom: insets.bottom + Spacing.lg }]}>App Version {APP_VERSION}</Text>

      <Modal
        isVisible={followVisible}
        onBackdropPress={() => setFollowVisible(false)}
        onBackButtonPress={() => setFollowVisible(false)}
        useNativeDriver>
        <View style={s.followSheet}>
          <View style={s.followHeader}>
            <Text style={s.followTitle}>Follow Us</Text>
            <TouchableOpacity onPress={() => setFollowVisible(false)} style={s.close} accessibilityLabel="Close">
              <ClosePlayDrawerSVG />
            </TouchableOpacity>
          </View>
          {SOCIAL.map(({ label, handle, url, Icon }) => (
            <TouchableOpacity key={label} onPress={() => Linking.openURL(url)} style={s.social} accessibilityRole="link" accessibilityLabel={`Wasil on ${label}`}>
              <Icon />
              <View>
                <Text style={s.socialLabel}>{label}</Text>
                <Text style={s.socialHandle}>{handle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  const { Colors, theme } = useTheme();
  const Badge = NO_ADS_BADGE[theme] || WasilNoAdssSvg;
  return (
    <Drawer.Navigator
      screenOptions={{
        ...headerOptions(Colors),
        drawerStyle: { backgroundColor: '#FFFFFF' },
        headerRight: () => (
          <View style={{ marginRight: Spacing.lg }}>
            <Badge />
          </View>
        ),
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Wasil Islamic App" component={HomeNew} />
    </Drawer.Navigator>
  );
}

export default function GuestDrawer() {
  useEffect(() => {
    const t = setTimeout(() => SplashScreen.hide(), 1000);
    return () => clearTimeout(t);
  }, []);
  return <MyDrawer />;
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    scroll: { paddingTop: 0, flexGrow: 1, backgroundColor: '#FFFFFF' },
    header: { alignItems: 'center', justifyContent: 'center', paddingBottom: Spacing.xl, backgroundColor: Colors.surface },
    themeCard: { marginHorizontal: Spacing.md, marginTop: Spacing.lg, borderRadius: Radius.lg, overflow: 'hidden' },
    themeGradient: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
    themeIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    themeTitle: { fontSize: TypeScale.subtitle, color: '#FFFFFF', fontFamily: Fonts.bodyBold },
    themeSubtitle: { fontSize: TypeScale.caption, color: 'rgba(255,255,255,0.8)', fontFamily: Fonts.body },
    themeChevron: { fontSize: 24, color: '#FFFFFF' },
    menu: { marginTop: Spacing.md, paddingHorizontal: Spacing.sm },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      minHeight: 50,
      paddingHorizontal: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#ECE8F3',
    },
    itemIcon: { width: 28, alignItems: 'center' },
    itemText: { flex: 1, fontSize: TypeScale.body + 1, color: '#1F1A2E', fontFamily: Fonts.body },
    version: { marginTop: 'auto', paddingTop: Spacing.xl, textAlign: 'center', fontSize: TypeScale.small, color: '#7A7488', fontFamily: Fonts.body },
    followSheet: { borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: '#FFFFFF', paddingBottom: Spacing.md },
    followHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, backgroundColor: Colors.surface },
    followTitle: { fontSize: TypeScale.title, color: '#FFFFFF', fontFamily: Fonts.heading },
    close: { position: 'absolute', right: Spacing.sm, width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
    social: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 56, paddingHorizontal: Spacing.lg },
    socialLabel: { fontSize: TypeScale.body + 1, color: '#1F1A2E', fontFamily: Fonts.bodySemiBold },
    socialHandle: { fontSize: TypeScale.small, color: '#7A7488', fontFamily: Fonts.body },
  });
