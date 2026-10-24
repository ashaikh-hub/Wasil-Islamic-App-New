// Global test setup: official AsyncStorage mock + gesture handler/ reanimated mocks.
jest.mock('@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-track-player', () => require('./stubs/track-player'));
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    __esModule: true,
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children}) => children,
    SafeAreaInsetsContext: {Consumer: () => null},
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({x: 0, y: 0, width: 360, height: 780}),
    initialWindowMetrics: {frame: {x: 0, y: 0, width: 360, height: 780}, insets: inset},
  };
});

// Packages that run code at import time need real shapes (not the generic no-op stub).
jest.mock('react-native-permissions', () => ({
  __esModule: true,
  PERMISSIONS: {
    IOS: {LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE', LOCATION_ALWAYS: 'ios.permission.LOCATION_ALWAYS'},
    ANDROID: {ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION', ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION'},
  },
  RESULTS: {GRANTED: 'granted', DENIED: 'denied', BLOCKED: 'blocked', UNAVAILABLE: 'unavailable', LIMITED: 'limited'},
  check: async () => 'denied',
  request: async () => 'denied',
  requestMultiple: async () => ({}),
  openSettings: async () => {},
}));
jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: () => () => {},
    fetch: async () => ({isConnected: true, isInternetReachable: true, type: 'wifi'}),
    refresh: async () => ({isConnected: true}),
  },
}));
jest.mock('react-native-mmkv', () => {
  const store = new Map();
  class MMKV {
    constructor() {}
    set(k, v) { store.set(k, v); }
    getString(k) { return store.has(k) ? store.get(k) : undefined; }
    getNumber(k) { return store.has(k) ? Number(store.get(k)) : undefined; }
    getBoolean(k) { return store.has(k) ? Boolean(store.get(k)) : undefined; }
    contains(k) { return store.has(k); }
    delete(k) { store.delete(k); }
    getAllKeys() { return Array.from(store.keys()); }
    clearAll() { store.clear(); }
  }
  return {__esModule: true, MMKV, createMMKV: () => new MMKV(), useMMKVString: () => [undefined, () => {}]};
});

// Gesture handler: root/containers must pass children through (a no-op stub would hide the whole tree).
jest.mock('react-native-gesture-handler', () => {
  const {ScrollView, FlatList, TouchableOpacity, View} = require('react-native');
  const pass = ({children}) => children ?? null;
  const gestureBuilder = new Proxy({}, {get: () => () => new Proxy({}, {get: () => () => ({})})});
  return {
    __esModule: true,
    GestureHandlerRootView: View,
    PanGestureHandler: pass, TapGestureHandler: pass, LongPressGestureHandler: pass,
    FlingGestureHandler: pass, NativeViewGestureHandler: pass, PinchGestureHandler: pass,
    RotationGestureHandler: pass, ForceTouchGestureHandler: pass, GestureDetector: pass,
    ScrollView, FlatList, TouchableOpacity,
    RectButton: TouchableOpacity, BorderlessButton: TouchableOpacity, BaseButton: TouchableOpacity,
    Swipeable: pass, DrawerLayout: pass,
    Gesture: gestureBuilder,
    State: {UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5},
    Directions: {RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8},
    gestureHandlerRootHOC: c => c,
    handlerTags: {},
    enableScreens: () => {},
    attachGestureHandler: () => {},
    createNativeWrapper: c => c,
  };
});

// iPhone screen helper: called at module load for style values, so needs real function shapes.
jest.mock('react-native-iphone-screen-helper', () => ({
  __esModule: true,
  getStatusBarHeight: () => 24,
  getBottomSpace: () => 0,
  isIphoneX: () => false,
  ifIphoneX: (iphoneXStyle, regularStyle) => regularStyle,
  getIphoneXStyle: () => ({}),
}));

// SVG: every named element is a real component that renders its children (keeps the tree intact).
jest.mock('react-native-svg', () => {
  const React = require('react');
  const Pass = ({children}) => React.createElement(require('react-native').View, null, children ?? null);
  const handler = {
    get(target, key) {
      if (key === '__esModule') return true;
      if (key === 'then') return undefined;
      if (key in target) return target[key];
      return Pass;
    },
  };
  const mod = new Proxy({}, handler);
  mod.default = Pass;
  return mod;
});
