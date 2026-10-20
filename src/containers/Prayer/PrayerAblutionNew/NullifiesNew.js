import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
} from 'react-native';
import { Colors } from '../../../theme';

const headerImage = {
  uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1720698320/prayertimes/nullifies.png',
};

const nullifiesList = [
  'Passing stool.',
  'Passing urine.',
  'Passing gas or any substance emitted from the front or back private parts invalidates the ablution.',
  'If blood or pus is discharged.',
  'Vomiting a mouthful.',
  'Sleeping.',
  'Becoming unconscious or intoxicated.',
  'Laughing loudly during Salah (prayer).',
  'Ejaculation or intercourse, which necessitates a complete ritual bath (ghusl) to regain ritual purity.',
];

const NullifiesNew = () => {
  return (
    <View style={styles.container}>
    <StatusBar backgroundColor={Colors.intermediate1}/>
      <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerWrapper}>
            <Image source={headerImage} style={styles.headerImage} />
          </View>

        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            Factors that break the Wudhu (ablution) are as follows:
          </Text>

          {nullifiesList.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default NullifiesNew;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.intermediate1
  },
  headerWrapper: {
    height: 220,
    bottom:38
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode:"contain"
  },

  contentWrapper: {
    bottom:50,
    paddingLeft: 20,
    paddingRight:20,
    paddingBottom:20
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins-Light',
    color: Colors.white,
    marginBottom: 16,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 0.7,
    borderBottomColor: Colors.secondary1,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary1,
    marginTop: 6,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 22,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
});

