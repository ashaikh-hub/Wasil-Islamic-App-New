import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useDispatch,useSelector} from 'react-redux';
import { Colors } from '../../../../theme';
import {getTafsirs} from '../../api';
import {
  setTafseerAuthor,
  setTafseerLanguage,
} from '../../redux/reduxToolkit/store/servicesSlice';

import {setStorageItem} from '../../mmkvStorage/storeData';
import {
  WasilTranslationWorldSvg
} from '../../../../assets/icons';
const TafsirSurah = ({route}) => {
  const {surah} = route.params;
  const {width} = useWindowDimensions();
 
  const translationFontSize = useSelector(
    state => state.services.translationFontSize,
  );

 const tafseerAuthor = useSelector(
  state => state.services.tafseerAuthor,
);

const tafsirId = tafseerAuthor?.id || 169;

  const tafseerLanguage = useSelector(
  state => state.services.tafseerLanguage,
);

const dispatch = useDispatch();
 const [selectLanguage, setSelectLanguage] = useState(tafseerLanguage);

  const [loading, setLoading] = useState(true);
  const [tafsirList, setTafsirList] = useState([]);
  const [resource, setResource] = useState(null);

 const initializeTafsir = async () => {
  try {
    // Already initialized
    if (tafseerAuthor?.id && tafseerLanguage?.language) {
      return;
    }

    const language = tafseerLanguage?.language || 'english';

    const tafseerAuthorData = await getTafsirs(language);

    const authors =
      tafseerAuthorData?.tafsirs?.filter(
        item => item.languageName === language,
      ) || [];

    if (authors.length > 0) {
      dispatch(setTafseerLanguage({
        id: 1,
        name: language,
        language,
      }));

      dispatch(setTafseerAuthor(authors[0]));

      setStorageItem('tafseerLanguage', {
        id: 1,
        name: language,
        language,
      });

      setStorageItem('tafseerAuthor', authors[0]);
    }
  } catch (e) {
    console.log('Initialize Tafsir Error', e);
  }
};
useEffect(() => {
  const init = async () => {
    await initializeTafsir();
    await loadTafsir();
  };

  init();
}, [surah.id, tafsirId]);
  const loadTafsir = async () => {
    try {
      setLoading(true);

      const responseforpage = await fetch(
        `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_chapter/${surah.id}`,
      );

      const jsonforpage = await responseforpage.json();
      const totalpage = jsonforpage.pagination.total_records;

      const response = await fetch(
        `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_chapter/${surah.id}?page=1&per_page=${totalpage}`,
      );

      const json = await response.json();
      console.log('Tafsir Response', json);
      setTafsirList(json.tafsirs || []);
      setResource(json.resource || null);
      console.log("Redux Author:", tafseerAuthor);
      console.log("Resource:", tafseerLanguage);
    } catch (e) {
      console.log('Tafsir Error', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7E57C2" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 30}}>
      {/* Header */}

      <View style={styles.headerCard}>
        <View style={{flex: 1}}>
          <Text style={styles.surahName}>
            {surah.name_simple}
          </Text>

          <Text style={styles.meaning}>
            {surah.translated_name?.name}
          </Text>

          <Text style={styles.info}>
            Revelation : {surah.revelation_place}
          </Text>

          <Text style={styles.info}>
            Verses : {surah.verses_count}
          </Text>
        </View>

       <View>
  <Text style={styles.translatorName}>
    {tafseerAuthor?.name || resource?.name || 'Tafsir'}
  </Text>
<View style={styles.languageRow}>
            <WasilTranslationWorldSvg />
            <Text style={styles.language}>
    {tafseerLanguage?.name ||
      tafseerLanguage?.language ||
      resource?.language_name ||
      'English'}
  </Text>
          </View>
  
</View>
      </View>

     {tafsirList.map(item => (

  <View style={styles.tafsirCard}>
    <Text style={styles.verseNumber}>
     {item.verse_key}
    </Text>
  <Text
    style={[
      styles.translation,
      {
        fontSize: translationFontSize,
      },
    ]}>
      {item.text.replace(/<[^>]*>/g, '')}
  </Text>
        </View>
))}
    </ScrollView>
  );
};

export default TafsirSurah;

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: Colors.white,
    padding: 15,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D8C8FF',
    backgroundColor: '#FCFAFF',
    marginBottom: 15,
  },

  surahName: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
    color: Colors.intermediate1,
  },

  meaning: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
  },

  info: {
    color: '#666',
    fontSize: 12,
    textTransform:"capitalize",
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular"
  },

  translatorName: {
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular",
    fontSize: 15,
    color: '#222',
    textAlign: 'right',
  },
 languageRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 4,
},
  language: {
    fontSize: 14,
    textTransform:"capitalize",
    color: '#666',
    alignSelf:"center",
    marginTop: 1,
    left:3
  },

  tafsirCard: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },

  verseNumber: {
  alignSelf: 'flex-start',
  paddingHorizontal: 10,
  paddingVertical: 5,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#D8C8FF',
  fontSize: 16,
  fontWeight: '700',
  textAlign: 'center',
  color: '#6A40C9',
  marginBottom: 12,
},
  translation: {
   color: '#222',
   lineHeight: 28,
   fontFamily: Platform.OS === 'ios' ? 'Asul-Regular' : 'AsulRegular',
  },
});