import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {IMAGES} from '../theme';
import {
WasilNewFavouriteUnFillSvg,
WasilNewFavouriteFillSvg
} from '../../../assets/icons';

const FavoriteView = ({
  favoriteIconCustomStyle,
  onPressFavoriteIcon = () => {},

  isFavorite,
}) => {
  return (
    <TouchableOpacity
      hitSlop={{bottom: 35, top: 15, left: 15, right: 15}}
      onPress={onPressFavoriteIcon}
      activeOpacity={0.7}>
      {isFavorite ? (
  <WasilNewFavouriteFillSvg
    style={[styles.favoriteIconStyle, favoriteIconCustomStyle]}
  />
) : (
  <WasilNewFavouriteUnFillSvg
    style={[styles.favoriteIconStyle, favoriteIconCustomStyle]}
  />
)}
    </TouchableOpacity>
  );
};

export default FavoriteView;

const styles = ScaledSheet.create({
  favoriteIconStyle: {
    height: '22@s',
    width: '24@s',
    resizeMode: 'contain',
    bottom:0,
    right:20
  },
});
