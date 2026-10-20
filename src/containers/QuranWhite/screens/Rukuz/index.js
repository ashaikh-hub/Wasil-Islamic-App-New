import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {ScaledSheet} from 'react-native-size-matters';
import {getRukus} from '../../api';
import {COLORS} from '../../theme';
import AyahsListRuku from '../../components/AyahsListRuku';
import surahData from "../../data/chapters/ar.json"
import QuranSaveBox from '../../components/QuranSaveBox';
import { Colors } from '../../../../theme';
const Rukuz = ({navigation}) => {
  const [rukus, setRukus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRukus();
  }, []);

  const fetchRukus = async () => {
    try {
      const response = await getRukus();
      setRukus(response.rukus || []);
      console.log(response);
    } catch (error) {
      console.log('Error fetching rukus:', error);
    } finally {
      setLoading(false);
    }
  };

 const renderRukuItem = ({ item }) => {

  if (!item?.verseMapping) {
    return null;
  }

  const surahNumber = Object.keys(item.verseMapping)[0];
  const surahInfo = surahData?.[surahNumber];
  const surahEnglishName = surahInfo?.slug || '—';
  const surahArabicName = surahInfo?.transliteratedName || '—';

  return (
    <AyahsListRuku
      numberCounting={item.rukuNumber}
      leftTitleText={`Ruku ${item.rukuNumber}`}
      leftSubText={`Surah ${surahInfo?.slug ?? '—'}`}
      leftSubText2={`Verse ${item.firstVerseId}:${item.lastVerseId}`}
      rightTitleText={`الرُكوع (${item.rukuNumber})`}
      onPress={() =>
        navigation.navigate('SurahDetailPage', {
          rukuNumber: item.rukuNumber,
          from: 'ruku',
        })
      }
    />
  );
};

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.wasilnewthemecolorsecond} />
      </View>
    );
  }

  return (
 <View style={styles.safeAreaView}>
      <View style={styles.quranSaveBoxView}>
        <QuranSaveBox titleText={'Pin Ayah'} />
        <QuranSaveBox titleText={'Bookmarks'} />
        <QuranSaveBox titleText={'Favourite'} />
      </View>
       <View style={{flex: 1}}>
      <FlashList
  data={rukus}
  renderItem={renderRukuItem}
  keyExtractor={item => item.id.toString()}
  estimatedItemSize={90}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{paddingBottom: 40}}
/>
      </View>
    </View>
  );
};

export default Rukuz;
const styles = ScaledSheet.create({
   safeAreaView: {
    flex: 1,
    backgroundColor:COLORS.white,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

   quranSaveBoxView: {
    flexDirection: 'row',
    margin: '8@s',
    paddingLeft: '8@s',
  },
});
