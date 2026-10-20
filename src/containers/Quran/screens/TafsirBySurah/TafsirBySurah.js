import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {Colors} from '../../../../theme';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../../theme';
import {
  DuaListNumberBTSVGG,
  DuaForwardSVG,
  SearchSVG,
} from '../../../../assets/icons';
import { SURAH_NAMES } from '../../../Reciters/surahNames'; 

const TafsirBySurah = ({navigation}) => {
  const [surahs, setSurahs] = useState([]);
  const [visibleSurahs, setVisibleSurahs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);

  const language = useSelector(
    state => state.settings?.language || 'en',
  );

  const listRef = useRef();

  useEffect(() => {
    fetchSurahs();
  }, [language]);

  const fetchSurahs = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.quran.com/api/v4/chapters?language=${language}`,
      );

      const json = await res.json();

      const data = json.chapters || [];

      setSurahs(data);
      setVisibleSurahs(data);
    } catch (error) {
      console.log('Surah fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchFilterFunction = text => {
    const keyword = text.toLowerCase();

    const filtered = text
      ? surahs.filter(item => {
          return (
            item.name_simple?.toLowerCase().includes(keyword) ||
            item.name_arabic?.includes(text) ||
            item.translated_name?.name?.toLowerCase().includes(keyword)
          );
        })
      : surahs;

    setSearch(text);
    setVisibleSurahs(filtered);
    setNoMatch(filtered.length === 0);
  };

  const renderItem = ({item}) => {
    const surahInfo = SURAH_NAMES[item?.id];
    const arabicName = surahInfo?.arabic ?? '';
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('TafsirSurah', {
            surah: item,
          })
        }>
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <View
              style={{
                height: Platform.OS === 'ios' ? 15 : 15,
              }}
            />

            <View
              style={{
                left: Platform.OS === 'ios' ? 16 : 16,
              }}>
              <DuaListNumberBTSVGG />
            </View>

            <Text
              style={{
                bottom: Platform.OS === 'ios' ? 32 : 32,
                textAlign: 'center',
                fontWeight: '500',
                 left: Platform.OS === 'ios' ? 4 : 4,
                color: Colors.white,
                fontSize: 18,
                fontFamily:
                  Platform.OS === 'ios'
                    ? 'Poppins-Regular'
                    : 'Raleway',
              }}>
              {item.id}
            </Text>
          </View>

          <View style={styles.textBox}>
            <Text numberOfLines={1} style={styles.cardText}>
              {item.name_simple}
            </Text>
            <Text numberOfLines={1} style={styles.cardText1}>
              {item.verses_count} Ayahs
            </Text>
          </View>

          <View style={styles.textBox1}>
          <Text style={styles.arabic}>
                        {arabicName}
                      </Text>
          </View>

          <View style={styles.forwardBox}>
            <DuaForwardSVG />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer1}>
        <View style={{top: 13, left: 10}}>
          <SearchSVG />
        </View>

        <View style={{flex: 1, left: 15}}>
          <TextInput
            style={styles.searchInput1}
            placeholder="Search Surah"
            placeholderTextColor={Colors.white}
            value={search}
            onChangeText={searchFilterFunction}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.wasilnewthemecolor}
          style={{marginTop: 40}}
          
        />
      ) : noMatch ? (
        <Text style={styles.noMatch}>No Match Found</Text>
      ) : (
        <FlashList
          ref={listRef}
          data={visibleSurahs}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 40,
          }}
        />
      )}
    </View>
  );
};

export default TafsirBySurah;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.intermediate1,
  },

  searchContainer1: {
    flexDirection: 'row',
    width: '95%',
    height: 50,
    borderColor: Colors.bordercolor1,
    backgroundColor: Colors.intermediate1,
    borderWidth: 0.8,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
  },

  searchInput1: {
    paddingLeft: 1,
    top: Platform.OS === 'ios' ? 16 : 1,
    fontSize: 13,
    color: Colors.white,
    fontFamily: 'NunitoSans-SemiBold',
  },

  noMatch: {
    marginTop: 40,
    fontSize: 16,
    alignSelf: 'center',
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },

  card: {
     flexDirection: 'row',
     width: '95%',
     height: 70,
     borderWidth:1,
     marginTop:10,
     borderColor: COLORS.lightSlateGray,
     borderWidth: 1,
     marginTop: 10,
     borderRadius: 10,
     alignSelf: 'center',
   },

  iconBox: {
    flex: 0.45,
  },

  textBox: {
    flex: 1,
    justifyContent: 'center',
  },

  textBox1: {
    flex: 1,
    justifyContent: 'center',
  },

  forwardBox: {
    flex: 0.4,
    top: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  cardText: {
    color: Colors.white,
    fontSize: 16,
    top: Platform.OS === 'ios' ? 2 : 0,
    left:Platform.OS === 'ios' ? 5 : 7,
    fontFamily: Platform.OS === 'ios' ? 'Asul-Regular' : 'AsulRegular',
    textTransform: 'capitalize',
  },
  cardText1: {
    color: Colors.white,
    fontSize: 12,
    top: Platform.OS === 'ios' ? 2 : 0,
    left:Platform.OS === 'ios' ? 5 : 7,
    fontFamily: Platform.OS === 'ios' ? 'Asul-Regular' : 'AsulRegular',
    textTransform: 'capitalize',
  },

  arabic: {
    fontSize: Platform.OS === 'ios' ? 35 : 35,
    color: Colors.white,
    top:2,
    textAlign: 'center',
    fontFamily: "sura_names",
  },
});