import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";

const KEY = "PLAYER_STATE";

export const savePlayerState = async () => {
  try {
    const queue = await TrackPlayer.getQueue();
    const index = await TrackPlayer.getActiveTrackIndex();
    const position = await TrackPlayer.getPosition();

    const data = {
      queue,
      index,
      position,
    };

    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {}
};

export const loadPlayerState = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};