import {FlashList} from '@shopify/flash-list';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import AyahsListJuz from '../../components/AyahsListJuz';
import EmptyView from '../../components/EmptyView';
import QuranSaveBox from '../../components/QuranSaveBox';
import {COLORS} from '../../theme';
import {SIZES} from '../../theme/Sizes';
import { Colors } from '../../../../theme';

const JuzList = ({navigation, route}) => {
  const juzList = useSelector(state => state.services.juzList);
  const onPressJuzItem = item => {
    navigation.navigate('SurahDetailPage', {
      selectedSurahItems: item,
      fromjuz: true,
    });
  };

  const renderItem = ({item}) => {
  
    return (
      <View style={styles.ayahsListView}>
        <AyahsListJuz
          numberCounting={item?.id}
          leftTitleText={item?.juzNumber}
          rightTitleText={item?.arabic}
          leftSubText={item?.verses}
          isFavoriteIconShow={false}
          isShowRightSubText={false}
          onPress={() => {
            onPressJuzItem(item);
          }}
        />
      </View>
    );
  };
  
  useEffect(() => {}, []);

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.quranSaveBoxView}>
        <QuranSaveBox titleText={'Pin Ayah'} />

        <QuranSaveBox titleText={'Bookmarks'} />

        <QuranSaveBox titleText={'Favourite'} />
      </View>
      <View style={{flex: 1}}>
        <FlashList
          data={juzList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          estimatedItemSize={80}
          estimatedListSize={{
            height: SIZES.height,
            width: SIZES.width,
          }}
          getItemType={({item}) => {
            return item;
          }}
          ListEmptyComponent={
            <View style={styles.emptyViewStyle}>
              <EmptyView />
            </View>
          }
        />
      </View>
      <View style={{height:30}}></View>
    </View>
  );
};


export default JuzList;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
      backgroundColor:Colors.intermediate1
  },
  quranSaveBoxView: {
    flexDirection: 'row',
    margin: '8@s',
    paddingLeft: '8@s',
  },
  ayahsListView: {    backgroundColor:Colors.intermediate1},
  emptyViewStyle: {marginTop: SIZES.height / 3},
});
