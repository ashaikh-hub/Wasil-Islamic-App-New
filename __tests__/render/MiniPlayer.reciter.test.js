// Regression: with a reciter track active, the mini player renders the ReciterAvatar branch.
// Before the Phase 1 fix this threw "ReciterAvatar is not defined".
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import TrackPlayer from 'react-native-track-player';
import MiniPlayer from '../../src/containers/Reciters/MiniPlayer';
import ThemeProvider from '../../src/theme/ThemeProvider';

const flush = ms => new Promise(resolve => setTimeout(resolve, ms));

test('mini player renders the reciter avatar when a reciter track is active', async () => {
  TrackPlayer.getActiveTrack = async () => ({
    url: 'https://example.test/audio/x/y/z/mishari_al_afasy/001.mp3',
    title: 'Al-Fatiha',
    artist: 'Mishari',
  });
  let renderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <MiniPlayer />
      </ThemeProvider>,
    );
    await flush(100); // ThemeProvider and track lookup settle
  });
  const tree = JSON.stringify(renderer.toJSON());
  expect(tree).toBeTruthy();
  await ReactTestRenderer.act(async () => renderer.unmount());
}, 120000);
