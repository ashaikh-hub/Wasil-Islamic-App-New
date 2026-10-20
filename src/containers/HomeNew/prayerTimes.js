import moment from 'moment';

export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const at = (base, hhmm) => {
  const [h, m] = String(hhmm).split(':').map((x) => parseInt(x, 10));
  return moment(base).hours(h).minutes(m).seconds(0).milliseconds(0);
};

// Current and next prayer for `now`, rolling over to tomorrow's Fajr after Isha.
export const prayerWindow = (timings, now = moment()) => {
  const today = PRAYERS.filter((p) => timings?.[p]).map((p) => ({ name: p, time: timings[p], at: at(now, timings[p]) }));
  if (!today.length) return null;
  let currentIdx = -1;
  today.forEach((p, i) => {
    if (!p.at.isAfter(now)) currentIdx = i;
  });
  const current = currentIdx >= 0 ? today[currentIdx] : { ...today[today.length - 1], at: today[today.length - 1].at.clone().subtract(1, 'day') };
  const next = currentIdx + 1 < today.length ? today[currentIdx + 1] : { ...today[0], at: today[0].at.clone().add(1, 'day') };
  return { current, next };
};

export const formatTime12 = (hhmm) => (hhmm ? moment(hhmm, 'HH:mm').format('h:mm A') : '');

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

// Applies the user's Hijri day offset (Settings → Hijri Dates Adjustment) to the API's Hijri date.
export const adjustedHijri = (hijri, offset = 0) => {
  let day = parseInt(hijri.day, 10);
  let month = parseInt(hijri.month.number, 10);
  let year = parseInt(hijri.year, 10);
  const daysIn = (m) => (m % 2 === 1 ? 30 : 29);
  for (let n = offset; n > 0; n--) {
    day += 1;
    if (day > daysIn(month)) {
      day = 1;
      month = month === 12 ? 1 : month + 1;
      if (month === 1) year += 1;
    }
  }
  for (let n = offset; n < 0; n++) {
    day -= 1;
    if (day < 1) {
      month = month === 1 ? 12 : month - 1;
      if (month === 12) year -= 1;
      day = daysIn(month);
    }
  }
  return `${day} ${HIJRI_MONTHS[month - 1]} ${year}`;
};
