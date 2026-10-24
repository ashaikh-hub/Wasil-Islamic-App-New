// Track player: hooks must return well-formed values; playback is a no-op in tests.
const noop = () => Promise.resolve();
const TrackPlayer = {
  setupPlayer: noop, updateOptions: noop, add: noop, reset: noop, skip: noop,
  seekTo: noop, play: noop, pause: noop, stop: noop, skipToNext: noop,
  skipToPrevious: noop, getQueue: () => Promise.resolve([]), getActiveTrackIndex: () => Promise.resolve(0),
  getProgress: () => Promise.resolve({position: 0, duration: 0, buffered: 0}),
  addEventListener: () => ({remove() {}}), registerPlaybackService: () => {},
  getPlaybackState: () => Promise.resolve({state: 'none'}),
  getState: () => Promise.resolve('none'),
  getActiveTrack: () => Promise.resolve(null),
};
const PLAYBACK_STATE = {state: 'none'};
const PROGRESS = {position: 0, duration: 0, buffered: 0};
const State = {None: 'none', Ready: 'ready', Playing: 'playing', Paused: 'paused', Stopped: 'stopped',
  Buffering: 'buffering', Connecting: 'connecting', Loading: 'loading', Ended: 'ended', Error: 'error'};
const Capability = {Play: 0, Pause: 1, Stop: 2, SkipToNext: 3, SkipToPrevious: 4, SeekTo: 5};
const Event = {PlaybackState: 'playback-state', PlaybackError: 'playback-error', PlaybackTrackChanged: 'playback-track-changed'};
module.exports = {
  __esModule: true,
  default: TrackPlayer,
  State, Capability, Event,
  // Hooks return stable objects (as the real library does); fresh objects would re-trigger effects forever.
  usePlaybackState: () => PLAYBACK_STATE,
  useProgress: () => PROGRESS,
  useTrackPlayerEvents: () => {},
  useActiveTrack: () => undefined,
};
