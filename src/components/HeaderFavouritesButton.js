import React from 'react';
import { TouchableOpacity } from 'react-native';
import useThemeIcons from './useThemeIcons';

// Header-right heart that opens a favourites screen; filled when there is at least one favourite.
export default function HeaderFavouritesButton({ onPress, filled, label = 'Favourites' }) {
  const { HeartFilled, HeartOutline } = useThemeIcons();
  const Icon = filled ? HeartFilled : HeartOutline;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Icon />
    </TouchableOpacity>
  );
}
