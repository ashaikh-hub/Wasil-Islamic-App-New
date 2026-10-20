import {Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';

const BookmarkPageImage = ({
  iconCustomeStyle,
  Icon,
  onPressIcon = () => {},
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.rightImageViewStyle}
        hitSlop={{bottom: 5, top: 5, left: 5, right: 5}}
        onPress={onPressIcon}
        activeOpacity={0.7}>
        <Image style={[styles.iconStyle, iconCustomeStyle]} source={Icon} />
      </TouchableOpacity>
    </>
  );
};

export default BookmarkPageImage;

const styles = ScaledSheet.create({
  rightImageViewStyle: {marginLeft: '5@s', justifyContent: 'center'},
  iconStyle: {
    height: '25@s',
    width: '25@s',
    resizeMode: 'contain',
  },
});
