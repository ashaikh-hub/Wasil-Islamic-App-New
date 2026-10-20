import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import YoutubePlayer from '@dooboo/react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TooltipNew from './TooltipNew';
import { MIN_TOUCH, Spacing } from '../../theme';

export const getYoutubeIdFromURL = (url = '') => {
  if (url.includes('?')) url = url.split('?')[0];
  const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  let id = arr[2] !== undefined ? arr[2].split(/[^\w-]/i)[0] : arr[0];
  if (id.includes('youtube.com/shorts/')) id = id.split('youtube.com/shorts/')[1];
  return id;
};

function ShortItemNew({ visible, playing, url, layout, onNext, isLast }) {
  const youtubeId = getYoutubeIdFromURL(url);
  const playerRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [showHint, setShowHint] = useState(true);
  const [muted, setMuted] = useState(true);

  // The "swipe for next" hint disappears after a few seconds.
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.playerWrapper}>
        <YoutubePlayer
          ref={playerRef}
          height={layout.height + 3}
          width={layout.width}
          videoId={youtubeId}
          play={playing}
          mute={muted}
          forceAndroidAutoplay
          initialPlayerParams={{
            controls: false,
            modestbranding: true,
            rel: false,
            showinfo: false,
            iv_load_policy: 3,
            fs: false,
          }}
          onChangeState={(state) => {
            if (state === 'ended' && visible) playerRef.current?.seekTo(0, true);
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.muteButton, { bottom: insets.bottom + 96 }]}
        onPress={() => setMuted(!muted)}
        accessibilityRole="button"
        accessibilityLabel={muted ? 'Unmute' : 'Mute'}>
        <Text style={styles.muteText}>{muted ? '🔇' : '🔊'}</Text>
      </TouchableOpacity>

      {showHint && visible && !isLast ? <TooltipNew onPress={onNext} bottom={insets.bottom + 48} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', overflow: 'hidden' },
  // The iframe draws a 1–3px line at the top; shift it up and make it 3px taller to hide it.
  playerWrapper: { flex: 1, marginTop: -3 },
  muteButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteText: { color: '#FFFFFF', fontSize: 18 },
});

export default ShortItemNew;
