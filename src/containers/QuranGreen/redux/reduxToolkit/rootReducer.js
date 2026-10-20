import {combineReducers} from 'redux';
import servicesSlice from './store/servicesSlice';
import recitersDataList from './store/recitersDataList';
import chapterAudioList from './store/chapterAudioList';

const rootReducer = combineReducers({
  services: servicesSlice,
  reciters: recitersDataList,
  audioList: chapterAudioList,
});

export default rootReducer;
