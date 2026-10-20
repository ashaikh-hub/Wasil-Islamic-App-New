import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, Image, TouchableOpacity, Text, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Fonts, TypeScale, Spacing, Radius, MIN_TOUCH, useScreen } from '../../theme';
import { SectionHeader } from '../../components';
import { GREETING_CATEGORIES } from './greetingCategories';

const mimeFor = (url = '') => (/\.png($|\?)/i.test(url) ? 'image/png' : 'image/jpeg');

const GreetingCardShare = ({ route, navigation }) => {
  const { cardimage, catname } = route.params;
  const { Colors } = useTheme();
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [sharing, setSharing] = useState(false);

  const cardWidth = Math.min(400, width - Spacing.lg * 2);

  const shareImage = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const res = await ReactNativeBlobUtil.fetch('GET', cardimage);
      if (res.info().status !== 200) throw new Error(`HTTP ${res.info().status}`);
      await Share.open({ message: catname, url: `data:${mimeFor(cardimage)};base64,${res.base64()}` });
    } catch (e) {
      // Share.open rejects when the user dismisses the sheet; only report real failures.
      if (!String(e?.message || e).toLowerCase().includes('cancel')) {
        Alert.alert('Could not share', 'Please check your internet connection and try again.');
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }} showsVerticalScrollIndicator={false}>
        <View style={[styles.cardFrame, { width: cardWidth }]}>
          <Image style={styles.cardImage} source={{ uri: cardimage }} accessibilityLabel={`${catname} greeting card`} />
        </View>

        <TouchableOpacity
          style={[styles.shareButton, sharing && styles.shareButtonBusy]}
          onPress={shareImage}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ busy: sharing }}>
          {sharing ? <ActivityIndicator color={Colors.onButton} /> : <Text style={styles.shareText}>Send eCard</Text>}
        </TouchableOpacity>

        <SectionHeader title="More Greetings" />
        <FlatList
          data={GREETING_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.rail}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.85}
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('GreetingCardListNew', { cardid: item._id, categoryname: item.name, name: item.name })
              }>
              <Image style={styles.categoryImage} source={{ uri: item.image }} />
              <Text style={styles.categoryName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default GreetingCardShare;

const makeStyles = (Colors) => {
  const tile = Colors.name === 'white' ? Colors.surfaceAlt : Colors.surface;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    cardFrame: {
      alignSelf: 'center',
      marginTop: Spacing.lg,
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: tile,
      shadowColor: Colors.black,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    cardImage: { width: '100%', aspectRatio: 4 / 5, resizeMode: 'cover' },
    shareButton: {
      alignSelf: 'center',
      marginTop: Spacing.xl,
      minHeight: MIN_TOUCH + 4,
      minWidth: 200,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shareButtonBusy: { opacity: 0.8 },
    shareText: { fontSize: TypeScale.subtitle, color: Colors.onButton, fontFamily: Fonts.bodyBold },
    rail: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    categoryCard: { width: 130, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: tile },
    categoryImage: { width: '100%', height: 130, resizeMode: 'cover' },
    categoryName: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      fontSize: TypeScale.small,
      textAlign: 'center',
      color: Colors.textPrimary,
      fontFamily: Fonts.bodySemiBold,
    },
  });
};
