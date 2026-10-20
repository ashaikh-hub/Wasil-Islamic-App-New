import stringify from '../qs-stringify';

import {getAuthApiPath} from '../url';

export const makeUrl = (url, parameters) => {
  if (!parameters) {
    return getAuthApiPath(url);
  }
  return getAuthApiPath(`${url}${`?${stringify(parameters)}`}`);
};

export const makeUserProfileUrl = () => makeUrl('users/profile');

export const makeUserFeatureFlagsUrl = () => makeUrl('feature-flags');

export const makeUserConsentsUrl = () => makeUrl('consent/userConsents');

export const makeCompleteSignupUrl = () => makeUrl('users/completeSignup');

export const makeCompleteAnnouncementUrl = () =>
  makeUrl('users/completeAnnouncement');

export const makeDeleteAccountUrl = () => makeUrl('users/deleteAccount');

export const makeSyncLocalDataUrl = () => makeUrl('users/syncLocalData');

export const makeVerificationCodeUrl = () => makeUrl('users/verificationCode');

export const makeSendMagicLinkUrl = redirect =>
  makeUrl('auth/magiclogin', redirect ? {redirect} : undefined);

export const makeGoogleLoginUrl = redirect =>
  makeUrl('auth/google', redirect ? {redirect} : undefined);

export const makeFacebookLoginUrl = redirect =>
  makeUrl('auth/facebook', redirect ? {redirect} : undefined);

export const makeAppleLoginUrl = redirect =>
  makeUrl('auth/apple', redirect ? {redirect} : undefined);

export const makeBookmarksUrl = (mushafId, limit) =>
  makeUrl('bookmarks', {mushafId, limit});

export const makeCollectionsUrl = queryParams =>
  makeUrl('collections', queryParams);

export const makeAddCollectionUrl = () => makeUrl('collections');

export const makeGetNotesByVerseUrl = verseKey =>
  makeUrl(`notes/by-verse/${verseKey}`);

export const makeGetNoteByIdUrl = id => makeUrl(`notes/${id}`);

export const makeCountNotesWithinRangeUrl = (startVerseKey, endVerseKey) =>
  makeUrl(`notes/count-within-range`, {from: startVerseKey, to: endVerseKey});

export const makeNotesUrl = params => makeUrl('notes', params);

export const makeGetNoteByAttachedEntityUrl = queryParams =>
  makeUrl(`notes`, queryParams);

export const makeDeleteOrUpdateNoteUrl = id => makeUrl(`notes/${id}`);

export const makePublishNoteUrl = id => makeUrl(`notes/${id}/publish`);

export const makeGetCoursesUrl = params => makeUrl('courses', params);

export const makeGetCourseUrl = courseSlugOrId =>
  makeUrl(`courses/${courseSlugOrId}`);

export const makeGetLessonUrlPrefix = courseSlugOrId =>
  makeUrl(`courses/${courseSlugOrId}/lessons`);

export const makeGetLessonUrl = (courseSlugOrId, lessonSlugOrId) =>
  `${makeGetLessonUrlPrefix(courseSlugOrId)}/${lessonSlugOrId}`;

export const makeEnrollUserUrl = () => makeUrl('courses/enroll');
export const makeGetUserCoursesCountUrl = () => makeUrl('courses/count');

export const makeCourseFeedbackUrl = courseId =>
  makeUrl(`courses/${courseId}/feedback`);

export const makeUpdateCollectionUrl = collectionId =>
  makeUrl(`collections/${collectionId}`);

export const makeDeleteCollectionUrl = collectionId =>
  makeUrl(`collections/${collectionId}`);

export const makeAddCollectionBookmarkUrl = collectionId =>
  makeUrl(`collections/${collectionId}/bookmarks`);

export const makeDeleteCollectionBookmarkByIdUrl = (collectionId, bookmarkId) =>
  makeUrl(`collections/${collectionId}/bookmarks/${bookmarkId}`);

export const makeDeleteCollectionBookmarkByKeyUrl = collectionId =>
  makeUrl(`collections/${collectionId}/bookmarks`);

export const makePostReflectionViewsUrl = postId =>
  makeUrl(`posts/${postId}/views`);

export const makeBookmarkCollectionsUrl = (mushafId, key, type, verseNumber) =>
  makeUrl('bookmarks/collections', {
    mushafId,
    key,
    type,
    ...(verseNumber && {verseNumber}),
  });

export const makeGetBookmarkByCollectionId = (collectionId, queryParams) =>
  makeUrl(`collections/${collectionId}`, queryParams);

export const makeAllCollectionsItemsUrl = queryParams =>
  makeUrl(`collections/all`, queryParams);

export const makeDeleteBookmarkUrl = bookmarkId =>
  makeUrl(`bookmarks/${bookmarkId}`);

export const makeBookmarksRangeUrl = (
  mushafId,
  chapterNumber,
  verseNumber,
  perPage,
) =>
  makeUrl('bookmarks/ayahs-range', {
    mushafId,
    chapterNumber,
    verseNumber,
    perPage,
  });

export const makeBookmarkUrl = (mushafId, key, type, verseNumber) =>
  makeUrl('bookmarks/bookmark', {
    mushafId,
    key,
    type,
    ...(verseNumber && {verseNumber}),
  });

export const makeReadingSessionsUrl = () => makeUrl('reading-sessions');

export const makeActivityDaysUrl = params => makeUrl('activity-days', params);

export const makeFilterActivityDaysUrl = params =>
  makeUrl('activity-days/filter', params);

export const makeEstimateRangesReadingTimeUrl = params =>
  makeUrl('activity-days/estimate-reading-time', {
    ranges: params.ranges.join(','),
  });

export const makeGoalUrl = params => makeUrl('goal', params);

export const makeEstimateReadingGoalUrl = data =>
  makeUrl('goal/estimate', data);

export const makeStreakUrl = params => makeUrl('streak', params);

export const makeReadingGoalProgressUrl = mushafId =>
  makeUrl('goal/status', {
    mushafId,
  });

export const makeUserPreferencesUrl = mushafId =>
  makeUrl(
    'preferences',
    mushafId && {
      mushafId,
    },
  );

export const makeUserBulkPreferencesUrl = mushafId =>
  makeUrl('preferences/bulk', {
    mushafId,
  });

export const makeLogoutUrl = () => makeUrl('auth/logout');

export const makeRefreshTokenUrl = () => makeUrl('tokens/refreshToken');
