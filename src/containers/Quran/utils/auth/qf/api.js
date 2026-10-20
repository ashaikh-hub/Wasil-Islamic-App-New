import {
  makeFollowUserUrl,
  makeGetUserReflectionsUrl,
  makePostReflectionViewsUrl,
  makeIsUserFollowedUrl,
  makeQuranicCalendarPostOfWeekUrl,
} from './apiPaths';

import {postRequest, privateFetcher} from '../api';

export const postReflectionViews = async postId =>
  postRequest(makePostReflectionViewsUrl(postId));

export const followUser = async usernameOrId =>
  postRequest(makeFollowUserUrl(usernameOrId));

export const isUserFollowed = async usernameOrId => {
  return privateFetcher(makeIsUserFollowedUrl(usernameOrId));
};

export const getAllUserReflections = async params => {
  return privateFetcher(makeGetUserReflectionsUrl(params));
};

export const getQuranicCalendarPostOfWeek = async weekNumber => {
  return privateFetcher(makeQuranicCalendarPostOfWeekUrl(weekNumber));
};
