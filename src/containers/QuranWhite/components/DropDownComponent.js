import React from 'react';
import {Image, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, IMAGES} from '../theme';

const DropDownComponent = ({
  data = {},
  search = false,
  maxHeight = 200,
  labelField = '',
  valueField = '',
  placeholderText = '',
  searchPlaceholder = 'Search...',
  onChange = () => {},
  value = '',
  customeRightIcon = null,
  customeDropDownRenderItem = null,
}) => {
  const dropdownRenderItem = item => {
    return (
      <>
        {!customeDropDownRenderItem ? (
          <View style={styles.dropdownItemStyle}>
            <Text style={styles.titleText}>{item?.name}</Text>
            {item == value && <View></View>}
          </View>
        ) : (
          customeDropDownRenderItem
        )}
      </>
    );
  };
  return (
    <View>
      <Dropdown
        style={styles.dropdownStyle}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={search}
        maxHeight={maxHeight}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholderText}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onChange={onChange}
        renderRightIcon={() =>
          !customeRightIcon ? (
            <View>
              <Image
                source={IMAGES.dropdownArrowIcon}
                style={styles.dropdownIcon}
              />
            </View>
          ) : (
            customeRightIcon
          )
        }
        renderItem={dropdownRenderItem}
      />
    </View>
  );
};
export default DropDownComponent;

const styles = ScaledSheet.create({
  dropdownStyle: {
    width: '100%',
    height: '42@s',
    paddingHorizontal: '15@s',
    borderRadius: '6@s',
    borderColor: COLORS.secondGray,
    borderWidth: 1.3,
    backgroundColor: COLORS.white,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: COLORS.black,
  },
  inputSearchStyle: {
    height: '32@s',
    fontSize: 14,
    color: COLORS.black,
  },
  iconStyle: {
    width: '20@s',
    height: '20@s',
  },
  dropdownIcon: {
    height: '24@s',
    width: '24@s',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  dropdownItemStyle: {
    padding: '12@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {color: COLORS.black},
});
