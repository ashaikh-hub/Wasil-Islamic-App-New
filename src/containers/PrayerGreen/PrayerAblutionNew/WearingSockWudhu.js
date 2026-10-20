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

const imageOne = {
  uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1720698325/prayertimes/shoeone.png',
};

const imageTwo = {
  uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1720698305/prayertimes/shoetwo.png',
};

const WearingSockWudhu = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.wasilgreenthemecolor}/>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Image */}
        <Image source={imageOne} style={styles.headerImage} resizeMode="cover" />

        {/* Content */}
        <View style={styles.contentWrapper}>
          <Text style={styles.mainTitle}>
            Making Wudu While{'\n'}Wearing Socks or Shoes?
          </Text>

          <Text style={styles.paragraph}>
            Make ablution once without the Wudhu socks. After the ablution, you
            can put on the socks and follow the next steps for the next time you
            need to wash feet while making wudu.
          </Text>

          <Text style={styles.paragraph}>Wet your hands with water.</Text>

          <Text style={styles.paragraph}>
            Starting from the upper surface of the toes to the ankles, move the
            hand along the khuff (socks for ablution).
          </Text>

          <Text style={styles.paragraph}>
            Use the right hand once for the right socks and left hand once for
            the left socks.
          </Text>

          {/* Conditions */}
          <Text style={styles.sectionTitle}>
            Conditions for masah socks
          </Text>

          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              If they cover those parts of feet that need to be washed during
              ablution;
            </Text>
          </View>

          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              If they are worn in a state of purity. Covering the feet, including
              the ankles.
            </Text>
          </View>

          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              Being able to walk at least three miles.
            </Text>
          </View>

          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              Water should not reach the feet through dripping or draining.
            </Text>
          </View>
        </View>

        {/* Bottom Image */}
        <Image source={imageTwo} style={styles.footerImage} resizeMode="cover" />
      </ScrollView>
    </View>
  );
};

export default WearingSockWudhu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.wasilgreenthemecolor
  },

  headerImage: {
    width: '100%',
    height: 150,
  },

  footerImage: {
    width: '100%',
    height: 150,
    marginTop: 20,
  },

  contentWrapper: {
    padding: 16,
  },

  mainTitle: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginBottom: 16,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.white,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    marginTop: 20,
    marginBottom: 10,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.wasilgreenborder,
  },

  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.wasilgreenborder,
    marginTop: 6,
    marginRight: 12,
  },

  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
});
