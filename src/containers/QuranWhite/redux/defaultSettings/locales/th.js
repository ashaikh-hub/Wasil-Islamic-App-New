import DEFAULT_SETTINGS from '../defaultSettings';

const DEFAULT_TRANSLATION = 230; // Society of Institutes and Universities

export default {
  ...DEFAULT_SETTINGS,
  translations: {
    ...DEFAULT_SETTINGS.translations,
    selectedTranslations: [DEFAULT_TRANSLATION],
  },
};
