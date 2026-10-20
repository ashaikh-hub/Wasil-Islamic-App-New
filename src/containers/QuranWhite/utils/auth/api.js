/* eslint-disable max-lines */
import {configureRefreshFetch} from 'refresh-fetch';
import {getTimezone} from '../datetime';
import {ActivityDayType} from '../../../src/types/auth/ActivityDay';
import {
  makeBookmarksUrl,
  makeCompleteSignupUrl,
  makeUserProfileUrl,
  makeDeleteAccountUrl,
  makeBookmarksRangeUrl,
  makeBookmarkUrl,
  makeReadingSessionsUrl,
  makeUserPreferencesUrl,
  makeVerificationCodeUrl,
  makeUserBulkPreferencesUrl,
  makeLogoutUrl,
  makeCompleteAnnouncementUrl,
  makeSyncLocalDataUrl,
  makeRefreshTokenUrl,
  makeCollectionsUrl,
  makeGetBookmarkByCollectionId,
  makeAddCollectionUrl,
  makeBookmarkCollectionsUrl,
  makeUpdateCollectionUrl,
  makeDeleteCollectionUrl,
  makeAddCollectionBookmarkUrl,
  makeDeleteCollectionBookmarkByIdUrl,
  makeDeleteCollectionBookmarkByKeyUrl,
  makeDeleteBookmarkUrl,
  makeActivityDaysUrl,
  makeGoalUrl,
  makeFilterActivityDaysUrl,
  makeStreakUrl,
  makeEstimateRangesReadingTimeUrl,
  makeUserFeatureFlagsUrl,
  makeUserConsentsUrl,
  makeNotesUrl,
  makeDeleteOrUpdateNoteUrl,
  makeCountNotesWithinRangeUrl,
  makeEnrollUserUrl,
  makeGetCoursesUrl,
  makeGetCourseUrl,
  makePublishNoteUrl,
  makeCourseFeedbackUrl,
  makeGetUserCoursesCountUrl,
} from '../../utils/auth/apiPaths';
import {fetcher} from '../../../src/api';

const handleErrors = async res => {
  const body = await res.json();
  throw new Error(body?.message);
};

export const postRequest = (url, requestData) =>
  privateFetcher(url, {
    method: 'POST',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(requestData),
  });

const deleteRequest = (url, requestData) =>
  privateFetcher(url, {
    method: 'DELETE',
    ...(requestData && {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestData),
    }),
  });

const patchRequest = (url, requestData) =>
  privateFetcher(url, {
    method: 'PATCH',
    ...(requestData && {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestData),
    }),
  });

export const getUserProfile = async () => privateFetcher(makeUserProfileUrl());

export const getUserFeatureFlags = async () =>
  privateFetcher(makeUserFeatureFlagsUrl());

export const refreshToken = async () => privateFetcher(makeRefreshTokenUrl());

export const completeSignup = async data =>
  postRequest(makeCompleteSignupUrl(), data);

export const completeAnnouncement = async data => {
  return postRequest(makeCompleteAnnouncementUrl(), data);
};

export const updateUserConsent = async data => {
  return postRequest(makeUserConsentsUrl(), data);
};

export const deleteAccount = async () => deleteRequest(makeDeleteAccountUrl());

export const addBookmark = async (key, mushafId, type, verseNumber) =>
  postRequest(makeBookmarksUrl(mushafId), {
    key,
    mushaf: mushafId,
    type,
    verseNumber,
  });

export const getPageBookmarks = async (
  mushafId,
  chapterNumber,
  verseNumber,
  perPage,
) =>
  privateFetcher(
    makeBookmarksRangeUrl(mushafId, chapterNumber, verseNumber, perPage),
  );

export const getBookmark = async (mushafId, key, type, verseNumber) =>
  privateFetcher(makeBookmarkUrl(mushafId, key, type, verseNumber));

export const getBookmarkCollections = async (
  mushafId,
  key,
  type,
  verseNumber,
) =>
  privateFetcher(makeBookmarkCollectionsUrl(mushafId, key, type, verseNumber));

export const addReadingGoal = async ({mushafId, category, ...data}) =>
  postRequest(makeGoalUrl({mushafId, type: category}), data);

export const updateReadingGoal = async ({mushafId, category, ...data}) =>
  patchRequest(makeGoalUrl({mushafId, type: category}), data);

export const deleteReadingGoal = async params =>
  deleteRequest(makeGoalUrl({type: params.category}));

export const filterReadingDays = async params =>
  privateFetcher(makeFilterActivityDaysUrl(params));

export const getActivityDay = async type =>
  privateFetcher(makeActivityDaysUrl({type}));

export const addReadingSession = async (chapterNumber, verseNumber) =>
  postRequest(makeReadingSessionsUrl(), {
    chapterNumber,
    verseNumber,
  });

export const updateActivityDay = async params => {
  if (params.type === ActivityDayType.QURAN) {
    const {mushafId, type, ...body} = params;
    return postRequest(makeActivityDaysUrl({mushafId, type}), body);
  }
  const {type, ...body} = params;
  return postRequest(makeActivityDaysUrl({type}), body);
};

export const estimateRangesReadingTime = async body => {
  return privateFetcher(makeEstimateRangesReadingTimeUrl(body));
};

export const getStreakWithUserMetadata = async params =>
  privateFetcher(makeStreakUrl(params));

export const syncUserLocalData = async payload =>
  postRequest(makeSyncLocalDataUrl(), payload);

export const getUserPreferences = async () => {
  const userPreferences = await privateFetcher(makeUserPreferencesUrl());
  return userPreferences;
};

export const addOrUpdateUserPreference = async (key, value, group, mushafId) =>
  postRequest(makeUserPreferencesUrl(mushafId), {
    key,
    value,
    group,
  });

export const getCollectionsList = async queryParams => {
  return privateFetcher(makeCollectionsUrl(queryParams));
};

export const updateCollection = async (collectionId, {name}) => {
  return postRequest(makeUpdateCollectionUrl(collectionId), {name});
};

export const deleteCollection = async collectionId => {
  return deleteRequest(makeDeleteCollectionUrl(collectionId));
};

export const addCollectionBookmark = async (
  collectionId,
  key,
  mushaf,
  type,
  verseNumber,
) => {
  return postRequest(makeAddCollectionBookmarkUrl(collectionId), {
    collectionId,
    key,
    mushaf,
    type,
    verseNumber,
  });
};

export const deleteCollectionBookmarkById = async (
  collectionId,
  bookmarkId,
) => {
  return deleteRequest(
    makeDeleteCollectionBookmarkByIdUrl(collectionId, bookmarkId),
  );
};

export const deleteCollectionBookmarkByKey = async ({
  collectionId,
  key,
  mushaf,
  type,
  verseNumber,
}) => {
  return deleteRequest(makeDeleteCollectionBookmarkByKeyUrl(collectionId), {
    collectionId,
    key,
    mushaf,
    type,
    verseNumber,
  });
};

export const deleteBookmarkById = async bookmarkId => {
  return deleteRequest(makeDeleteBookmarkUrl(bookmarkId));
};

export const getBookmarksByCollectionId = async (collectionId, queryParams) => {
  return privateFetcher(
    makeGetBookmarkByCollectionId(collectionId, queryParams),
  );
};

export const enrollUser = async courseId =>
  postRequest(makeEnrollUserUrl(), {
    courseId,
  });

export const postCourseFeedback = async (courseId, rating, body) =>
  postRequest(makeCourseFeedbackUrl(courseId), {
    rating,
    body,
  });

export const getCourses = async () => privateFetcher(makeGetCoursesUrl());

export const getCourse = async courseSlugOrId =>
  privateFetcher(makeGetCourseUrl(courseSlugOrId));

export const getUserCoursesCount = async () =>
  privateFetcher(makeGetUserCoursesCountUrl());

export const addCollection = async collectionName => {
  return postRequest(makeAddCollectionUrl(), {name: collectionName});
};

export const getAllNotes = async params => {
  return privateFetcher(makeNotesUrl(params));
};

export const countNotesWithinRange = async (from, to) => {
  return privateFetcher(makeCountNotesWithinRangeUrl(from, to));
};

export const addNote = async payload => {
  return postRequest(makeNotesUrl(), payload);
};

export const publishNoteToQR = async (noteId, payload) =>
  postRequest(makePublishNoteUrl(noteId), payload);

export const updateNote = async (id, body, saveToQR) =>
  patchRequest(makeDeleteOrUpdateNoteUrl(id), {
    body,
    saveToQR,
  });

export const deleteNote = async id =>
  deleteRequest(makeDeleteOrUpdateNoteUrl(id));

export const requestVerificationCode = async emailToVerify => {
  return postRequest(makeVerificationCodeUrl(), {email: emailToVerify});
};
export const addOrUpdateBulkUserPreferences = async (preferences, mushafId) =>
  postRequest(makeUserBulkPreferencesUrl(mushafId), preferences);

export const logoutUser = async () => {
  return postRequest(makeLogoutUrl(), {});
};

const shouldRefreshToken = error => {
  return error?.message === 'must refresh token';
};

export const withCredentialsFetcher = async (input, init) => {
  try {
    const data = await fetcher(input, {
      ...init,
      credentials: 'include',
      headers: {
        ...init?.headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'x-timezone': getTimezone(),
      },
    });
    return data;
  } catch (error) {
    await handleErrors(error);
    return null;
  }
};

export const privateFetcher = configureRefreshFetch({
  shouldRefreshToken,
  // @ts-ignore
  refreshToken,
  fetch: withCredentialsFetcher,
});
