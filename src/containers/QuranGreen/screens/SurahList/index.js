import {useFocusEffect} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import AyahsList from '../../components/AyahsList';
import EmptyView from '../../components/EmptyView';
import QuranSaveBox from '../../components/QuranSaveBox';
import {getStorageItem, setStorageItem} from '../../mmkvStorage/storeData';
import {setSelectedSurahItem} from '../../redux/reduxToolkit/store/servicesSlice';
import {COLORS, IMAGES} from '../../theme';
import { SURAH_NAMES } from '../../../Reciters/surahNames'; 
import {SIZES} from '../../theme/Sizes';
import { Colors } from '../../../../theme';

const SurahList = ({navigation, route}) => {
  const chapterDetail = useSelector(state => state.services.chapterDetail);
  const [favorites, setFavorites] = useState([]);
  const [isPinAyah, setIsPinAyah] = useState([]);
  const [surahList, setSurahList] = useState(chapterDetail);
 

  const dispatch = useDispatch();
  const scrollingRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      setSurahList(chapterDetail);
      getPinAyahItem();
      getFavoriteList();
    }, []),
  );

  useEffect(() => {
    if (route?.params?.selectedSurahItems && !isEmpty(chapterDetail)) {
      setTimeout(() => {
        const index = chapterDetail?.findIndex(
          item => item?.id === route?.params?.selectedSurahItems.id,
        );
        if (index !== -1) {
          scrollingRef?.current?.scrollToIndex({index, animated: true});
        }
      }, 1000);
    }
  }, [route?.params?.selectedSurahItems, chapterDetail]);

  const getFavoriteList = () => {
    const favoritesList = getStorageItem('favorites');
    setFavorites(favoritesList || []);
  };
  const getPinAyahItem = () => {
    const pinAyah = getStorageItem('pin');
    setIsPinAyah(pinAyah);
  };

  const toggleFavorite = item => {
    let updatedFavorites = [];
    if (favorites.some(fav => fav.id === item.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      updatedFavorites = [item, ...favorites];
    }
    setFavorites(updatedFavorites);
    setStorageItem('favorites', updatedFavorites);
  };


  const chapterDataRenderItem = ({item, index}) => {
    const isFavorite = favorites.some(fav => fav?.id === item?.id);
     const surahInfo = SURAH_NAMES[item?.id];
     const arabicName = surahInfo?.arabic ?? '';

    return (
      <View style={styles.ayahsListView}>
        <AyahsList
          numberCounting={item?.id}
          isFavorite={isFavorite}
          leftTitleText={item?.transliteratedName}
          leftSubText={`${item?.versesCount} Ayahs`}
          rightTitleText={arabicName}
          favoriteIconCustomStyle={{
            tintColor: !item?.isFavorite ? COLORS.lightSlateGray : null,
          }}
          backgroundImage={
            item?.id == isPinAyah?.AyahItem?.chapterId
              ? IMAGES.selectedBackgroundImg
              : IMAGES.unSelectBackGroundImg
          }
          onPress={() => {
            navigation.navigate('SurahDetailPage', {
              selectedSurahItems: item,
            });
            dispatch(setSelectedSurahItem(item));
          }}
          onPressFavoriteIcon={() => {
            toggleFavorite(item);
          }}
          item={item}
        />
      </View>
    );
  };

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.quranSaveBoxView}>
        <QuranSaveBox titleText={'Pin Ayah'} />
        <QuranSaveBox titleText={'Bookmarks'} />
        <QuranSaveBox titleText={'Favourite'} />
      </View>
      <FlashList
        ref={scrollingRef}
        data={chapterDetail}
        renderItem={chapterDataRenderItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={80}
        estimatedListSize={{
          height: SIZES.height,
          width: SIZES.width,
        }}
        keyExtractor={item => item.id}
        getItemType={({item}) => {
          return item;
        }}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 100));
          wait.then(() => {
            scrollingRef.current.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        ListEmptyComponent={
          <View style={styles.emptyViewStyle}>
            <EmptyView />
          </View>
        }
        extraData={{favorites, isPinAyah, surahList}}
      />
    </View>
  );
};

export default SurahList;
const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:Colors.wasilgreenthemecolor,
  },
  quranSaveBoxView: {
    flexDirection: 'row',
    margin: '8@s',
    paddingLeft: '8@s',
  },
  ayahsListView: {
    backgroundColor:Colors.wasilgreenthemecolor,
  },
  emptyViewStyle: {marginTop: SIZES.height / 3},
});
