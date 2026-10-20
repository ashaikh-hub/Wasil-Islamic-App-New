import DEFAULT_SETTINGS from '../defaultSettings';

const DEFAULT_TRANSLATION = 144; // Sofian S. Siregar

export default {
  ...DEFAULT_SETTINGS,
  translations: {
    ...DEFAULT_SETTINGS.translations,
    selectedTranslations: [DEFAULT_TRANSLATION],
  },
};
