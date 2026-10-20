import SliceName from '../types/SliceName';
import ar from '../../redux/defaultSettings/locales/ar';
import bn from '../../redux/defaultSettings/locales/bn';
import en from '../../redux/defaultSettings/locales/en';
import fa from '../../redux/defaultSettings/locales/fa';
import fr from '../../redux/defaultSettings/locales/fr';
import id from '../../redux/defaultSettings/locales/id';
import it from '../../redux/defaultSettings/locales/it';
import ms from '../../redux/defaultSettings/locales/ms';
import nl from '../../redux/defaultSettings/locales/nl';
import pt from '../../redux/defaultSettings/locales/pt';
import ru from '../../redux/defaultSettings/locales/ru';
import sq from '../../redux/defaultSettings/locales/sq';
import th from '../../redux/defaultSettings/locales/th';
import tr from '../../redux/defaultSettings/locales/tr';
import ur from '../../redux/defaultSettings/locales/ur';
import zh from '../../redux/defaultSettings/locales/zh';

const languageData = {
  ar,
  bn,
  en,
  fa,
  fr,
  id,
  it,
  ms,
  nl,
  pt,
  ru,
  sq,
  th,
  tr,
  ur,
  zh,
  // Add other languages here
};

export const getStoreInitialState = locale => {
  return {
    [SliceName.THEME]: getThemeInitialState(locale),
    [SliceName.READING_PREFERENCES]: getReadingPreferencesInitialState(locale),
    [SliceName.QURAN_READER_STYLES]: getQuranReaderStylesInitialState(locale),
    [SliceName.TRANSLATIONS]: getTranslationsInitialState(locale),
    [SliceName.TAFSIRS]: getTafsirsInitialState(locale),
    [SliceName.AUDIO_PLAYER_STATE]: getAudioPlayerStateInitialState(locale),
    [SliceName.DEFAULT_SETTINGS]: {isUsingDefaultSettings: true},
    [SliceName.NOTIFICATIONS]: getNotificationsInitialState(locale),
  };
};

const DEFAULT_LOCALE = 'en';

const importLocaleFile = locale =>
  require(`../../redux/defaultSettings/locales/en`).default;

const getLocaleInitialStateByKey = (locale, key) =>
  importLocaleFile(locale)[key];

export const getLocaleInitialState = locale => importLocaleFile(locale);

export const getThemeInitialState = (locale = DEFAULT_LOCALE) => {
  return getLocaleInitialStateByKey(locale, SliceName.THEME);
};

export const getReadingPreferencesInitialState = (locale = DEFAULT_LOCALE) => {
  return getLocaleInitialStateByKey(locale, SliceName.READING_PREFERENCES);
};

export const getQuranReaderStylesInitialState = (locale = DEFAULT_LOCALE) => {
  return getLocaleInitialStateByKey(locale, SliceName.QURAN_READER_STYLES);
};

export const getTranslationsInitialState = (locale = DEFAULT_LOCALE) => {
  return getLocaleInitialStateByKey(locale, SliceName.TRANSLATIONS);
};

export const getTafsirsInitialState = (locale = DEFAULT_LOCALE) => {
  return getLocaleInitialStateByKey(locale, SliceName.TAFSIRS);
};
export const getAudioPlayerStateInitialState = (locale = DEFAULT_LOCALE) => {
  return getLocaleInitialStateByKey(locale, SliceName.AUDIO_PLAYER_STATE);
};

export const getNotificationsInitialState = (locale = DEFAULT_LOCALE) => {
  return getLocaleInitialStateByKey(locale, SliceName.NOTIFICATIONS);
};
