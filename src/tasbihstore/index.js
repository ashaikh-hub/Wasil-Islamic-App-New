import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BG_MAP = {
  "cloud-bg": require("../assets/cloud-bg.png"),
  "cloud-bg1": require("../assets/cloud-bg1.png"),
  "cloud-bg2": require("../assets/cloud-bg2.png"),
  "cloud-bg3": require("../assets/cloud-bg3.png"),
  "cloud-bg4": require("../assets/cloud-bg4.png"),
  "cloud-bg5": require("../assets/cloud-bg5.png"),
};

const useStoreTasbih = create(
  devtools(
    persist(
      (set, get) => ({

        currentBgKey: "cloud-bg",

        favouritestasbih: [],

        setCurrentBackground: (key) => {
          if (!BG_MAP[key]) return;
          set({ currentBgKey: key });
        },

        getCurrentBackgroundImage: () => {
          const key = get().currentBgKey;
          return BG_MAP[key] || BG_MAP["cloud-bg"];
        },
        addTasbih: (tasbih) => {
          const { favouritestasbih, currentBgKey } = get();

          const exists = favouritestasbih.some(
            item => item._id === tasbih._id
          );
          if (exists) return;

          set({
            favouritestasbih: [
              ...favouritestasbih,
              {
                ...tasbih,
                bgKey: currentBgKey,
              },
            ],
          });
        },

        deleteTasbih: (tasbih) => {
          set({
            favouritestasbih: get().favouritestasbih.filter(
              item => item._id !== tasbih._id
            ),
          });
        },
      }),
      {
        name: 'tasbih-store',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

export default useStoreTasbih;
