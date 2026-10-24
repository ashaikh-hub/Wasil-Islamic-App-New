// Guard: the resume prompt must stay OFF by default until the owner approves device testing.
const fs = require('fs');
const THEMES = ['Quran', 'QuranGreen', 'QuranWhite'];

test.each(THEMES)('resume prompt is disabled by default (%s)', theme => {
  const src = fs.readFileSync(`src/containers/${theme}/screens/SurahDetailPage/index.js`, 'utf8');
  expect(src).toMatch(/const ENABLE_RESUME_PROMPT = false;/);
  expect(src).toMatch(/ENABLE_RESUME_PROMPT && !isEmpty\(saveCurrentAyah\)/);
});
