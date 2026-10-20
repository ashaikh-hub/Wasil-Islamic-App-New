
import React, {useEffect} from 'react';
import {FlatList, View,BackHandler} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import AyahsList from '../../components/AyahsList';
import EmptyView from '../../components/EmptyView';
import Header from '../../components/Header';
import {COLORS} from '../../theme';
import {SIZES} from '../../theme/Sizes';

const PageList = ({navigation, route}) => {
  const pagesList = useSelector(state => state.services.pagesList);

  const onPressSurahItem = item => {
    navigation.navigate('SurahFullView', {selectedPageItem: item?.id});
  };

  useEffect(() => {}, []);

    useEffect(() => {
      const backAction = () => {
        navigation.navigate('QuranMainDashboard');
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.ayahsListView}>
        <AyahsList
          numberCounting={item?.id}
          leftTitleText={item?.pageNumber}
          isFavoriteIconShow={false}
          isShowRightTextView={false}
          isShowLeftSubText={false}
          onPress={() => {
            onPressSurahItem(item);
          }}
        />
      </View>
    );
  };
  return (
    <View style={styles.safeAreaView}>
      <Header
        title={`Page By Page`}
        onPressLeftIcon={() => {
          navigation.navigate('QuranMainDashboard');
        }}
      />
      <View style={{flex: 1}}>
        <FlatList
          data={pagesList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={80}
          estimatedListSize={{
            height: SIZES.height,
            width: SIZES.width,
          }}
          getItemType={({item}) => {
            return item;
          }}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyViewStyle}>
              <EmptyView />
            </View>
          }
        />
      </View>
    </View>
  );
};

export default PageList;

const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
  },
  quranSaveBoxView: {
    flexDirection: 'row',
    margin: '8@s',
    paddingLeft: '8@s',
  },
  ayahsListView: {backgroundColor: COLORS.white},
  emptyViewStyle: {marginTop: SIZES.height / 3},
});
