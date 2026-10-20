import {
  ReadingPreference,
  WordByWordType,
  WordClickFunctionality,
  MushafLines,
  QuranFont,
  WordByWordDisplay,
  ThemeType,
} from '../types/QuranReader';
import SliceName from '../types/SliceName';

// Tafsir Ibn Kathir in English
export const DEFAULT_TAFSIRS = ['en-tafisr-ibn-kathir'];

export const DEFAULT_RECITER = {
  id: 7,
  name: 'Mishari Rashid al-`Afasy',
  recitationStyle: 'Warsh',
  relativePath: 'mishaari_raashid_al_3afaasee',
};

const TAFSIRS_INITIAL_STATE = {
  selectedTafsirs: DEFAULT_TAFSIRS,
  isUsingDefaultTafsirs: true,
};

export const DEFAULT_TRANSLATIONS = [131]; // Dr. Mustafa Khattab, the Clear Quran

const TRANSLATIONS_INITIAL_STATE = {
  selectedTranslations: DEFAULT_TRANSLATIONS,
  isUsingDefaultTranslations: true,
};

const QURAN_READER_STYLES_INITIAL_STATE = {
  // the base sizes in rem
  tafsirFontScale: 3,
  quranTextFontScale: 3,
  translationFontScale: 3,
  wordByWordFontScale: 3,
  quranFont: QuranFont.MadaniV1,
  mushafLines: MushafLines.SixteenLines,
  isUsingDefaultFont: true,
};

const DEFAULT_WBW_LOCALE = 'en';

const READING_PREFERENCES_INITIAL_STATE = {
  readingPreference: ReadingPreference.Translation,
  selectedWordByWordLocale: DEFAULT_WBW_LOCALE,
  isUsingDefaultWordByWordLocale: true,
  wordByWordContentType: [WordByWordType.Translation],
  wordByWordDisplay: [WordByWordDisplay.TOOLTIP],
  wordClickFunctionality: WordClickFunctionality.PlayAudio,
};

const THEME_INITIAL_STATE = {
  type: ThemeType.Auto,
};

const AUDIO_INITIAL_STATE = {
  enableAutoScrolling: true,
  isDownloadingAudio: false,
  showTooltipWhenPlayingAudio: false,
};

export const DEFAULT_XSTATE_INITIAL_STATE = {
  playbackRate: 1,
  reciterId: DEFAULT_RECITER.id,
  volume: 1,
};

const NOTIFICATIONS_INITIAL_STATE = {
  notifications: [],
  paginatedNotifications: {},
  isFetchingNotifications: false,
  isLoadingNotifications: false,
  unseenCount: 0,
};

export default {
  [SliceName.THEME]: THEME_INITIAL_STATE,
  [SliceName.READING_PREFERENCES]: READING_PREFERENCES_INITIAL_STATE,
  [SliceName.QURAN_READER_STYLES]: QURAN_READER_STYLES_INITIAL_STATE,
  [SliceName.TRANSLATIONS]: TRANSLATIONS_INITIAL_STATE,
  [SliceName.TAFSIRS]: TAFSIRS_INITIAL_STATE,
  [SliceName.AUDIO_PLAYER_STATE]: AUDIO_INITIAL_STATE,
  [SliceName.NOTIFICATIONS]: NOTIFICATIONS_INITIAL_STATE,
};
