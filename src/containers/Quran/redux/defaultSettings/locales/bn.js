import {QuranFont} from '../../types/QuranReader';
import DEFAULT_SETTINGS from '../defaultSettings';

const DEFAULT_TRANSLATION = 161; // Taisirul Quran
const DEFAULT_TAFSIR = 'bn-tafsir-ahsanul-bayaan'; // Tafsir Ahsanul Bayaan

export default {
  ...DEFAULT_SETTINGS,
  quranReaderStyles: {
    ...DEFAULT_SETTINGS.quranReaderStyles,
    quranFont: QuranFont.IndoPak,
  },
  readingPreferences: {
    ...DEFAULT_SETTINGS.readingPreferences,
    selectedWordByWordLocale: 'bn',
  },
  tafsirs: {...DEFAULT_SETTINGS.tafsirs, selectedTafsirs: [DEFAULT_TAFSIR]},
  translations: {
    ...DEFAULT_SETTINGS.translations,
    selectedTranslations: [DEFAULT_TRANSLATION],
  },
};
