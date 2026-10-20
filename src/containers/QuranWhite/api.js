import {camelizeKeys} from 'humps';
import {makeUrl} from './utils/api';
import {
  getVersesParams,
  makeAudioUrlByChapter,
  makeAudioUrlByJuz,
  makeAudioUrlByPage,
  makeAvailableRecitersUrl,
  makeByRangeVersesUrl,
  makeChapterUrl,
  makeJuzVersesUrl,
  makePagesLookupUrl,
  makePageVersesUrl,
  makeTafsirContentUrl,
  makeTafsirsUrl,
  makeTranslationsUrl,
  makeRukusUrl,
  makeRukuVersesUrl,
  makeAudioUrlByRuku
} from './utils/apiPaths';

export const fetcher = async (input, init) => {
  console.log('Request URL:', input);

  try {
    const res = await fetch(input, init);

    if (!res.ok || res.status === 500 || res.status === 404) {
      const errorText = await res.text();
      throw new Error(`API error: ${errorText}`);
    }

    const json = await res.json();
    return camelizeKeys(json);
  } catch (error) {
    console.log('An error occurred:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      throw error;
    } else {
      throw new Error('An unknown error occurred while fetching data');
    }
  }
};

export const getChapterVerses = async (id, locale, params) => {
  const res = await fetcher(
    makeUrl(`/verses/by_chapter/${id}`, getVersesParams(locale, params)),
  );

  return res;
};
export const getRangeVerses = async (locale, params) => {
  const res = await fetcher(makeByRangeVersesUrl(locale, params));
  return res;
};

export const getAvailableTranslations = async language =>
  await fetcher(makeTranslationsUrl(language));

export const getAvailableReciters = async (locale, fields) => {
  const res = await fetcher(makeAvailableRecitersUrl(locale, fields));
  return res;
};

export const getAudioUrlByPage = async (recitationsId, chapterId) =>
  await fetcher(makeAudioUrlByPage(recitationsId, chapterId));

export const getAudioUrlByChapter = async (recitationsId, chapterId) =>
  await fetcher(makeAudioUrlByChapter(recitationsId, chapterId));

export const getAudioUrlByJuz = async (recitationsId, chapterId) =>
  await fetcher(makeAudioUrlByJuz(recitationsId, chapterId));

export const getTafsirs = async language =>
  await fetcher(makeTafsirsUrl(language));

export const getChapter = async (chapterIdOrSlug, language) =>
  await fetcher(makeChapterUrl(chapterIdOrSlug, language));

export const getJuzVerses = async (id, locale, params) => {
  const res = await fetcher(makeJuzVersesUrl(id, locale, params));
  return res;
};

export const getPageVerses = async (id, locale, params) =>
  await fetcher(makePageVersesUrl(id, locale, params));

export const getPagesLookup = async params =>
  await fetcher(makePagesLookupUrl(params));

export const getChapterIdBySlug = async (slug, locale) => {
  try {
    const chapterResponse = await getChapter(encodeURI(slug), locale);
    return chapterResponse.chapter.id;
  } catch (error) {
    return false;
  }
};

export const getTafsirContent = async (
  tafsirIdOrSlug,
  verseKey,
  quranFont,
  mushafLines,
  locale,
) => {
  const res = fetcher(
    makeTafsirContentUrl(tafsirIdOrSlug, verseKey, {
      lang: locale,
      quranFont,
      mushafLines,
    }),
  );
  return res;
};

export const getRukus = async () => {
  const res = await fetcher(makeRukusUrl());
  return res;
};

export const getRukuVerses = async (rukuNumber, locale, params) => {
  const res = await fetcher(
    makeRukuVersesUrl(rukuNumber, locale, params),
  );
  return res;
};

export const getAudioUrlByRuku = async (recitationsId, rukuNumber) =>
  await fetcher(makeAudioUrlByRuku(recitationsId, rukuNumber));