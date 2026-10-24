// Static regression: files repaired in Phase 1 must contain no undefined identifiers or undefined JSX components.
const {ESLint} = require('eslint');
const REPAIRED = [
  'src/containers/Reciters/MiniPlayer.js',
  'src/containers/Quran/components/AyahViewComponent.js',
  'src/containers/QuranGreen/components/AyahViewComponent.js',
  'src/containers/QuranWhite/components/AyahViewComponent.js',
  'src/containers/Quran/components/SaveList.js',
  'src/containers/QuranGreen/components/SaveList.js',
  'src/containers/QuranWhite/components/SaveList.js',
  'src/containers/Quran/navigation/index.js',
  'src/containers/QuranGreen/navigation/index.js',
  'src/containers/QuranWhite/navigation/index.js',
  'src/containers/Quran/screens/TranslationBySurah/TranslationSettingsScreen.js',
  'src/containers/QuranGreen/screens/TranslationBySurah/TranslationSettingsScreen.js',
  'src/containers/QuranWhite/screens/TranslationBySurah/TranslationSettingsScreen.js',
  'src/containers/Quran/screens/SurahDetailPage/index.js',
  'src/containers/QuranGreen/screens/SurahDetailPage/index.js',
  'src/containers/QuranWhite/screens/SurahDetailPage/index.js',
  'src/containers/Quran/screens/SurahFullView/index.js',
  'src/containers/QuranGreen/screens/SurahFullView/index.js',
  'src/containers/QuranWhite/screens/SurahFullView/index.js',
  'src/containers/Quran/utils/chapter.js',
  'src/containers/QuranGreen/utils/chapter.js',
  'src/containers/QuranWhite/utils/chapter.js',
];

test('repaired files have no undefined identifiers or undefined JSX components', async () => {
  // Use the repository's own ESLint configuration; only the two rules under test are forced on.
  const eslint = new ESLint({
    cwd: process.cwd(),
    overrideConfig: {rules: {'no-undef': 'error', 'react/jsx-no-undef': 'error'}},
  });
  const results = await eslint.lintFiles(REPAIRED);
  const problems = results.flatMap(r =>
    r.messages
      .filter(m => m.ruleId === 'no-undef' || m.ruleId === 'react/jsx-no-undef')
      .map(m => `${r.filePath.split('/src/')[1]}:${m.line} ${m.message}`),
  );
  expect(problems).toEqual([]);
}, 600000);
