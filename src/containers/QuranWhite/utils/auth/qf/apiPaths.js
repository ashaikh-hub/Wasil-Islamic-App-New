import {makeUrl} from '../apiPaths';

const getPrefixedUrl = url => `qf/${url}`;

export const makePostReflectionViewsUrl = postId =>
  makeUrl(getPrefixedUrl(`posts/${postId}/views`));

export const makeFollowUserUrl = userNameOrId =>
  makeUrl(getPrefixedUrl(`users/${userNameOrId}/follow`));

export const makeIsUserFollowedUrl = userNameOrId =>
  makeUrl(getPrefixedUrl(`users/${userNameOrId}/is-followed`));

export const makeGetUserReflectionsUrl = params =>
  makeUrl(getPrefixedUrl('posts'), params);

export const makeQuranicCalendarPostOfWeekUrl = weekNumber =>
  makeUrl(getPrefixedUrl(`quranic-calendar/${weekNumber}`));
