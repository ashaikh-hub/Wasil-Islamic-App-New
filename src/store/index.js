import {create} from 'zustand';
import { devtools } from 'zustand/middleware';
import { configurePersist } from 'zustand-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { persist } = configurePersist({
  storage: AsyncStorage,
  rootKey: 'root',
});

const useStore = create(
  devtools(
    persist({ key: 'state' }, (set) => ({
      // state
      favourites: [],
      // actions
      addMovie: (movie) =>
        set((oldState) => ({...oldState, favourites: [...oldState.favourites, movie] })),
      deleteMovie: (movie) =>
        set((oldState) => ({...oldState, favourites: oldState.favourites.filter(({ _id }) => _id !== movie._id),
        })),
    }))
  )
);

export default useStore;
