import React from 'react';
import {Modal, Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import Button from './Button';

const ModalComponent = ({
  title,
  subtitle,
  visible = false,
  cancelButtonText = '',
  confirmButtonText = '',
  onClickClose = () => {},
  onClickConfirm = () => {},
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClickClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.pinTitleText}>{title}</Text>
          </View>
          <View style={styles.subTextView}>
            <Text style={styles.pinsubText}>{subtitle}</Text>
          </View>

          <View style={styles.buttonMainView}>
            <View style={styles.buttonViewStyle}>
              <Button
                title={cancelButtonText}
                onPress={() => {
                  onClickClose();
                }}
                textColor={'#FFFFFF'}
                style={[styles.buttonStyle, {backgroundColor: COLORS.yellow}]}
                labelStyle={styles.pinButtonlabelStyle}
              />
            </View>

            <View style={styles.buttonViewStyle}>
              <Button
                title={confirmButtonText}
                onPress={() => {
                  onClickConfirm();
                }}
                textColor={'#FFFFFF'}
                style={[
                  styles.buttonStyle,
                  {backgroundColor: COLORS.wasilnewthemecolorsecondBlue},
                ]}
                labelStyle={styles.pinButtonlabelStyle}
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
    alignItems: 'center',
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
  subTextView: {marginVertical: '8@s', width: '60%'},
  pinButtonlabelStyle: {
    ...FONTSTYLE(FONTS.poppinsMedium).inputBody,
    color: '#FFFFFF',
  },
  pinTitleText: {
    ...FONTSTYLE(FONTS.poppinsMedium).headerText,
    color: COLORS.wasilnewthemecolorsecondGray,
    textAlign: 'center',
  },
  pinsubText: {
    ...FONTSTYLE(FONTS.poppinsLight).inputBody,
    color: COLORS.wasilnewthemecolorsecondGray,
    textAlign: 'center',
  },
});

export default ModalComponent;
