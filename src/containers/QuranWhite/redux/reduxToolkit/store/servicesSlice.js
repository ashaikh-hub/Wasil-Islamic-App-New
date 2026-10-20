import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  chapterDetail: [],
  selectedSurahItem: '',
  juzList: [],
  verseList: [],
  pagesList: [],
  pageLayout: 'VERSE',
  pageTheme: 'DEFAULT',
  isVisible: false,
  isSpeedCounting: 1,
  isArabic: true,
  isTranslation: true,
  isTransliteration: true,
  arabicFontSize: 26,
  translationFontSize: 12,
  isArabicFont: {
    id: 1,
    key: 'arabic_Indopak',
    fontTitle: 'IndoPak',
  },
  translationList: 85,
  transliterationList: 85,
  translationLanguage: {_index: 0, id: 1, language: 'english', name: 'English'},
  transliterationLanguage: {
    _index: 0,
    id: 1,
    language: 'english',
    name: 'English',
  },
  tafseerLanguage: {_index: 0, id: 1, name: 'English', language: 'english'},
  tafseerAuthor: [],
  isTrackEnded: false,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,

  reducers: {
    setChapterDetail: (state, action) => {
      state.chapterDetail = action.payload;
    },
    setSelectedSurahItem: (state, action) => {
      state.selectedSurahItem = action.payload;
    },
    setJuzList: (state, action) => {
      state.juzList = action.payload;
    },
    setVerseList: (state, action) => {
      state.verseList = action.payload;
    },
    setPagesList: (state, action) => {
      state.pagesList = action.payload;
    },

    setPageLayout: (state, action) => {
      state.pageLayout = action.payload;
    },
    setPageTheme: (state, action) => {
      state.pageTheme = action.payload;
    },

    setArabicFontSize: (state, action) => {
      state.arabicFontSize = action.payload;
    },
    setTranslationFontSize: (state, action) => {
      state.translationFontSize = action.payload;
    },
    setVisible: (state, action) => {
      state.isVisible = action.payload;
    },
    setSpeedCounting: (state, action) => {
      state.isSpeedCounting = action.payload;
    },
    setArabic: (state, action) => {
      state.isArabic = action.payload;
    },
    setTranslation: (state, action) => {
      state.isTranslation = action.payload;
    },
    setTransliteration: (state, action) => {
      state.isTransliteration = action.payload;
    },
    setTranslationList: (state, action) => {
      state.translationList = action.payload;
    },
    setTranslationLanguage: (state, action) => {
      state.translationLanguage = action.payload;
    },
    setTransliterationList: (state, action) => {
      state.transliterationList = action.payload;
    },
    setTransliterationLanguage: (state, action) => {
      state.transliterationLanguage = action.payload;
    },
    setArabicFont: (state, action) => {
      state.isArabicFont = action.payload;
    },
    setTafseerLanguage: (state, action) => {
      state.tafseerLanguage = action.payload;
    },
    setTafseerAuthor: (state, action) => {
      state.tafseerAuthor = action.payload;
    },
    setTrackEnded: (state, action) => {
      state.isTrackEnded = action.payload;
    },
  },
});

export const {
  setChapterDetail,
  setSelectedSurahItem,
  setJuzList,
  setVerseList,
  setPagesList,
  setPageLayout,
  setPageTheme,
  setVisible,
  setArabicFontSize,
  setTranslationFontSize,
  setSpeedCounting,
  setArabic,
  setTranslation,
  setTransliteration,
  setTranslationList,
  setTranslationLanguage,
  setTransliterationList,
  setTransliterationLanguage,
  setArabicFont,
  setTafseerLanguage,
  setTafseerAuthor,
  setTrackEnded,
} = servicesSlice.actions;

export default servicesSlice.reducer;
