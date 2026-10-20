import TrackPlayer from "react-native-track-player";

module.exports = async function () {
  TrackPlayer.addEventListener("remote-play", () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener("remote-pause", () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener("remote-next", () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener("remote-previous", () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener("remote-jump-forward", () => {
    TrackPlayer.seekBy(10);
  });

  TrackPlayer.addEventListener("remote-jump-backward", () => {
    TrackPlayer.seekBy(-10);
  });
};
