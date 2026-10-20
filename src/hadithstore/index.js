import {create} from 'zustand';
import { devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configurePersist } from 'zustand-persist';

const { persist } = configurePersist({
  storage: AsyncStorage,
  rootKey: 'root',
});

const useStorehadith = create(
  devtools(
    persist({ key: 'state' }, (set) => ({
      // state
      favouriteshadith: [],
      // actions
      addhadith: (hadith) =>
        set((oldState) => ({...oldState, favouriteshadith: [...oldState.favouriteshadith, hadith] })),
      deletehadith: (hadith) =>
        set((oldState) => ({...oldState, favouriteshadith: oldState.favouriteshadith.filter(({ id }) => id !== hadith.id),
        })),
    }))
  )
);

export default useStorehadith;
