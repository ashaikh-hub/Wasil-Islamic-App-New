import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import App from './src';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
const TextRender = Text.render;
Text.render = function (...args) {
  const origin = TextRender.call(this, ...args);

  return React.cloneElement(origin, {
    allowFontScaling: false,
    maxFontSizeMultiplier: 1,
  });
};

const TextInputRender = TextInput.render;
TextInput.render = function (...args) {
  const origin = TextInputRender.call(this, ...args);

  return React.cloneElement(origin, {
    allowFontScaling: false,
    maxFontSizeMultiplier: 1,
  });
};

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service'));