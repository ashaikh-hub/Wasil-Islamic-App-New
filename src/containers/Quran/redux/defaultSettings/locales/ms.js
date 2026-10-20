import DEFAULT_SETTINGS from '../defaultSettings';

const DEFAULT_TRANSLATION = 39; // Abdullah Muhammad Basmeih

export default {
  ...DEFAULT_SETTINGS,
  translations: {
    ...DEFAULT_SETTINGS.translations,
    selectedTranslations: [DEFAULT_TRANSLATION],
  },
};
