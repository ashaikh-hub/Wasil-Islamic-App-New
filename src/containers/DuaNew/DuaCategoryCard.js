import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';

// Category tile: server-provided SVG artwork with the title on its left half.
const DuaCategoryCard = ({ item, onPress }) => {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} duas`}>
      {item.image ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SvgUri uri={item.image} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      ) : null}
      <Text numberOfLines={2} style={styles.title}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default DuaCategoryCard;

const makeStyles = (Colors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      aspectRatio: 1.6,
      borderRadius: Radius.lg,
      overflow: 'hidden',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
      backgroundColor: '#F2EEF8',
    },
    title: { width: '55%', fontSize: TypeScale.body + 1, lineHeight: 20, color: '#2B2540', fontFamily: Fonts.headingRegular },
  });
