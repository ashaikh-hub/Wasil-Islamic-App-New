import React from 'react';
import {Modal, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import Button from './Button';

const SearchModalComponent = ({
  title,
  subtitle,
  visible = false,
  searchText = '',
  onChangeText = () => {},
  onClickSearch = () => {},
  onClickReturn = () => {},
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClickReturn}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.subTextView}>
            <Text style={styles.subText}>{subtitle}</Text>
          </View>
          <View>
            <TextInput
              label="Quran Search"
              value={searchText}
              mode="outlined"
              onChangeText={onChangeText}
              outlineColor={COLORS.paleGray}
              activeOutlineColor={COLORS.wasilnewthemecolorsecondBlue}
              style={{backgroundColor: COLORS.white}}
            />
          </View>
          <View style={styles.buttonMainView}>
            <View style={styles.buttonViewStyle}>
              <Button
                title="Search inside Quran"
                onPress={() => {
                  onClickSearch();
                }}
                textColor={COLORS.white}
                style={[styles.buttonStyle, {backgroundColor: COLORS.yellow}]}
                labelStyle={styles.searchButtonLabelStyle}
              />
            </View>

            <View style={styles.buttonViewStyle}>
              <Button
                title="Return"
                onPress={() => {
                  onClickReturn();
                }}
                textColor={COLORS.white}
                style={[
                  styles.buttonStyle,
                  {backgroundColor: COLORS.wasilnewthemecolorsecondBlue},
                ]}
                labelStyle={styles.searchButtonLabelStyle}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    width: '94%',
    backgroundColor: 'white',
    borderRadius: '12@vs',
    padding: '15@vs',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  buttonMainView: {
    marginHorizontal: '1@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10@s',
  },
  buttonViewStyle: {flex: 1, marginHorizontal: '3@s'},
  buttonStyle: {
    borderRadius: '40@s',
    height: '40@s',
  },
  searchButtonLabelStyle: {
    ...FONTSTYLE(FONTS.poppinsRegular).body,
    color: COLORS.white,
  },
  titleText: {
    ...FONTSTYLE(FONTS.poppinsMedium).inputs,
    color: COLORS.wasilnewthemecolorsecondGray,
  },
  subTextView: {marginVertical: '8@s'},
  subText: {
    ...FONTSTYLE(FONTS.poppinsRegular).smallText,
    color: COLORS.wasilnewthemecolorsecondGray,
  },
});

export default SearchModalComponent;
