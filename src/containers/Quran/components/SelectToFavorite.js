import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const SelectToFavorite = ({iconCustomeStyle, Icon, onPressIcon = () => {}}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.rightImageViewStyle}
        hitSlop={{bottom: 15, top: 15, left: 15, right: 15}}
        onPress={onPressIcon}
        activeOpacity={0.7}>
        <Image style={[styles.iconStyle, iconCustomeStyle]} source={Icon} />
      </TouchableOpacity>
    </>
  );
};

export default SelectToFavorite;

const styles = ScaledSheet.create({
  rightImageViewStyle: {marginLeft: '5@s'},
  iconStyle: {
    height: '25@s',
    width: '25@s',
    resizeMode: 'contain',
  },
});
