// Phase 1 test configuration (repaired). Native-only packages are replaced by no-op stubs.
const NATIVE = [
  'react-native-gesture-handler', 'react-native-splash-screen',
  'react-native-sound-player', 'react-native-compass-heading', 'react-native-geolocation-service',
  'react-native-webview', 'react-native-youtube-iframe',
  '@dooboo/react-native-youtube-iframe', 'lottie-react-native',
  'react-native-linear-gradient', 'react-native-view-shot', 'react-native-share',
  'react-native-background-timer', 'react-native-blob-util', 'react-native-image-picker',
  'react-native-pager-view', 'react-native-tab-view',
  'react-native-paper', 'react-native-render-html', 'react-native-modal',
  'react-native-skeleton-placeholder', 'react-native-uuid', 'react-native-element-dropdown',
  'react-native-dropdown-picker', '@shopify/flash-list', '@react-native-masked-view/masked-view',
  '@react-native-community/slider', 'react-native-svg', 'react-native-screens',
  'react-native-track-player/src', 'react-native-compass-heading/',
];
const escape = s => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/test-support/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|immer|redux.*|humps|@dooboo|lottie-react-native|moment-hijri|xstate|@xstate|zustand|react-redux|@shopify|react-native-.*)/)',
  ],
  moduleNameMapper: Object.fromEntries(
    NATIVE.filter(n => !n.endsWith('/') && !n.includes('/src')).map(n => [`^${escape(n)}$`, '<rootDir>/test-support/stubs/native-stub.js'])
  ),
  testPathIgnorePatterns: ['/node_modules/'],
};
