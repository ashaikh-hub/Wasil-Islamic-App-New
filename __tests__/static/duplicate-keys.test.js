// Static regression: no object literal in the Phase 2 files may declare the same key twice.
// A duplicate key silently keeps the later value; this test keeps that from re-entering.
const {ESLint} = require('eslint');
const FILES = [
  'src/containers/Quran/components/JuzCard.js',
  'src/containers/Quran/components/Searchbar.js',
  'src/containers/Quran/screens/QuranMainDashboard/index.js',
  'src/containers/Quran/screens/Setting/FullView.js',
  'src/containers/Quran/screens/Setting/index.js',
  'src/containers/Quran/screens/SurahDetailPage/index.js',
  'src/containers/Quran/screens/TafsirBySurah/TafsirBySurah.js',
  'src/containers/Quran/screens/TafsirBySurah/TafsirSettingFont.js',
  'src/containers/Quran/screens/TranslationBySurah/SurahBySurah.js',
  'src/containers/Quran/screens/TranslationBySurah/TranslationSettingFont.js',
  'src/containers/QuranGreen/components/JuzCard.js',
  'src/containers/QuranGreen/components/Searchbar.js',
  'src/containers/QuranGreen/screens/QuranMainDashboard/index.js',
  'src/containers/QuranGreen/screens/Setting/FullView.js',
  'src/containers/QuranGreen/screens/Setting/index.js',
  'src/containers/QuranGreen/screens/SurahDetailPage/index.js',
  'src/containers/QuranGreen/screens/TafsirBySurah/TafsirBySurah.js',
  'src/containers/QuranGreen/screens/TafsirBySurah/TafsirSettingFont.js',
  'src/containers/QuranGreen/screens/TranslationBySurah/SurahBySurah.js',
  'src/containers/QuranGreen/screens/TranslationBySurah/TranslationSettingFont.js',
  'src/containers/QuranWhite/components/JuzCard.js',
  'src/containers/QuranWhite/components/Searchbar.js',
  'src/containers/QuranWhite/screens/QuranMainDashboard/index.js',
  'src/containers/QuranWhite/screens/Setting/FullView.js',
  'src/containers/QuranWhite/screens/Setting/index.js',
  'src/containers/QuranWhite/screens/SurahDetailPage/index.js',
  'src/containers/QuranWhite/screens/TafsirBySurah/TafsirBySurah.js',
  'src/containers/QuranWhite/screens/TafsirBySurah/TafsirSettingFont.js',
  'src/containers/QuranWhite/screens/TranslationBySurah/SurahBySurah.js',
  'src/containers/QuranWhite/screens/TranslationBySurah/TranslationSettingFont.js',
  'src/network/NetworkStatus.js',
];

test('no duplicate keys in repaired files (all three theme copies)', async () => {
  const eslint = new ESLint({cwd: process.cwd(), overrideConfig: {rules: {'no-dupe-keys': 'error'}}});
  const results = await eslint.lintFiles(FILES);
  const problems = results.flatMap(r => r.messages.filter(m => m.ruleId === 'no-dupe-keys')
    .map(m => `${r.filePath.split('/src/')[1]}:${m.line} ${m.message}`));
  expect(problems).toEqual([]);
}, 300000);
