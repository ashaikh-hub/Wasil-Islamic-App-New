import {getChapterData} from './chapter';
import {parseVerseRange} from './verseKeys';

export const isValidChapterId = chapterId => {
  const chapterIdNumber = Number(chapterId);
  // if it's not a numeric string or it's numeric but out of the range of chapter 1->114
  if (
    Number.isNaN(chapterIdNumber) ||
    chapterIdNumber > 114 ||
    chapterIdNumber < 1
  ) {
    return false;
  }
  return true;
};

export const isValidVerseNumber = verseId => {
  const verseIdNumber = Number(verseId);
  return !Number.isNaN(verseIdNumber);
};

export const isValidVerseId = (chaptersData, chapterId, verseId) => {
  const verseIdNumber = Number(verseId);
  // is not a valid number, below 1 or above the maximum number of verses for the chapter.
  if (Number.isNaN(verseIdNumber) || verseIdNumber < 1) {
    return false;
  }
  if (
    !getChapterData(chaptersData, chapterId) ||
    verseIdNumber > getChapterData(chaptersData, chapterId).versesCount
  ) {
    return false;
  }
  return true;
};

export const isValidJuzId = juzId => {
  const juzIdNumber = Number(juzId);
  // if it's not a numeric string or it's numeric but out of the range of chapter 1->30
  if (Number.isNaN(juzIdNumber) || juzIdNumber > 30 || juzIdNumber < 1) {
    return false;
  }
  return true;
};

export const isValidRubId = rubId => {
  const rubIdNumber = Number(rubId);
  // if it's not a numeric string or it's numeric but out of the range of chapter 1->240
  if (Number.isNaN(rubIdNumber) || rubIdNumber > 240 || rubIdNumber < 1) {
    return false;
  }
  return true;
};

export const isValidHizbId = hizbId => {
  const hizbIdNumber = Number(hizbId);
  // if it's not a numeric string or it's numeric but out of the range of chapter 1->30
  if (Number.isNaN(hizbIdNumber) || hizbIdNumber > 60 || hizbIdNumber < 1) {
    return false;
  }
  return true;
};

export const isValidPageId = pageId => {
  const pageIdNumber = Number(pageId);
  // if it's not a numeric string or it's numeric but out of the range of chapter 1->604
  if (Number.isNaN(pageIdNumber) || pageIdNumber > 604 || pageIdNumber < 1) {
    return false;
  }
  return true;
};

export const getToAndFromFromRange = range => range.split('-');

export const isValidVerseRange = (chaptersData, chapterId, range) => {
  const rangeSplits = getToAndFromFromRange(range);
  // if the splits are not 2, it means it's not in the right format.
  if (rangeSplits.length !== 2) {
    return false;
  }
  const [from, to] = rangeSplits;
  const fromNumber = Number(from);
  const toNumber = Number(to);
  // if the range is in the right format but either value is not a number e.g. 'one-two'
  if (Number.isNaN(fromNumber) || Number.isNaN(toNumber)) {
    return false;
  }
  // 0 is not a valid verse number
  if (fromNumber === 0 || toNumber === 0) {
    return false;
  }
  // if the from verse number is bigger than the to verse number
  if (fromNumber > toNumber) {
    return false;
  }
  // if the chapterId is not a valid chapterId e.g. "word"
  if (!getChapterData(chaptersData, chapterId)) {
    return false;
  }
  const chapterVersesCount = getChapterData(
    chaptersData,
    chapterId,
  ).versesCount;
  // if either the from verse number of to verse number exceeds the chapter's total number.
  if (fromNumber > chapterVersesCount || toNumber > chapterVersesCount) {
    return false;
  }

  return true;
};

export const isRangesStringValid = (chaptersData, rangesString) => {
  const parsedVerseRange = parseVerseRange(rangesString);
  // 1. if the range is not in the right format
  if (!parsedVerseRange) {
    return false;
  }
  const [fromRange, toRange] = parsedVerseRange;
  // if both ranges are in the same chapter
  if (fromRange.chapter === toRange.chapter) {
    const verseRange = `${fromRange.verse}-${toRange.verse}`;
    // 2. if range within same surah is not valid
    if (!isValidVerseRange(chaptersData, fromRange.chapter, verseRange)) {
      return false;
    }
  } else {
    // 2. if start of range verse key is not valid
    if (!isValidVerseKey(chaptersData, fromRange.verseKey)) {
      return false;
    }
    // 3. if end of range verse key is not valid
    if (!isValidVerseKey(chaptersData, toRange.verseKey)) {
      return false;
    }
    // 4. if the fromRange chapter is bigger than the toRange chapter e.g. 2:1-1:1
    if (Number(fromRange.chapter) > Number(toRange.chapter)) {
      return false;
    }
  }

  return true;
};

export const isValidVerseKey = (chaptersData, verseKey) => {
  const splits = verseKey.split(':');
  // if the splits are not 2, it means it's not in the right format.
  if (splits.length !== 2) {
    return false;
  }
  const [chapterId, verseId] = splits;
  // if either value is not a number e.g. 'one:2' or if the verseNumber is below 0
  if (
    !isValidChapterId(chapterId) ||
    !isValidVerseId(chaptersData, chapterId, verseId)
  ) {
    return false;
  }

  return true;
};

export const isValidTafsirId = tafsirId => {
  const tafsirIdNumber = Number(tafsirId);
  // if the tafsir Id is not a number of if it's below 1
  if (Number.isNaN(tafsirIdNumber) || tafsirIdNumber < 1) {
    return false;
  }
  return true;
};
