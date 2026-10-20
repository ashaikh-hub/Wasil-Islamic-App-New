import {decamelizeKeys} from 'humps';
import stringify from '../utils/qs-stringify';
import {
  Mushaf,
  MushafLines,
  QuranFont,
  QuranFontMushaf,
} from '../types/QuranReader';

export const ITEMS_PER_PAGE = 10;

const STAGING_API_HOST = 'https://api.quran.com';
const PRODUCTION_API_HOST = 'https://api.qurancdn.com';

const API_ROOT_PATH = '/api/qdc';

export const API_HOST =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? PRODUCTION_API_HOST
    : STAGING_API_HOST;

export const makeUrl = (path, parameters) => {
  if (!parameters) {
    return `${API_HOST}${API_ROOT_PATH}${path}`;
  }

  const decamelizedParams = decamelizeKeys(parameters);
  const queryParameters = `?${stringify(decamelizedParams)}`;
  return `${API_HOST}${API_ROOT_PATH}${path}${queryParameters}`;
};
export const getDefaultWordFields = quranFont => ({
  wordFields: `verse_key,verse_id,page_number,location,text_uthmani,text,${quranFont}${
    quranFont === QuranFont.QPCHafs ? '' : `,${QuranFont.QPCHafs}`
  }`,
});
export const getMushafId = (
  quranFont,
  mushafLines,
) => {
  let mushaf = QuranFontMushaf[quranFont];
  if (quranFont === QuranFont.IndoPak && mushafLines) {
    mushaf =
      mushafLines === MushafLines.FifteenLines
        ? Mushaf.Indopak15Lines
        : Mushaf.Indopak16Lines;
  }
  return {mushaf};
};
