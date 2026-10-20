import range from 'lodash/range';

import {getChapterData} from './chapter';
import {formatStringNumber} from './number';
import {parseVerseRange} from './verseKeys';

const COLON_SPLITTER = ':';

export const generateChapterVersesKeys = (data, chapterId) => {
  const chapterNumberString = formatStringNumber(chapterId);

  return range(data[chapterNumberString].versesCount).map(
    verseId => `${chapterNumberString}:${verseId + 1}`,
  );
};

export const getChapterNumberFromKey = verseKey =>
  Number(verseKey.split(COLON_SPLITTER)[0]);

export const getVerseNumberFromKey = verseKey =>
  Number(verseKey.split(COLON_SPLITTER)[1]);

export const getVerseNumberRangeFromKey = verseKey => {
  const splits = verseKey.split(COLON_SPLITTER);
  const surahNumber = splits[0];
  const verseNumber = splits[1]; // for example (3-5)
  const [from, to] = verseNumber.split('-'); // for example [3, 5]
  return {
    surah: Number(surahNumber),
    from: Number(from),
    to: to ? Number(to) : Number(from),
  };
};

export const getVerseAndChapterNumbersFromKey = verseKey => {
  const splits = verseKey.split(COLON_SPLITTER);
  return [splits[0], splits[1]];
};

export const getWordDataByLocation = wordLocation => {
  const locationSplits = wordLocation.split(COLON_SPLITTER);
  return [locationSplits[0], locationSplits[1], locationSplits[2]];
};

export const getFirstWordOfSurah = wordLocation => {
  const locationSplits = getWordDataByLocation(wordLocation);
  return {
    chapterId: locationSplits[0],
    isFirstWordOfSurah: locationSplits[1] === '1' && locationSplits[2] === '1',
  };
};

export const sortWordLocation = locations =>
  locations.sort((a, b) => {
    const [aChapter, aVerse, aWord] = a.split(':');
    const [bChapter, bVerse, bWord] = b.split(':');

    if (Number(aChapter) > Number(bChapter)) return 1;
    if (Number(aChapter) < Number(bChapter)) return -1;

    if (Number(aVerse) > Number(bVerse)) return 1;
    if (Number(aVerse) < Number(bVerse)) return -1;

    if (Number(aWord) > Number(bWord)) return 1;
    if (Number(aWord) < Number(bWord)) return -1;

    return 0;
  });

export const formatChapterId = id => `0${id}`.slice(-2);

export const getVerseUrl = verseKey => {
  const [chapterNumber, verseNumber] =
    getVerseAndChapterNumbersFromKey(verseKey);
  return `/${chapterNumber}/${verseNumber}`;
};

export const sortByVerseKey = (verseKey1, verseKey2) => {
  const [chapterId1, verseId1] = getVerseAndChapterNumbersFromKey(verseKey1);
  const [chapterId2, verseId2] = getVerseAndChapterNumbersFromKey(verseKey2);
  const chapterId1Number = Number(chapterId1);
  const chapterId2Number = Number(chapterId2);
  const verseId1Number = Number(verseId1);
  const verseId2Number = Number(verseId2);
  if (chapterId1Number > chapterId2Number) {
    return 1;
  }
  if (chapterId1Number < chapterId2Number) {
    return -1;
  }
  return verseId1Number > verseId2Number ? 1 : -1;
};

export const sortVersesObjectByVerseKeys = object => {
  const sortedObject = {};
  Object.keys(object)
    .sort((verseKey1, verseKey2) => sortByVerseKey(verseKey1, verseKey2))
    .forEach(verseKey => {
      sortedObject[verseKey] = object[verseKey];
    });
  return sortedObject;
};

export const makeVerseKey = (
  chapterNumber,
  verseNumberOrRangeFrom,
  rangeTo,
) => {
  if (rangeTo && verseNumberOrRangeFrom !== rangeTo) {
    return `${chapterNumber}:${verseNumberOrRangeFrom}-${rangeTo}`;
  }

  return `${chapterNumber}:${verseNumberOrRangeFrom}`;
};

export const makeWordLocation = (verseKey, wordPosition) =>
  `${verseKey}:${wordPosition}`;

export const getVerseWords = (verse, isReadingView = false) => {
  const words = [];
  verse.words.forEach(word => {
    const wordVerse = {...verse};
    words.push({
      ...word,
      hizbNumber: verse.hizbNumber,
      ...(isReadingView && {verse: wordVerse}),
    });
  });
  return words;
};

const getNumberOfVersesInRangeOfChapters = (
  chaptersData,
  startChapter,
  endChapter,
) => {
  let total = 0;
  for (
    let currentChapterId = startChapter;
    currentChapterId < endChapter;
    currentChapterId += 1
  ) {
    total += getChapterData(chaptersData, String(currentChapterId)).versesCount;
  }
  return total;
};

export const getDistanceBetweenVerses = (
  chaptersData,
  firstVerseKey,
  secondVerseKey,
) => {
  // eslint-disable-next-line prefer-const
  let [firstChapterString, firstVerseNumberString] =
    getVerseAndChapterNumbersFromKey(firstVerseKey);
  const [secondChapterString, secondVerseNumberString] =
    getVerseAndChapterNumbersFromKey(secondVerseKey);
  let firstChapterNumber = Number(firstChapterString);
  let secondChapterNumber = Number(secondChapterString);
  let firstVerseNumber = Number(firstVerseNumberString);
  let secondVerseNumber = Number(secondVerseNumberString);
  // if they are within the same chapter
  if (firstChapterNumber === secondChapterNumber) {
    if (firstVerseNumber > secondVerseNumber) {
      return firstVerseNumber - secondVerseNumber;
    }
    return secondVerseNumber - firstVerseNumber;
  }
  // if the first verse chapter is after the second, we swap them to match the same order in the Mushaf
  if (firstChapterNumber > secondChapterNumber) {
    [
      firstVerseNumber,
      secondVerseNumber,
      firstChapterNumber,
      secondChapterNumber,
      firstChapterString,
    ] = [
      secondVerseNumber,
      firstVerseNumber,
      secondChapterNumber,
      firstChapterNumber,
      secondChapterString,
    ];
  }
  let distance = 0;
  // if there is more than 1 full chapter in between the verses' chapters being checked, we sum the number of verses in each chapter.
  if (secondChapterNumber - firstChapterNumber > 1) {
    distance += getNumberOfVersesInRangeOfChapters(
      chaptersData,
      firstChapterNumber + 1,
      secondChapterNumber,
    );
  }
  /*
    1. we add the number of verses from beginning of the second verse's chapter -> the verse itself.
    2. we add the difference between the last verse of the first verse's chapter and the first verse itself.
  */
  return (
    distance +
    secondVerseNumber +
    getChapterData(chaptersData, firstChapterString).versesCount -
    firstVerseNumber
  );
};

export const isFirstVerseOfSurah = verseNumber => verseNumber === 1;

export const isLastVerseOfSurah = (chaptersData, chapterNumber, verseNumber) =>
  verseNumber === getChapterData(chaptersData, chapterNumber).versesCount;

export const getChapterFirstAndLastVerseKey = (chaptersData, chapterId) => {
  if (!chaptersData) {
    return ['', ''];
  }
  const chapterData = getChapterData(chaptersData, chapterId);
  return [
    makeVerseKey(Number(chapterId), 1),
    makeVerseKey(Number(chapterId), chapterData.versesCount),
  ];
};

export const shortenVerseText = (text, length = 150) => {
  const characters = text.split('', length);
  let shortenedText = '';
  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index];
    if (shortenedText.length === length - 1) {
      shortenedText = `${shortenedText}${character}...`;
      break;
    }
    shortenedText = `${shortenedText}${character}`;
  }
  return shortenedText;
};

export const getFirstAndLastVerseKeys = verses => {
  const verseKeys = Object.keys(verses).sort(sortByVerseKey);
  return [verseKeys[0], verseKeys[verseKeys.length - 1]];
};

export const isVerseKeyWithinRanges = (verseKey, ranges) => {
  const [chapter, verse] =
    getVerseAndChapterNumbersFromKey(verseKey).map(Number);
  const rangesArray = Array.isArray(ranges) ? ranges : [ranges];

  for (let i = 0; i < rangesArray.length; i += 1) {
    const verseRange = rangesArray[i];
    const [from, to] = parseVerseRange(verseRange, true);

    // if the chapter is less than or greater than the range, then skip this range
    if (chapter < from.chapter || chapter > to.chapter) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // if the chapter is equal to the chapter of the range start, then check if the verse is within the range
    // if the verse is less than the range, then skip this range
    if (chapter === from.chapter && verse < from.verse) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // if the chapter is equal to the chapter of the range end, then check if the verse is within the range
    // if the verse is greater than the range, then skip this range
    if (chapter === to.chapter && verse > to.verse) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // if we're here, it means that the verse is within the range
    // so we can return true directly and end the loop
    return true;
  }

  // if we're here, it means that the verse is not within any of the ranges
  // so we can return false
  return false;
};
