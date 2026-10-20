export const formatCalendarData = (data) => {
  if (!data || data.length === 0) return [];

  const formatted = data.map((item) => ({
    gregorianDate: item.date.gregorian.date,
    day: parseInt(item.date.gregorian.day, 10),
    weekday: item.date.gregorian.weekday.en,

    hijriDate: parseInt(item.date.hijri.day, 10),
    hijriMonth: item.date.hijri.month.en,
    hijriMonthNumber: item.date.hijri.month.number,
    hijriYear: item.date.hijri.year,
  }));

  const weekMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const emptySlots = weekMap[formatted[0]?.weekday] ?? 0;

  const padded = Array.from({ length: emptySlots }, (_, i) => ({ empty: true, id: `empty-${i}` }));
  const cells = [...padded, ...formatted];
  // Pad the last week so every row has 7 cells.
  while (cells.length % 7 !== 0) cells.push({ empty: true, id: `empty-end-${cells.length}` });
  return cells;
};

export const isToday = (dateStr) => {
  if (!dateStr) return false;
  const [day, month, year] = dateStr.split('-').map(Number);
  if (!day || !month || !year) return false;
  const today = new Date();
  return day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
};

export const isFriday = (weekday) => weekday?.toLowerCase() === 'friday';

export const isRamadan = (hijriMonth) => hijriMonth === 9;

// Key dates in the Hijri calendar, keyed by "month-day".
const ISLAMIC_EVENTS = {
  '1-1': 'Islamic New Year',
  '1-10': 'Day of Ashura',
  '3-12': 'Mawlid an-Nabi',
  '7-27': "Isra' and Mi'raj",
  '8-15': "Laylat al-Bara'ah",
  '9-1': 'First day of Ramadan',
  '9-27': 'Laylat al-Qadr (27th night)',
  '10-1': 'Eid ul Fitr',
  '12-9': 'Day of Arafah',
  '12-10': 'Eid ul Adha',
};

export const getIslamicEvent = (hijriDay, hijriMonth) =>
  hijriDay && hijriMonth ? ISLAMIC_EVENTS[`${hijriMonth}-${hijriDay}`] || null : null;

// "Rabi al-Awwal – Rabi al-Thani 1448" for months that span two Hijri months.
export const getHijriRange = (cells) => {
  const days = cells.filter((c) => !c.empty);
  if (!days.length) return '';
  const first = days[0];
  const last = days[days.length - 1];
  if (first.hijriMonth === last.hijriMonth) return `${first.hijriMonth} ${first.hijriYear}`;
  if (first.hijriYear === last.hijriYear) return `${first.hijriMonth} – ${last.hijriMonth} ${last.hijriYear}`;
  return `${first.hijriMonth} ${first.hijriYear} – ${last.hijriMonth} ${last.hijriYear}`;
};

export const getGregorianMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthNumber - 1] || '';
};
