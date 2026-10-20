import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Returns the Aladhan month (array of days). Throws on network/API failure so the
// screen can show an error state instead of an empty grid.
export const getMonthlyCalendar = async (year, month) => {
  const [lat, lon, offset] = await Promise.all([
    AsyncStorage.getItem('ONLATI'),
    AsyncStorage.getItem('ONLONGI'),
    AsyncStorage.getItem('HIJRI_OFFSET'),
  ]);
  const adjustment = parseInt(offset, 10) || 0;
  const res = await axios.get(`https://api.aladhan.com/v1/calendar/${year}/${month}`, {
    params: {
      latitude: lat || '24.8607',
      longitude: lon || '67.0011',
      method: 2,
      adjustment, // same Hijri offset the user set in Settings → Hijri Dates Adjustment
    },
  });
  return res.data.data;
};
