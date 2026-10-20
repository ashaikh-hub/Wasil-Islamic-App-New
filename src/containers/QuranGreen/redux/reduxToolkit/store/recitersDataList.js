import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  recitersDetaList: [],
};

const resitersDataList = createSlice({
  name: 'reciters',
  initialState,

  reducers: {
    setRecitersDataList: (state, action) => {
      state.recitersDetaList = action.payload;
    },
  },
});

export const {setRecitersDataList} = resitersDataList.actions;

export default resitersDataList.reducer;
