import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors } from '../../../theme';

const { width } = Dimensions.get('window');

const TayammumScreen = () => {
  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1720698310/prayertimes/tayyamum.png',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.description}>
            Tayammum is a significant ritual in Islam, serving as an alternative
            to wudu (ablution) when water is not available or its use is
            prohibited. This guide provides detailed instructions on when and
            how to perform tayammum.
          </Text>

          {/* Section */}
          <Text style={styles.sectionTitle}>Introduction to Tayammum:</Text>

          <Bullet
            text="Tayammum is an alternative of wudu when water is unavailable or its use poses a risk. It is a vital practice for maintaining ritual purity in Islam."
          />
          <Bullet
            text="Tayammum allows Muslims to fulfill their religious duties without compromising on purity."
          />

          {/* Section */}
          <Text style={styles.sectionTitle}>Absence of Water</Text>
          <Bullet text="Tayammum is allowed when acceptable water is not available within a one-mile radius, or when there is no means of obtaining water." />

          {/* Section */}
          <Text style={styles.sectionTitle}>Fear of Danger</Text>
          <Bullet text="When there is a legitimate fear of an enemy or dangerous animals near the water source, tayammum becomes permissible." />

          {/* Section */}
          <Text style={styles.sectionTitle}>Risk to Health</Text>
          <Bullet text="If using water for wudu would pose a risk to one's health, tayammum can be performed as an alternative." />
        </View>
      </ScrollView>
    </View>
  );
};

const Bullet = ({ text }) => (
  <View style={styles.bulletRow}>
    <View style={styles.bullet} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

export default TayammumScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginLeft: 10,
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },

  image: {
    width: width,
    height: width * 0.35,
  },

  content: {
    padding: 16,
  },

  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'Poppins-Light',
  },

  sectionTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E1B6B',
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#673AB7',
    marginTop: 6,
    marginRight: 10,
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    fontFamily: 'Poppins-Light',
  },
});



