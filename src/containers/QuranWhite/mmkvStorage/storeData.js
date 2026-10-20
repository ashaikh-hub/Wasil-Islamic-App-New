import {storage} from './mmkvStore';

export const setStorageItem = (key, data) => {
  storage.set(key, JSON.stringify(data));
};

export const getStorageItem = key => {
  const itemJSON = storage.getString(key);
  return itemJSON ? JSON.parse(itemJSON) : [];
};
