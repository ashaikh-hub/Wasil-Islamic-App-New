import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Platform
} from 'react-native';
import { Colors } from '../../../theme';

const headerImage = {
  uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1720698314/prayertimes/introwudhu.png',
};

const IntoWudhuNew = () => {
  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <Image source={headerImage} style={styles.headerImage} />

          <View style={styles.headerOverlay}>
            <Text style={styles.headerText}>
              "Wudhu," also known as ablution, holds significant importance in
              Islam as a ritual purification process that precedes various acts
              of worship. The term "Wudhu" is derived from the Arabic root word
              "wadhaa" (وضاءة), meaning to clean and beautify.
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentWrapper}>
          <Text style={styles.paragraph}>
            Wudhu is a practice that focuses on cleaning various areas of the
            body. Taharah or cleanliness has an important place in Islam.
          </Text>

          {/* Quran Verse Card */}
          <View style={styles.verseCard}>
            <Text style={styles.verseTitle}>The Holy Quran says:</Text>

            <Text style={styles.arabicText}>
              إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ
            </Text>

            <Text style={styles.verseReference}>(البقرہ) 222</Text>

            <Text style={styles.translation}>
              "Verily, Allah loves those who repent and those who purify
              themselves."
            </Text>
          </View>

          {/* Hadith */}
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Hadith: </Text>
            The Holy Prophet ﷺ said: "No salaat is acceptable without
            purification, and no sadaqah (charity) is acceptable from wealth
            earned by unfair means." (Sahih Muslim 224)
          </Text>

          <Text style={styles.paragraph1}>
            In Islam, it is encouraged to remain in a state of Wudhu ablution at all times for spiritual and physical purity. But there are specific actions for which performing Wudhu ablution is obligatory before engaging in them:
          </Text>

          <Text style={styles.paragraph2}>
            Performing Wudhu is not only a mandatory preparation for prayer but is also recommended before reading the Quran, entering a mosque, and undertaking certain religious duties. The meticulous observance of Wudhu reflects the adherence to Islamic principles of cleanliness, discipline, and mindfulness in daily life.
          </Text>

          <Text style={styles.paragraph3}>
            In summary, Wudhu is a fundamental ritual in Islam serving as a symbolic purification process that prepares individuals for engaging in acts of worship and fostering a sense of spiritual connection with Allah. It embodies the values of cleanliness, humility, and devotion inherent in Islamic teachings.
          </Text>
        </View>
        <View style={{height:40}}></View>
      </ScrollView>
    </View>
  );
};
export default IntoWudhuNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

 headerWrapper: { height: 300, }, 
 headerImage: { width: '100%', height: '100%', }, 
 headerOverlay: { position: 'absolute', marginHorizontal: 10, padding: 15, borderRadius: 16,}, 
 headerText: { top:35, width:"11%", fontSize: 13, color: Colors.black, fontWeight: '600', fontFamily:"Poppins-Light" },

  contentWrapper: {
    padding: 16,
  },
  paragraph: {
    left:7,
    width:"90%",
    fontSize: 13,
    alignSelf:"center",
    color: Colors.black,
    fontFamily: 'Poppins-Light',
  },
  paragraph1: {
    top:20,
    fontSize: 13,
    alignSelf:"center",
    color: Colors.black,
    fontFamily: 'Poppins-Light',
  },
   paragraph2: {
    top:30,
    fontSize: 13,
    alignSelf:"center",
    color: Colors.black,
    fontFamily: 'Poppins-Light',
  },
   paragraph3: {
    top:40,
    left:5,
    fontSize: 13,
    alignSelf:"center",
    color: Colors.black,
    fontFamily: 'Poppins-Light',
  },
  bold: {
    fontFamily: 'Poppins-SemiBold',
  },

  verseCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  verseTitle: {
    color:Colors.secondary,
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    marginBottom: 2,
  },
  arabicText: {
    width:300,
    height:50,
    fontSize: 25,
    marginBottom: 5,
    color:Colors.wasilnewthemecolorsecond,
    fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',
  },
  verseReference: {
    fontSize: 12,
    marginBottom: 8,
    color: Colors.gray,
    fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',
  },
  translation: {
    color:Colors.secondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Poppins-Light',
  },
});
