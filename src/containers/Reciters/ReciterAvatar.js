import React from 'react';
import { View, Image, Text } from 'react-native';
import { useTheme, Fonts } from '../../theme';

const initials = (name = '') =>
  name
    .replace(/[`'’]/g, '')
    .split(/[\s-]+/)
    .filter((w) => w && !['al', 'as', 'ar', 'ash', 'abd', 'abdul', 'abdur'].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

// Round reciter photo, or their initials when no photo is bundled.
export default function ReciterAvatar({ reciter, size = 96 }) {
  const { Colors } = useTheme();
  const style = { width: size, height: size, borderRadius: size / 2 };
  if (reciter?.image) return <Image source={reciter.image} style={[style, { backgroundColor: '#F2F0F5' }]} />;
  return (
    <View style={[style, { alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.button }]}>
      <Text style={{ fontSize: size * 0.34, color: Colors.onButton, fontFamily: Fonts.heading }}>{initials(reciter?.name)}</Text>
    </View>
  );
}
