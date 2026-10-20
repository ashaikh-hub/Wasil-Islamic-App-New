import React, {useState} from 'react';
import {Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {getStorageItem, setStorageItem} from '../mmkvStorage/storeData';
import {COLORS, FONTS, FONTSTYLE} from '../theme';
import ReciterList from './ReciterList';

const ReciterModal = ({
  visible = false,
  onClose = () => {},
  clickOnReciter = () => {},
  data,
}) => {
  const reciters = getStorageItem('reciters');
  const [selectReciter, setSelectReciter] = useState(reciters);
  const onClickReciter = item => {
    setSelectReciter(item);
    setStorageItem('reciters', item);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={clickOnReciter}>
      <TouchableOpacity style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.lableTitleText}>{'Select Reciter'}</Text>
          </View>
          <ScrollView
            horizontal
            style={styles.scrollView}
            contentContainerStyle={styles.reciterListContainer}
            showsHorizontalScrollIndicator={false}>
            {data?.map((item, index) => (
              <View>
                <ReciterList
                  key={index}
                  subText={item?.name}
                  onPress={() => {
                    onClickReciter(item);
                    clickOnReciter(item);
                  }}
                  item={item}
                  isSelected={selectReciter}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: '25%',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '12@vs',
    paddingVertical: '15@vs',
    maxHeight: '80%',
    overflow: 'hidden',
    alignItems: 'center',
  },
  scrollView: {
    right:5,
    width: '100%',
    marginTop: '10@vs',
  },
  reciterListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  lableTitleText: {
    ...FONTSTYLE(FONTS.poppinsRegular).headerText,
    color: COLORS.slateBlack,
    textAlign: 'center',
  },
});

export default ReciterModal;
