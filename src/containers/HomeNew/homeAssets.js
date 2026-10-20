import {
  WasilBlueTQuranIcon, WasilBlueTDuaIcon, WasilBlueTHadithsIcon, WasilBlueTStoriesIcon, WasilBlueTTasbihIcon,
  WasilBlueTReciterIcon, WasilBlueTQiblaIcon, WasilBlueTPrayerIcon, WasilBlueTWudhuIcon, WasilBlueTMosqueIcon,
  WasilBlueTHijriCalendarSvg, WasilBlueTShahdahIcon, WasilBlueTReelIcon, WasilBlueTVideosIcon, WasilBlueTGreetingIcon,
  WasilGQuranIcon, WasilGDuaIcon, WasilGHadithsIcon, WasilGStoriesIcon, WasilGTasbihIcon,
  WasilGReciterIcon, WasilGQiblaIcon, WasilGPrayerIcon, WasilGWudhuIcon, WasilGMosqueIcon,
  WasilGHijriCalendarSvg, WasilGShahdahIcon, WasilGReelIcon, WasilGVideosIcon, WasilGGreetingIcon,
  WasilNewQuranIcon, WasilNewDuaIcon, WasilNewHadithsIcon, WasilNewStoriesIcon, WasilNewTasbihIcon,
  WasilNewReciterIcon, WasilNewQiblaIcon, WasilNewPrayerIcon, WasilNewWudhuIcon, WasilNewMosqueIcon,
  WasilHijriCalendarSvg, WasilNewShahdahIcon, WasilNewReelIcon, WasilNewVideosIcon, WasilNewGreetingIcon,
  WasilBlueTHomeLocation, WasilBlueGHomeLocation, WasilNewHomeLocation,
  WasilDUKBTSvg, WasilDUKGTSvg, WasilDidYouKnowSvg,
  WasilNewContinueReadingIcon, WasilNewContinueListenIcon, WasilNewGreenContReaIcon, WasilNewGreenContLinIcon,
} from '../../assets/icons';

const CLOUD = 'https://res.cloudinary.com/daof5pne5/image/upload';

// Quick-access tiles: label, route, and the icon for each theme [blue, green, white].
const TILES = [
  ['Quran', 'QuranMainDashboard', WasilBlueTQuranIcon, WasilGQuranIcon, WasilNewQuranIcon],
  ['Dua', 'DuasScreen', WasilBlueTDuaIcon, WasilGDuaIcon, WasilNewDuaIcon],
  ['Hadiths', 'HadithsBooksDashboard', WasilBlueTHadithsIcon, WasilGHadithsIcon, WasilNewHadithsIcon],
  ['Stories', 'IslamicStoriesScreen', WasilBlueTStoriesIcon, WasilGStoriesIcon, WasilNewStoriesIcon],
  ['Tasbih', 'Tasbih', WasilBlueTTasbihIcon, WasilGTasbihIcon, WasilNewTasbihIcon],
  ['Reciters', 'RecitersList', WasilBlueTReciterIcon, WasilGReciterIcon, WasilNewReciterIcon],
  ['Qibla', 'QiblaCompassNew', WasilBlueTQiblaIcon, WasilGQiblaIcon, WasilNewQiblaIcon],
  ['Prayer', 'PrayerGuide', WasilBlueTPrayerIcon, WasilGPrayerIcon, WasilNewPrayerIcon],
  ['Wudhu', 'AblutionNew', WasilBlueTWudhuIcon, WasilGWudhuIcon, WasilNewWudhuIcon],
  ['Mosque', 'PrayerMosque', WasilBlueTMosqueIcon, WasilGMosqueIcon, WasilNewMosqueIcon],
  ['Calendar', 'CalendarScreen', WasilBlueTHijriCalendarSvg, WasilGHijriCalendarSvg, WasilHijriCalendarSvg],
  ['Shahadah', 'ShahadahNew', WasilBlueTShahdahIcon, WasilGShahdahIcon, WasilNewShahdahIcon],
  ['Reels', 'ReelsNew', WasilBlueTReelIcon, WasilGReelIcon, WasilNewReelIcon],
  ['Videos', 'VideoDashboard', WasilBlueTVideosIcon, WasilGVideosIcon, WasilNewVideosIcon],
  ['Greeting', 'GreetingsNew', WasilBlueTGreetingIcon, WasilGGreetingIcon, WasilNewGreetingIcon],
];
const THEME_INDEX = { blue: 2, green: 3, white: 4 };

export const quickTiles = (theme) => TILES.map((t) => ({ label: t[0], screen: t[1], Icon: t[THEME_INDEX[theme] || 4] }));

export const HOME_ART = {
  blue: {
    banner: { uri: `${CLOUD}/v1785227661/homebannerbluetheme.png` },
    didYouKnowBg: { uri: `${CLOUD}/v1776942424/home/homeduabg.png` },
    LocationIcon: WasilBlueTHomeLocation,
    DidYouKnowIcon: WasilDUKBTSvg,
    ReadIcon: WasilNewContinueReadingIcon,
    ListenIcon: WasilNewContinueListenIcon,
  },
  green: {
    banner: { uri: `${CLOUD}/v1786451285/homebannergreentheme.png` },
    didYouKnowBg: { uri: `${CLOUD}/v1786486561/home/homeduabggreen.png` },
    LocationIcon: WasilBlueGHomeLocation,
    DidYouKnowIcon: WasilDUKGTSvg,
    ReadIcon: WasilNewGreenContReaIcon,
    ListenIcon: WasilNewGreenContLinIcon,
  },
  white: {
    banner: { uri: `${CLOUD}/v1784408939/homebannersecond.png` },
    didYouKnowBg: { uri: `${CLOUD}/v1776942424/home/dukbg.png` },
    LocationIcon: WasilNewHomeLocation,
    DidYouKnowIcon: WasilDidYouKnowSvg,
    ReadIcon: WasilNewContinueReadingIcon,
    ListenIcon: WasilNewContinueListenIcon,
  },
};
