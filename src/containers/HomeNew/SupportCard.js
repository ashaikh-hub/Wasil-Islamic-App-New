import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH } from '../../theme';
import { FacebookFollowUpSVG, YoutubeFollowUpSVG, InstagramFollowUpSVG, TiktokFollowUpSVG } from '../../assets/icons';

const SOCIALS = [
  { label: 'Facebook', Icon: FacebookFollowUpSVG, url: 'https://www.facebook.com/wasilislamic' },
  { label: 'YouTube', Icon: YoutubeFollowUpSVG, url: 'https://www.youtube.com/@WasilIslamicChannel' },
  { label: 'TikTok', Icon: TiktokFollowUpSVG, url: 'https://www.tiktok.com/@WasilIslamic' },
  { label: 'Instagram', Icon: InstagramFollowUpSVG, url: 'https://instagram.com/wasilislamic' },
];

// "Support Wasil" call to action with the Follow Us sheet.
export default function SupportCard({ navigation }) {
  const { Colors } = useTheme();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const [open, setOpen] = useState(false);

  return (
    <View style={s.card}>
      <Text style={s.title}>Support Wasil. Be a part of something greater</Text>
      <Text style={s.body}>
        Your support helps us keep Wasil free for everyone and build a meaningful Islamic experience that benefits millions around the world.
      </Text>
      <View style={s.buttons}>
        <TouchableOpacity style={[s.button, s.primary]} onPress={() => setOpen(true)} accessibilityRole="button">
          <Text style={[s.buttonText, s.primaryText]}>Join Wasil Circle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.button, s.secondary]} onPress={() => navigation.navigate('RateFeedback')} accessibilityRole="button">
          <Text style={[s.buttonText, s.secondaryText]}>Rate & Feedback</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={open} onBackdropPress={() => setOpen(false)} onBackButtonPress={() => setOpen(false)} style={s.modal}>
        <View style={s.sheet}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle} accessibilityRole="header">
              Follow us
            </Text>
            <TouchableOpacity onPress={() => setOpen(false)} style={s.close} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={s.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          {SOCIALS.map(({ label, Icon, url }) => (
            <TouchableOpacity key={label} style={s.social} onPress={() => Linking.openURL(url).catch(() => {})} accessibilityRole="link" accessibilityLabel={`Follow Wasil on ${label}`}>
              <Icon />
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  return StyleSheet.create({
    card: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      backgroundColor: isLight ? Colors.surfaceAlt : Colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.cardBorder,
    },
    title: { fontSize: TypeScale.title, lineHeight: 26, color: Colors.heading, fontFamily: Fonts.heading },
    body: { marginTop: Spacing.sm, fontSize: TypeScale.body, lineHeight: 21, color: Colors.textSecondary, fontFamily: Fonts.body },
    buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.lg },
    button: { flexGrow: 1, minHeight: MIN_TOUCH, paddingHorizontal: Spacing.lg, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
    primary: { backgroundColor: Colors.button },
    secondary: { borderWidth: 1, borderColor: isLight ? Colors.accent : Colors.textPrimary },
    buttonText: { fontSize: TypeScale.body, fontFamily: Fonts.bodyBold },
    primaryText: { color: Colors.onButton },
    secondaryText: { color: isLight ? Colors.accent : Colors.textPrimary },
    modal: { justifyContent: 'flex-end', margin: 0 },
    sheet: { backgroundColor: Colors.background, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg, padding: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.sm },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
    sheetTitle: { fontSize: TypeScale.title, color: Colors.heading, fontFamily: Fonts.heading },
    close: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
    closeText: { fontSize: 18, color: Colors.textSecondary },
    social: { alignItems: 'center' },
  });
};
