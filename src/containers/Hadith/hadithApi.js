import axios from 'axios';

const API_KEY = '$2y$10$qSQzGL8GxgFsxQDqeb7MMe9mzdAfCNf2dOorH6mokC70Unhfli';
const BASE = 'https://hadithapi.com/api';
const HIDDEN_BOOK_IDS = [9, 10];

export const fetchHadithBooks = async () => {
  const { data } = await axios.get(`${BASE}/books`, { params: { apiKey: API_KEY } });
  return (data?.books || []).filter((book) => !HIDDEN_BOOK_IDS.includes(book.id));
};

export const fetchChapters = async (bookSlug) => {
  const { data } = await axios.get(`${BASE}/${bookSlug}/chapters`, { params: { apiKey: API_KEY } });
  return data?.chapters || [];
};

// Returns { items, page, lastPage } for one page of hadiths in a chapter.
export const fetchHadiths = async (bookSlug, chapterNumber, page = 1) => {
  const { data } = await axios.get(`${BASE}/hadiths`, {
    params: { book: bookSlug, chapter: chapterNumber, paginate: 25, page, apiKey: API_KEY },
  });
  const p = data?.hadiths || {};
  return { items: p.data || [], page: p.current_page || page, lastPage: p.last_page || page };
};

// "Revelation (Kitab al-Wahy)" -> "Revelation"
export const shortChapterTitle = (text = '', maxWords = 5) => {
  const cleaned = text.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  const words = cleaned.split(/\s+/);
  return words.length > maxWords ? `${words.slice(0, maxWords).join(' ')}…` : cleaned;
};
