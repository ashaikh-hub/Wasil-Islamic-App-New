import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  chapterAudioList: [],
};

const resitersDataList = createSlice({
  name: 'audioList',
  initialState,

  reducers: {
    setChapterAudioList: (state, action) => {
      state.chapterAudioList = action.payload;
    },
  },
});

export const {setChapterAudioList} = resitersDataList.actions;

export default resitersDataList.reducer;
