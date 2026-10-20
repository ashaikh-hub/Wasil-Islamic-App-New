import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';

const HadithBookCard = ({ title, description, image, hadithbookname, name }) => {
  const navigation = useNavigation();
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => navigation.navigate('HadithBooksDetail', { hadithbookname, name })}
      accessibilityRole="button">
      {image ? <Image source={image} style={styles.image} resizeMode="contain" /> : null}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text numberOfLines={6} style={styles.desc}>
            {description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default HadithBookCard;

const makeStyles = (Colors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      gap: Spacing.lg,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      backgroundColor: Colors.name === 'white' ? Colors.surfaceAlt : Colors.surface,
    },
    image: { width: 100, height: 132 },
    content: { flex: 1, justifyContent: 'center' },
    title: { fontSize: TypeScale.subtitle + 1, color: Colors.heading, fontFamily: Fonts.heading },
    desc: { marginTop: Spacing.xs, fontSize: TypeScale.small + 1, lineHeight: 18, color: Colors.textSecondary, fontFamily: Fonts.body },
  });
