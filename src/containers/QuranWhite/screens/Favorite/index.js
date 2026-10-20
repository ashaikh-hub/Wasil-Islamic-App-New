import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AyahsList from '../../components/AyahsList';
import EmptyViewFav from '../../components/EmptyViewFav';
import ar from '../../data/chapters/ar.json';
import {getStorageItem, setStorageItem} from '../../mmkvStorage/storeData';
import {COLORS} from '../../theme';
import {SIZES} from '../../theme/Sizes';
import Header from '../../components/Header';
import { SURAH_NAMES } from '../../../Reciters/surahNames'; 
const Favorite = ({navigation}) => {
  const [favorites, setFavorites] = useState([]);
 

  useEffect(() => {
    getFavoriteList();
  }, []);

  const getFavoriteList = () => {
    const favoritesList = getStorageItem('favorites');
    setFavorites(favoritesList);
  };
  const removeFavorite = item => {
    const updatedFavorites = favorites.filter(fav => fav.id !== item.id);
    setFavorites(updatedFavorites);
    setStorageItem('favorites', updatedFavorites);
  };
const renderItem = ({item, index}) => {
  const surahInfo = SURAH_NAMES[item?.id];
  const arabicName = surahInfo?.arabic ?? '';

  return (
    <View style={styles.ayahsListView}>
      <AyahsList
        numberCounting={item?.id}
        leftTitleText={item?.transliteratedName}
        leftSubText={`${item?.versesCount} Ayahs`}
        rightTitleText={arabicName}
        isFavorite={true}
        onPressFavoriteIcon={() => removeFavorite(item)}
        onPress={() => {
          navigation.navigate('SurahDetailPage', {
            selectedSurahItems: item,
          });
        }}
        item={item}
      />
    </View>
  );
};
  
  return (
    <View style={styles.safeAreaView}>
      <Header
        title="Favourites"
        onPressLeftIcon={() => {
          navigation?.goBack();
        }}
        rightIcon={false}
      />
      <View style={{flex: 1}}>
        <FlatList
          data={favorites}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyViewStyle}>
              <EmptyViewFav />
            </View>
          }
        />
      </View>
    </View>
  );
};

export default Favorite;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  ayahsListView: {
    backgroundColor: COLORS.white,
  },
  emptyViewStyle: {marginTop: SIZES.height / 3},
});
