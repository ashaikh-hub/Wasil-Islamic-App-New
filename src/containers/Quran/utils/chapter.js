import ar from '../data/chapters/ar.json';
import bn from '../data/chapters/bn.json';
import en from '../data/chapters/en.json';
import fa from '../data/chapters/fa.json';
import fr from '../data/chapters/fr.json';
import id from '../data/chapters/id.json';
import it from '../data/chapters/it.json';
import ms from '../data/chapters/ms.json';
import nl from '../data/chapters/nl.json';
import pt from '../data/chapters/pt.json';
import ru from '../data/chapters/ru.json';
import sq from '../data/chapters/sq.json';
import th from '../data/chapters/th.json';
import tr from '../data/chapters/tr.json';
import ur from '../data/chapters/ur.json';
import zh from '../data/chapters/zh.json';
// Import other languages as needed

import random from 'lodash/random';

import {formatStringNumber} from './number';
import REVELATION_ORDER from './revelationOrder';

const chapterData = {
  ar,
  bn,
  en,
  fa,
  fr,
  id,
  it,
  ms,
  nl,
  pt,
  ru,
  sq,
  th,
  tr,
  ur,
  zh,
  // Add other languages here
};
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_CHAPTER_LOCALES = [
  'en',
  'ar',
  'bn',
  'fr',
  'id',
  'it',
  'nl',
  'ru',
  'tr',
  'ur',
  'zh',
];

export const getAllChaptersData = (lang = DEFAULT_LANGUAGE) => {
  if (SUPPORTED_CHAPTER_LOCALES.includes(lang)) {
    return new Promise(res => {
      const data = chapterData[lang];
      res(data);
    });
  }
  return new Promise(res => {
    const data = chapterData['en'];
    res(data);
  });
};

export const getChapterData = (chapters, id) =>
  chapters[formatStringNumber(id)];

export const getChapterIdsForPage = async pageId => {
  return new Promise(res => {
    import(`../data/page-to-chapter-mappings.json`)
      .then(data => {
        res(data?.default[pageId]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getChapterIdsForJuz = juzId => {
  return new Promise(res => {
    import(`../data/juz-to-chapter-mappings.json`)
      .then(data => {
        res(data?.default[juzId]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getAllJuzMappings = () => {
  return new Promise(res => {
    import('../data/juz-to-chapter-verse-mappings.json')
      .then(data => {
        res(data.default);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getChapterAndVerseMappingForJuz = async juzId => {
  const juzVerseMapping = await getAllJuzMappings();
  return juzVerseMapping[juzId];
};

export const isFirstSurah = async (surahNumber, isReadingByRevelationOrder) => {
  if (!isReadingByRevelationOrder) return surahNumber === 1;
  return REVELATION_ORDER[0] === surahNumber;
};

export const isLastSurah = (surahNumber, isReadingByRevelationOrder) => {
  if (!isReadingByRevelationOrder) return surahNumber === 114;
  return REVELATION_ORDER[REVELATION_ORDER.length - 1] === surahNumber;
};

export const getChapterReadingProgress = (currentVerse, totalNumberOfVerses) =>
  Math.ceil((currentVerse * 100) / totalNumberOfVerses);

export const QURAN_CHAPTERS_COUNT = 114;
export const getRandomChapterId = () => {
  return random(1, QURAN_CHAPTERS_COUNT);
};
