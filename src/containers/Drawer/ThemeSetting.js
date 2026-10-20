import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../theme';
import Blue from '../../theme/blue';
import Green from '../../theme/green';
import White from '../../theme/white';

const THEMES = [
  {
    key: 'white',
    title: 'White',
    subtitle: 'Clean & Minimal',
    color: '#F1EDF7', // White.background is pure white; tint so the preview shows on the white card
    accent: White.surface,
    textColor: '#000',
  },
  {
    key: 'blue',
    title: 'Blue',
    subtitle: 'Elegant & Modern',
    color: Blue.background,
    accent: Blue.gold,
    textColor: '#FFF',
  },
  {
    key: 'green',
    title: 'Green',
    subtitle: 'Peaceful & Islamic',
    color: Green.background,
    accent: Green.gold,
    textColor: '#FFF',
  },
];

const ThemeSetting = () => {
  const {theme, changeTheme, Colors} = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: '#F7F8FC'}}>
      <StatusBar
        backgroundColor={Colors.primary}
      />

      <LinearGradient
        colors={[Colors.primary,Colors.primary]}
        style={styles.header}>
        <Text style={styles.headerIcon}>🎨</Text>

        <Text style={styles.headerTitle}>
          Choose Your Theme
        </Text>

        <Text style={styles.headerSubtitle}>
          Personalize your Wasil App Experience
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>

        {THEMES.map(item => {
          const selected = theme === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.9}
              onPress={() => changeTheme(item.key)}
              style={[
                styles.card,
                {
                  borderColor: selected ? '#D4A44B' : '#E6E6E6',
                  borderWidth: selected ? 3 : 1,
                },
              ]}>

              <View
                style={[
                  styles.preview,
                  {backgroundColor: item.color},
                ]}>

                <View
                  style={[
                    styles.fakeHeader,
                    {
                      backgroundColor:
                        item.accent,
                    },
                  ]}
                />

                <View style={styles.fakeRow}>
                  <View
                    style={[
                      styles.fakeBox,
                      {
                        backgroundColor:
                          item.key === 'white'
                            ? '#EAEAEA'
                            : '#FFFFFF40',
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.fakeBox,
                      {
                        backgroundColor:
                          item.key === 'white'
                            ? '#EAEAEA'
                            : '#FFFFFF40',
                      },
                    ]}
                  />
                </View>

                <View style={styles.fakeRow}>
                  <View
                    style={[
                      styles.fakeBox,
                      {
                        backgroundColor:
                          item.key === 'white'
                            ? '#EAEAEA'
                            : '#FFFFFF40',
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.fakeBox,
                      {
                        backgroundColor:
                          item.key === 'white'
                            ? '#EAEAEA'
                            : '#FFFFFF40',
                      },
                    ]}
                  />
                </View>

                {selected && (
                  <View style={styles.selectedCircle}>
                    <Text style={styles.check}>✓</Text>
                  </View>
                )}
              </View>

              <View style={{flex: 1, marginLeft: 20}}>
                <Text style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.subtitle}>
                  {item.subtitle}
                </Text>

                {selected && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      CURRENT THEME
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ThemeSetting;

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },

  headerIcon: {
    fontSize: 42,
  },

  headerTitle: {
    marginTop: 10,
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#EEE',
    marginTop: 8,
    fontSize: 15,
  },

  container: {
    padding: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },

  preview: {
    width: 100,
    height: 150,
    borderRadius: 18,
    padding: 10,
    overflow: 'hidden',
  },

  fakeHeader: {
    height: 18,
    borderRadius: 5,
    marginBottom: 10,
  },

  fakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  fakeBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222',
    marginTop: 10,
  },

  subtitle: {
    marginTop: 8,
    color: '#777',
    fontSize: 15,
  },

  badge: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: '#D4A44B',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  badgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 11,
  },

  selectedCircle: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D4A44B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  check: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});