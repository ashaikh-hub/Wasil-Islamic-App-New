/* eslint-disable react-func/max-lines-per-function */
/* eslint-disable import/prefer-default-export */
import range from 'lodash/range';

import {getChapterData} from './chapter';

export const generateVerseKeysBetweenTwoVerseKeys = (
  chaptersData,
  fromVerseKey,
  toVerseKey,
) => {
  const verseKeys = [];
  const [startChapter, startVerse] = fromVerseKey.split(':');
  const [endChapter, endVerse] = toVerseKey.split(':');
  if (startChapter === endChapter) {
    range(Number(startVerse), Number(endVerse) + 1).forEach(verseNumber => {
      verseKeys.push(`${startChapter}:${verseNumber}`);
    });
  } else {
    range(Number(startChapter), Number(endChapter) + 1).forEach(
      chapterNumber => {
        if (chapterNumber === Number(startChapter)) {
          const chapterData = getChapterData(chaptersData, startChapter);
          range(Number(startVerse), chapterData.versesCount + 1).forEach(
            verseNumber => {
              verseKeys.push(`${startChapter}:${verseNumber}`);
            },
          );
        } else if (chapterNumber === Number(endChapter)) {
          range(1, Number(endVerse) + 1).forEach(verseNumber => {
            verseKeys.push(`${endChapter}:${verseNumber}`);
          });
        } else {
          const chapterData = getChapterData(
            chaptersData,
            String(chapterNumber),
          );
          range(1, chapterData.versesCount + 1).forEach(verseNumber => {
            verseKeys.push(`${chapterNumber}:${verseNumber}`);
          });
        }
      },
    );
  }

  return verseKeys;
};

export const parseVerseRange = (verseRange, parseAsNumbers) => {
  const result = verseRange.match(/(\d+):(\d+)-(\d+):(\d+)/);

  if (!result) {
    return null;
  }

  const [, startChapter, startVerse, endChapter, endVerse] = result;

  if (!startChapter || !startVerse || !endChapter || !endVerse) {
    return null;
  }

  const parse = value => (parseAsNumbers ? Number(value) : value);

  return [
    {
      chapter: parse(startChapter),
      verse: parse(startVerse),
      verseKey: `${startChapter}:${startVerse}`,
    },
    {
      chapter: parse(endChapter),
      verse: parse(endVerse),
      verseKey: `${endChapter}:${endVerse}`,
    },
  ];
};
