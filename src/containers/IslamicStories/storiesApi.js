import axios from 'axios';

const BASE = 'https://islamicapp.vercel.app/api';
const get = async (path, params) => (await axios.get(`${BASE}/${path}`, { params })).data || [];

export const fetchAllStories = () => get('allislamicstory');
export const fetchCategories = () => get('islamiccategories');
export const fetchStoriesByCategory = (categoryId) => get('islsubcategories', { categoryId });
export const fetchStoryLibrary = () => get('allislsubcategory');
export const fetchStory = async (storyId) => (await get('islamicstorybystoryid', { storyId }))[0] || null;
export const fetchStoryAudios = (storyId) => get('islamicstoryaudiosbystoryid', { storyId });

// The API stores flags as the strings "true"/"false".
export const isFlag = (value) => value === true || value === 'true';

// Stories from the home feed carry `storyId`; library/category items use their own `_id`.
export const storyIdOf = (item) => item.storyId || item._id;
