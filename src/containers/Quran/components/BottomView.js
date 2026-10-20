import Slider from '@react-native-community/slider';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../theme';
import {reciterImages} from './reciterImages';
import { Colors } from '../../../theme';
const speedLabel = {
  0: '',
  1: '1',
  2: '2',
  3: '3',
};
const BottomView = ({
  selectedReciter, 
  playbackSpeed,
  onChangePlaybackSpeed = () => {},
  onPressPlaySetting = () => {},
  onPressPlayMusic = () => {},
  onPressPlayPrevious = () => {},
  onPressPlayCircle = () => {},
  onPressPlayNext = () => {},
  onPressPlayMenu = () => {},
  onPressPlayBook = () => {},
  onPressPreviousPage = () => {},
  onPressNextPage = () => {},
  playImageSource = '',
  minimumValue,
  maximumValue,
  value,
  onSlidingComplete,
  isFromPage = false,
  previousPageNumber,
  nextPageNumber,
  isVisibleSpeedIcon = true,
  isPlay,
  openAyahDetailView = false,
  disabled = false,
}) => {
  const isSpeedCounting = useSelector(state => state.services.isSpeedCounting);

  const hitSlop = {bottom: 10, top: 10, left: 10, right: 10};
  return (
    <View style={[styles.container]}>
      {isFromPage ? (
        <>
          <View style={styles.mainView}>
            <View style={styles.leftPlayView}>
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlayPrevious}>
                <Image
                  style={styles.playNextIconStyle}
                  source={IMAGES.playPrevious}
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.leftPlayIconView}
                hitSlop={hitSlop}
                onPress={onPressPlayCircle}>
                <Image style={styles.playIconStyle} source={playImageSource} />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlayNext}>
                <Image
                  style={styles.playNextIconStyle}
                  source={IMAGES.playNext}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.leftIconView}>
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlaySetting}>
                <Image
                  style={styles.playNextIconStyle}
                  source={IMAGES.playSetting}
                />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlayMusic}>
                <Image
                  style={styles.playNextIconStyle1}
                source={reciterImages[selectedReciter?.reciter_id]}
                />
              </TouchableOpacity>
              {isVisibleSpeedIcon ? (
                <TouchableOpacity
                  disabled={disabled}
                  hitSlop={hitSlop}
                  onPress={onPressPlayMenu}>
                  <Image
                    style={[
                      styles.playNextIconStyle,
                      {tintColor: disabled ? COLORS.secondGray : null},
                    ]}
                    source={IMAGES.playMenu}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={disabled}
                  style={styles.speedView}
                  hitSlop={hitSlop}
                  onPress={onPressPlayMenu}>
                  <View style={styles.lineView}></View>
                  <View style={styles.lineView}></View>
                  <View style={styles.lineView}></View>
                  <View style={styles.lineView}></View>
                  <View style={styles.speedNumberView}>
                    <Text style={styles.speedNumberStyle}>
                      {speedLabel[isSpeedCounting] || ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.rightFirstView}
                onPress={onPressPreviousPage}>
                <TouchableOpacity
                  hitSlop={hitSlop}
                  onPress={onPressPreviousPage}>
                  <Image
                    style={[
                      styles.nextIconStyle,
                      {
                        transform: [{rotate: '180deg'}],
                      },
                    ]}
                    source={IMAGES.rightArrowIcon}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={{color: COLORS.yellow}}>
                    {previousPageNumber}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rightSecondView}
                onPress={onPressNextPage}>
                <View>
                  <Text style={{color: COLORS.yellow}}>{nextPageNumber}</Text>
                </View>
                <TouchableOpacity hitSlop={hitSlop} onPress={onPressNextPage}>
                  <Image
                    style={[styles.nextIconStyle]}
                    source={IMAGES.rightArrowIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.mainView}>
            <View style={styles.leftIconView}>
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlayMusic}>
                 <Image
                  style={styles.playNextIconStyle1}
                source={reciterImages[selectedReciter?.reciter_id]}
                />
              </TouchableOpacity>
              <TouchableOpacity
  style={styles.playbackSpeedButton}
  hitSlop={hitSlop}
  onPress={onChangePlaybackSpeed}>
  <Text style={styles.playbackSpeedText}>
    {playbackSpeed}x
  </Text>
              </TouchableOpacity>
              
            </View>
            <View style={styles.middlePlayView}>
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlayPrevious}>
                <Image
                  style={styles.playNextIconStyle}
                  source={IMAGES.playPrevious}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playView}
                hitSlop={hitSlop}
                onPress={onPressPlayCircle}>
                <Image style={styles.playIconStyle} source={playImageSource} />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlayNext}>
                <Image
                  style={styles.playNextIconStyle}
                  source={IMAGES.playNext}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.leftIconView}>
              {isVisibleSpeedIcon ? (
                <TouchableOpacity
                  disabled={disabled}
                  hitSlop={hitSlop}
                  onPress={onPressPlayMenu}>
                  <Image
                    style={[
                      styles.playNextIconStyle,
                      {tintColor: disabled ? COLORS.secondGray : null},
                    ]}
                    source={IMAGES.playMenu}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={disabled}
                  style={styles.speedView}
                  hitSlop={hitSlop}
                  onPress={onPressPlayMenu}>
                  <View style={styles.lineView}></View>
                  <View style={styles.lineView}></View>
                  <View style={styles.lineView}></View>
                  <View style={styles.lineView}></View>
                  <View style={styles.speedNumberView}>
                  <Text style={styles.speedNumberStyle}>
                    {speedLabel[isSpeedCounting] || ''}
                  </Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressPlayBook}>
                <Image
                  style={styles.playNextIconStyle}
                  source={
                    openAyahDetailView ? IMAGES.fullViewIcon : IMAGES.playBook
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          {isPlay ? (
            <Slider
              style={styles.slider}
              minimumValue={minimumValue}
              maximumValue={maximumValue}
              value={value}
              onSlidingComplete={onSlidingComplete}
              minimumTrackTintColor={Colors.intermediate1}
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor={Colors.white}
            />
          ) : null}
        </>
      )}
    </View>
  );
};

export default BottomView;

const styles = ScaledSheet.create({
  container: {
    backgroundColor: Colors.intermediate,
    width: '100%',
    position: 'absolute',
    bottom: '0.5@s',
    alignItems: 'center',
    alignSelf: 'center',
    padding: '5@s',
    borderRadius: '5@s',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftIconView: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  playView: {marginHorizontal: '10@s'},
  playIconStyle: {height: '38@s', width: '38@s', resizeMode: 'contain'},
  playNextIconStyle: {height: '26@s', width: '26@s', resizeMode: 'contain'},
  playNextIconStyle1: {height: '26@s', width: '26@s', resizeMode: 'contain',borderRadius:30},
  middlePlayView: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12@s',
    borderRadius: '50@s',
  },
  slider: {
    width: '80%',
    height: 20,
  },

  leftPlayView: {
    backgroundColor: COLORS.lGray,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5@s',
    borderRadius: '50@s',
  },
  leftPlayIconView: {
    marginHorizontal: '5@s',
  },
  rightFirstView: {
    backgroundColor: COLORS.lGray,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '5@s',
    borderTopStartRadius: '50@s',
    borderBottomStartRadius: '50@s',
    marginRight: '3@s',
  },
  rightSecondView: {
    backgroundColor: COLORS.lGray,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5@s',
    borderTopEndRadius: '50@s',
    borderBottomEndRadius: '50@s',
  },
  nextIconStyle: {height: '26@s', width: '26@s', resizeMode: 'contain'},
  speedView: {
    height: '26@s',
    width: '26@s',
    paddingHorizontal: '4@s',
    paddingVertical: '1@s',
    zIndex: 999,
  },
  lineView: {
    height: 0.7,
    borderWidth: 0.7,
    borderColor: COLORS.white,
    marginTop: '3@s',
  },
  speedNumberView: {
    alignSelf: 'center',
    backgroundColor: COLORS.yellow,
    width: '13@s',
    height: '13@s',
    borderRadius: '7@s',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -1,
  },
  speedNumberStyle: {
    ...FONTSTYLE(FONTS.poppinsRegular).caption,
    lineHeight: 15,
    color: '#FFFFFF',
  },
  playbackSpeedButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
},

playbackSpeedText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: '600',
},
});
