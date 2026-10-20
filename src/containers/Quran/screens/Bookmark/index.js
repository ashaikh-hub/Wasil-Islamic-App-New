import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import AyahViewComponent from '../../components/AyahViewComponent';
import EmptyViewBook from '../../components/EmptyViewBook';
import TopRowComponent from '../../components/TopRowComponent';
import {getStorageItem, setStorageItem} from '../../mmkvStorage/storeData';
import {COLORS} from '../../theme';
import {SIZES} from '../../theme/Sizes';
import Header from '../../components/Header';
import { Colors } from '../../../../theme';

const Bookmark = ({navigation, route}) => {
  
  const [isBookmark, setBookmark] = useState([]);
  const [isPlay, setIsPlay] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getBookmarkList();
    }, []),
  );
  const getBookmarkList = () => {
    const bookmarksList = getStorageItem('bookmark');
    setBookmark(bookmarksList);
  };
  const removeBookmark = item => {
    const updatedBookmark = isBookmark.filter(
      val => val?.BookmarkAyahItem.id !== item?.BookmarkAyahItem.id,
    );
    setBookmark(updatedBookmark);
    setStorageItem('bookmark', updatedBookmark);
  };
  const onClickPlayIcon = item => {
    navigation.navigate('SurahDetailPage', {
       selectedAyahItems: item?.BookmarkAyahItem,
      selectedSurahItems: item?.BookmarkSurahItem,
      fromBookmarkAyah: true,
      ayahKeyFromBookmark: item?.BookmarkAyahItem?.verseKey,
      fromjuz: item?.fromjuz,
      from: item?.from,
      rukuNumber: item?.rukuNumber,
      fromqc: item?.fromqc,
      surahNumber: item?.surahNumber,
      headersurahname: item?.headersurahname,
    });
  };

  const shareMessage = async item => {
    const Ayah = item?.textUthmani;

    const transliteration = item?.words
      ?.map(item => (item?.transliteration?.text || '').replace(/null/g, ''))
      .join(' ');

    const translations = item?.translations[0]?.text;

    try {
      const message = `Ayah: ${Ayah} \nTransliteration: ${transliteration} \nTranslations: ${translations}`;
      const options = {
        title: 'Quran',
        message: message,
      };
      const result = await Share.open(options);
      console.log(result);
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };
  const renderItem = ({item, index}) => {
    const caption = item?.BookmarkAyahItem?.translations[0]?.resourceName;
    const captionTwo = item?.BookmarkAyahItem?.translations[0]?.text;

    const pinColor = item == isPlay ? COLORS.SlateYellow : COLORS.gray;
    return (
      <View>
        <AyahViewComponent ayahItem={item?.BookmarkAyahItem} index={index} />
         <TopRowComponent
          surahDetail={item?.BookmarkSurahItem}
          onPressPlayIcon={() => {
            onClickPlayIcon(item);
          }}
          onPressBookmarkIcon={() => {
            removeBookmark(item);
          }}
          saveBookmark={true}
          isBookIcon={true}
          onPressBookIcon={() => {
            navigation?.navigate('AddTafseer', {
              verseKey: item?.BookmarkAyahItem?.verseKey,
            });
          }}
          onPresShareIcon={() => {
            shareMessage(item?.BookmarkAyahItem);
          }}
          index={index}
          item={item?.BookmarkAyahItem}
          fromBookmark={true}
        />
      </View>
    );
  };
  return (
    <View style={styles.safeAreaView}>
      <Header
        title={'Bookmark'}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        onPressRightIcon={() => {}}
        rightIcon={false}
      />
      
      <View style={{flex: 1}}>
        <FlatList
          data={isBookmark}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View style={styles.emptyViewStyle}>
              <EmptyViewBook />
            </View>
          }
        />
      </View>
    </View>
  );
};

export default Bookmark;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.intermediate1,
  },
  emptyViewStyle: {marginTop: SIZES.height / 3},
});
