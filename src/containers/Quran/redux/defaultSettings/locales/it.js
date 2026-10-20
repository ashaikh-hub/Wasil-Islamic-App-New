import DEFAULT_SETTINGS from '../defaultSettings';

const DEFAULT_TRANSLATION = 153; // Hamza Roberto Piccardo

export default {
  ...DEFAULT_SETTINGS,
  translations: {
    ...DEFAULT_SETTINGS.translations,
    selectedTranslations: [DEFAULT_TRANSLATION],
  },
};
