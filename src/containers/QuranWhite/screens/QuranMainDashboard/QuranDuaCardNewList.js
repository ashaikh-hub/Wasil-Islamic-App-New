import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, Image, Dimensions } from 'react-native';
import { Colors } from '../../../../theme';

const { width } = Dimensions.get('window');
const duabackgroundimage = { uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1770385229/home/duaquranbg.png' };

export default class DuaCardNewList extends Component {
  state = {
    activeIndex: 0,
  };

  componentDidMount() {
    this.autoScroll();
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  autoScroll = () => {
    const { data } = this.props;
    if (!data || data.length <= 1) return;

    this.timer = setInterval(() => {
      let nextIndex = this.state.activeIndex + 1;
      if (nextIndex >= data.length) nextIndex = 0;

      this.flatListRef.scrollToIndex({ index: nextIndex, animated: true });
      this.setState({ activeIndex: nextIndex });
    }, 3000); 
  };

  renderDuaCard = ({ item }) => {
    return (
      <View style={styles.duaCard}>
        <Image source={duabackgroundimage} style={styles.duaImage} />
        <Text style={styles.duaArabic}>{item.quranicduaarabic}</Text>
        <Text style={styles.duaEnglish}>{item.quranicduatrasnlation}</Text>
      </View>
    );
  };

  renderDots = () => {
    const { data } = this.props;
    const { activeIndex } = this.state;
    if (!data || data.length <= 1) return null;

    return (
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              { backgroundColor: activeIndex === index ? "#673AB7" : "#D9D9D9" },
            ]}
          />
        ))}
      </View>
    );
  };

  onScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    this.setState({ activeIndex: index });
  };

  render() {
    const { data } = this.props;

    if (!data || data.length === 0) return null;

    return (
      <View>
        <FlatList
          ref={(ref) => (this.flatListRef = ref)}
          data={data}
          keyExtractor={(item, index) => `dua-${index}`}
          renderItem={this.renderDuaCard}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this.onScrollEnd}
          style={{ flexGrow: 0 ,top:10}}
        />
        {this.renderDots()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  duaCard: {
    height: 265,
    width: width * 0.9,
    borderRadius: 10,
    borderWidth: 0.7,
    backgroundColor:Colors.white,
    borderColor: "#7164FA",
    overflow: 'hidden',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: width * 0.09 / 2,
  },
  duaImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  duaArabic: {
    position: 'absolute',
    color: '#000',
    fontSize: 22,
    bottom: 65,
    width: '90%',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed' : 'AlQalamQuran',
  },
  duaEnglish: {
    position: 'absolute',
    top: 205,
    color: Colors.black,
    fontSize: 12,
    width: '90%',
    textAlign: 'left',
    fontFamily: 'NunitoSans-SemiBold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
