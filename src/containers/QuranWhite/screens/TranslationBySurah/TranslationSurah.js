import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  WasilTranslationWorldSvg
} from '../../../../assets/icons';

const TranslationSurah = ({route}) => {
  const {surah} = route.params;
  const [translationText, setTranslationText] = useState('');
  const translationFontSize = useSelector(state => state.services.translationFontSize,);
  const translationId = useSelector(
    state => state.services.translationList || 131,
  );
  

  const [loading, setLoading] = useState(true);
  const [translator, setTranslator] = useState(null);


  useEffect(() => {
    loadData();
  }, [translationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?translations=${translationId}&per_page=300`,
      );
       const json = await res.json();
       const verses = json.verses || [];
       const translation = verses
        .map(v => v.translations?.[0]?.text || '')
        .join(' ');

        setTranslationText(translation);

      const translatorResponse = await fetch(
        'https://api.quran.com/api/v4/resources/translations',
      );

      const translatorJson = await translatorResponse.json();

      const selectedTranslator = translatorJson.translations.find(
        item => item.id === Number(translationId),
      );

      setTranslator(selectedTranslator);
    } catch (error) {
  console.log('Quran Error Message:', error?.message);
  console.log('Quran Error String:', String(error));
}finally {
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
      <View style={styles.headerCard}>
        <View style={{flex: 1}}>
          <Text style={styles.surahName}>
            {surah.name_simple}
          </Text>
          <Text style={styles.meaning}>
            {surah.translated_name?.name}
          </Text>
          <Text style={styles.info}>
            Revealed: {surah.revelation_place}
          </Text>
          <Text style={styles.info}>
            Total Ayahs: {surah.verses_count}
          </Text>
        </View>
        <View>
         <Text style={styles.translatorName}>
  {translator?.name?.length > 20
    ? `${translator.name.substring(0, 20)}...`
    : translator?.name}
</Text>
          <View style={styles.languageRow}>
            <WasilTranslationWorldSvg />
            <Text style={styles.language}>
              {translator?.language_name}
            </Text>
          </View>
          
        </View>
      </View>
      <View style={styles.translationCard}>
<Text
  style={[
    styles.translation,
    {
      fontSize: translationFontSize,
    },
  ]}>
  {translationText}
</Text>
      </View>
    </ScrollView>
  );
};

export default TranslationSurah;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#C8A8FF',
    borderRadius: 15,
    backgroundColor: '#FCFAFF',
  },

  surahName: {
    fontSize: 18,
    color: '#6A40C9',
    fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
  },

  meaning: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular"
  },

  info: {
    color: '#666',
    fontSize: 12,
    textTransform:"capitalize",
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular"
  },

  translatorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    textAlign: 'right',
    fontFamily:Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular"
    
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

  translationCard: {
    marginTop: 18,
    padding: 18,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
  },

  verseNumber: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 5,
    color: '#222',
  },

  translation: {
    color: '#222',
    lineHeight: 25,
    fontFamily: Platform.OS === 'ios' ? 'Asul-Regular' : 'AsulRegular',
  },
});

