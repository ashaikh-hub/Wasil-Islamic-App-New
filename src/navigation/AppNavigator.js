import React from 'react';
import { useTheme, headerOptions } from "../theme";
import themedScreen from './themedScreen';
import { HeaderFavouritesButton } from '../components';
import {View,TouchableOpacity,Platform} from 'react-native';
import {WasilNewHeartfilledBTSVG,WasilNewBTTasbihHeartUnFilled,WasilNewBTSettingSvg,WasilNewBTTranslateSvg,HeartfilledSVG,WasilNewTasbihHeartUnFilled,QuranBottomSettingWhiteSVG,WasilNewTranslateWhiteSvg} from '../assets/icons';
import useStore from '../store'
import useStorehadith from '../hadithstore';
import useStoreTasbih from '../tasbihstore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Home and Navigation Drawer
import GuestDrawerNew from '../containers/Drawer/guestdrawernew';
import ThemeSetting from '../containers/Drawer/ThemeSetting';
import HomeNew from '../containers/HomeNew/HomeNew';
import AboutUs from '../containers/Drawer/AboutUs';
import RateFeedback from '../containers/Drawer/RateFeedback';
import ContactUs from '../containers/Drawer/ContactUs';
import FAQs from '../containers/Drawer/FAQs';
import Privacypolicy from '../containers/Drawer/Privacypolicy';
import FounderMsg from '../containers/Drawer/FounderMsg';
import HijriDates from '../containers/Drawer/HijriDates';

//Onboarding
import Onboarding from '../containers/onboarding/Onboarding';

//Quran Section
import Quran from '../containers/Quran/Quran';
import QuranMainDashboard from '../containers/Quran/screens/QuranMainDashboard';
import DashBoard from '../containers/Quran/screens/DashBoard';
import PageList from '../containers/Quran/screens/PageList';
import SurahFullView from '../containers/Quran/screens/SurahFullView';
import Setting from '../containers/Quran/screens/Setting';
import FullView from '../containers/Quran/screens/Setting/FullView';
import Favorite from '../containers/Quran/screens/Favorite';
import Bookmark from '../containers/Quran/screens/Bookmark';
import TranslatePage from '../containers/Quran/screens/TranslatePage';
import SurahDetailPage from '../containers/Quran/screens/SurahDetailPage';
import AddTafseer from '../containers/Quran/screens/AddTafseer';
import SurahBySurah from '../containers/Quran/screens/TranslationBySurah/SurahBySurah';
import TranslationSurah from '../containers/Quran/screens/TranslationBySurah/TranslationSurah';
import TranslationSettingsScreen from '../containers/Quran/screens/TranslationBySurah/TranslationSettingsScreen';
import TranslationSettingFont from '../containers/Quran/screens/TranslationBySurah/TranslationSettingFont';
import TafsirBySurah from '../containers/Quran/screens/TafsirBySurah/TafsirBySurah';
import TafsirSurah from '../containers/Quran/screens/TafsirBySurah/TafsirSurah';
import TafsirSettingsScreen from '../containers/Quran/screens/TafsirBySurah/TafsirSettingsScreen';
import TafsirSettingFont from '../containers/Quran/screens/TafsirBySurah/TafsirSettingFont';
import TranslatorDetail from '../containers/Quran/screens/ListenTranslation/TranslatorDetail';

import QuranWhite from '../containers/QuranWhite/Quran';
import QuranMainDashboardWhite from '../containers/QuranWhite/screens/QuranMainDashboard';
import DashBoardWhite from '../containers/QuranWhite/screens/DashBoard';
import PageListWhite from '../containers/QuranWhite/screens/PageList';
import SurahFullViewWhite from '../containers/QuranWhite/screens/SurahFullView';
import SettingWhite from '../containers/QuranWhite/screens/Setting';
import FullViewWhite from '../containers/QuranWhite/screens/Setting/FullView';
import FavoriteWhite from '../containers/QuranWhite/screens/Favorite';
import BookmarkWhite from '../containers/QuranWhite/screens/Bookmark';
import TranslatePageWhite from '../containers/QuranWhite/screens/TranslatePage';
import SurahDetailPageWhite from '../containers/QuranWhite/screens/SurahDetailPage';
import AddTafseerWhite from '../containers/QuranWhite/screens/AddTafseer';
import SurahBySurahWhite from '../containers/QuranWhite/screens/TranslationBySurah/SurahBySurah';
import TranslationSurahWhite from '../containers/QuranWhite/screens/TranslationBySurah/TranslationSurah';
import TranslationSettingsScreenWhite from '../containers/QuranWhite/screens/TranslationBySurah/TranslationSettingsScreen';
import TranslationSettingFontWhite from '../containers/QuranWhite/screens/TranslationBySurah/TranslationSettingFont';
import TafsirBySurahWhite from '../containers/QuranWhite/screens/TafsirBySurah/TafsirBySurah';
import TafsirSurahWhite from '../containers/QuranWhite/screens/TafsirBySurah/TafsirSurah';
import TafsirSettingsScreenWhite from '../containers/QuranWhite/screens/TafsirBySurah/TafsirSettingsScreen';
import TafsirSettingFontWhite from '../containers/QuranWhite/screens/TafsirBySurah/TafsirSettingFont';
import TranslatorDetailWhite from '../containers/QuranWhite/screens/ListenTranslation/TranslatorDetail';

import QuranGreen from '../containers/QuranGreen/Quran';
import QuranMainDashboardGreen from '../containers/QuranGreen/screens/QuranMainDashboard';
import DashBoardGreen from '../containers/QuranGreen/screens/DashBoard';
import PageListGreen from '../containers/QuranGreen/screens/PageList';
import SurahFullViewGreen from '../containers/QuranGreen/screens/SurahFullView';
import SettingGreen from '../containers/QuranGreen/screens/Setting';
import FullViewGreen from '../containers/QuranGreen/screens/Setting/FullView';
import FavoriteGreen from '../containers/QuranGreen/screens/Favorite';
import BookmarkGreen from '../containers/QuranGreen/screens/Bookmark';
import TranslatePageGreen from '../containers/QuranGreen/screens/TranslatePage';
import SurahDetailPageGreen from '../containers/QuranGreen/screens/SurahDetailPage';
import AddTafseerGreen from '../containers/QuranGreen/screens/AddTafseer';
import SurahBySurahGreen from '../containers/QuranGreen/screens/TranslationBySurah/SurahBySurah';
import TranslationSurahGreen from '../containers/QuranGreen/screens/TranslationBySurah/TranslationSurah';
import TranslationSettingsScreenGreen from '../containers/QuranGreen/screens/TranslationBySurah/TranslationSettingsScreen';
import TranslationSettingFontGreen from '../containers/QuranGreen/screens/TranslationBySurah/TranslationSettingFont';
import TafsirBySurahGreen from '../containers/QuranGreen/screens/TafsirBySurah/TafsirBySurah';
import TafsirSurahGreen from '../containers/QuranGreen/screens/TafsirBySurah/TafsirSurah';
import TafsirSettingsScreenGreen from '../containers/QuranGreen/screens/TafsirBySurah/TafsirSettingsScreen';
import TafsirSettingFontGreen from '../containers/QuranGreen/screens/TafsirBySurah/TafsirSettingFont';
import TranslatorDetailGreen from '../containers/QuranGreen/screens/ListenTranslation/TranslatorDetail';

//Reel Section
import ReelsComponentNew from '../containers/Reel/ReelsComponentNew';

//Hadith Section
import HadithsDetail from '../containers/Hadith/HadithsDetail';
import HadithsFavourites from '../containers/Hadith/HadithsFavourites';
import HadithsBooksDashboard from '../containers/Hadith/HadithsBooksDashboard';
import HadithBooksScreen from '../containers/Hadith/HadithBooksScreen';
import HadithBooksDetail from '../containers/Hadith/HadithBooksDetail';



//Dua Section
import DuasScreen from '../containers//DuaNew/DuasScreen';
import DuaCategoryDetail from '../containers/DuaNew/DuaCategoryDetail';
import DuaDetailNew from '../containers/DuaNew/DuaDetailNew';
import DuaNewFavourites from '../containers/DuaNew/DuaNewFavourites';



//Tasbih
import Tasbih from '../containers/Tasbih/Tasbih';
import TasbihCounterScreen from '../containers/Tasbih/TasbihCounterScreen';
import BackgroundPickerScreen from '../containers/Tasbih/BackgroundPickerScreen';
import FavoritesScreen from '../containers/Tasbih/FavoritesScreen';



//Videos New Section
import VideoDashboard from '../containers/VideosNew/VideoDashboard';
import VideosNew from '../containers/VideosNew/VideoDashboard';
import ChannelsDetailNew from '../containers/VideosNew/ChannelsDetailNew';
import BySpeakersNew from '../containers/VideosNew/BySpeakersNew';
import SpeakersDetailNew from '../containers/VideosNew/SpeakersDetailNew';
import SpeakersVideosPlayingNew from '../containers/VideosNew/SpeakersVideosPlayingNew';
import RecitaionDetailNew from '../containers/VideosNew/RecitaionDetailNew';
import VideoPlayingNew from '../containers/VideosNew/VideoPlayingNew';



//Qibla Section
import QiblaCompassNew from '../containers/Qibla/QiblaCompassNew';

//Prayer Section
import PrayerMosque from '../containers/Prayer/PrayerMosque/PrayerMosque';
import PrayerGuide from '../containers/Prayer/PrayerGuide/PrayerGuide';
import FajrSunnah from '../containers/Prayer/PrayerGuide/Fajr/Sunnah/FajrSunnah';
import FajrFarz from '../containers/Prayer/PrayerGuide/Fajr/Farz/FajrFarz';
import DhuhrFirst4Sunnah from '../containers/Prayer/PrayerGuide/Dhuhr/First4Sunnah/DhuhrFirst4Sunnah';
import DhuhrFirst4Farz from '../containers/Prayer/PrayerGuide/Dhuhr/First4Farz/DhuhrFirst4Farz';
import Dhuhr2Sunnah from '../containers/Prayer/PrayerGuide/Dhuhr/SecondSunnah/Dhuhr2Sunnah';
import Dhuhr2Nafil from '../containers/Prayer/PrayerGuide/Dhuhr/SecondNafil/Dhuhr2Nafil';
import AsrFirst4Sunnah from '../containers/Prayer/PrayerGuide/Asr/First4Sunnah/AsrFirst4Sunnah';
import AsrFirst4Farz from '../containers/Prayer/PrayerGuide/Asr/First4Farz/AsrFirst4Farz';
import MaghribFarz from '../containers/Prayer/PrayerGuide/Maghrib/FirstFarz/MaghribFarz';
import Maghrib2Sunnah from '../containers/Prayer/PrayerGuide/Maghrib/SecondSunnah/Maghrib2Sunnah';
import Maghrib2Nafil from '../containers/Prayer/PrayerGuide/Maghrib/SecondNafil/Maghrib2Nafil';
import IshaFirst4Sunnah from '../containers/Prayer/PrayerGuide/Isha/First4Sunnah/IshaFirst4Sunnah';
import IshaFirst4Farz from '../containers/Prayer/PrayerGuide/Isha/First4Farz/IshaFirst4Farz';
import Isha2Sunnah from '../containers/Prayer/PrayerGuide/Isha/SecondSunnah/Isha2Sunnah';
import Isha2Nafil from '../containers/Prayer/PrayerGuide/Isha/SecondNafil/Isha2Nafil';
import IshaWitr from '../containers/Prayer/PrayerGuide/Isha/Witr/IshaWitr';
import IshaLast2Nafil from '../containers/Prayer/PrayerGuide/Isha/LastNafil/IshaLast2Nafil';

import PrayerMosqueWhite from '../containers/PrayerWhite/PrayerMosque/PrayerMosque';
import PrayerGuideWhite from '../containers/PrayerWhite/PrayerGuide/PrayerGuide';
import FajrSunnahWhite from '../containers/PrayerWhite/PrayerGuide/Fajr/Sunnah/FajrSunnah';
import FajrFarzWhite from '../containers/PrayerWhite/PrayerGuide/Fajr/Farz/FajrFarz';
import DhuhrFirst4SunnahWhite from '../containers/PrayerWhite/PrayerGuide/Dhuhr/First4Sunnah/DhuhrFirst4Sunnah';
import DhuhrFirst4FarzWhite from '../containers/PrayerWhite/PrayerGuide/Dhuhr/First4Farz/DhuhrFirst4Farz';
import Dhuhr2SunnahWhite from '../containers/PrayerWhite/PrayerGuide/Dhuhr/SecondSunnah/Dhuhr2Sunnah';
import Dhuhr2NafilWhite from '../containers/PrayerWhite/PrayerGuide/Dhuhr/SecondNafil/Dhuhr2Nafil';
import AsrFirst4SunnahWhite from '../containers/PrayerWhite/PrayerGuide/Asr/First4Sunnah/AsrFirst4Sunnah';
import AsrFirst4FarzWhite from '../containers/PrayerWhite/PrayerGuide/Asr/First4Farz/AsrFirst4Farz';
import MaghribFarzWhite from '../containers/PrayerWhite/PrayerGuide/Maghrib/FirstFarz/MaghribFarz';
import Maghrib2SunnahWhite from '../containers/PrayerWhite/PrayerGuide/Maghrib/SecondSunnah/Maghrib2Sunnah';
import Maghrib2NafilWhite from '../containers/PrayerWhite/PrayerGuide/Maghrib/SecondNafil/Maghrib2Nafil';
import IshaFirst4SunnahWhite from '../containers/PrayerWhite/PrayerGuide/Isha/First4Sunnah/IshaFirst4Sunnah';
import IshaFirst4FarzWhite from '../containers/PrayerWhite/PrayerGuide/Isha/First4Farz/IshaFirst4Farz';
import Isha2SunnahWhite from '../containers/PrayerWhite/PrayerGuide/Isha/SecondSunnah/Isha2Sunnah';
import Isha2NafilWhite from '../containers/PrayerWhite/PrayerGuide/Isha/SecondNafil/Isha2Nafil';
import IshaWitrWhite from '../containers/PrayerWhite/PrayerGuide/Isha/Witr/IshaWitr';
import IshaLast2NafilWhite from '../containers/PrayerWhite/PrayerGuide/Isha/LastNafil/IshaLast2Nafil';

import PrayerMosqueGreen from '../containers/PrayerGreen/PrayerMosque/PrayerMosque';
import PrayerGuideGreen from '../containers/PrayerGreen/PrayerGuide/PrayerGuide';
import FajrSunnahGreen from '../containers/PrayerGreen/PrayerGuide/Fajr/Sunnah/FajrSunnah';
import FajrFarzGreen from '../containers/PrayerGreen/PrayerGuide/Fajr/Farz/FajrFarz';
import DhuhrFirst4SunnahGreen from '../containers/PrayerGreen/PrayerGuide/Dhuhr/First4Sunnah/DhuhrFirst4Sunnah';
import DhuhrFirst4FarzGreen from '../containers/PrayerGreen/PrayerGuide/Dhuhr/First4Farz/DhuhrFirst4Farz';
import Dhuhr2SunnahGreen from '../containers/PrayerGreen/PrayerGuide/Dhuhr/SecondSunnah/Dhuhr2Sunnah';
import Dhuhr2NafilGreen from '../containers/PrayerGreen/PrayerGuide/Dhuhr/SecondNafil/Dhuhr2Nafil';
import AsrFirst4SunnahGreen from '../containers/PrayerGreen/PrayerGuide/Asr/First4Sunnah/AsrFirst4Sunnah';
import AsrFirst4FarzGreen from '../containers/PrayerGreen/PrayerGuide/Asr/First4Farz/AsrFirst4Farz';
import MaghribFarzGreen from '../containers/PrayerGreen/PrayerGuide/Maghrib/FirstFarz/MaghribFarz';
import Maghrib2SunnahGreen from '../containers/PrayerGreen/PrayerGuide/Maghrib/SecondSunnah/Maghrib2Sunnah';
import Maghrib2NafilGreen from '../containers/PrayerGreen/PrayerGuide/Maghrib/SecondNafil/Maghrib2Nafil';
import IshaFirst4SunnahGreen from '../containers/PrayerGreen/PrayerGuide/Isha/First4Sunnah/IshaFirst4Sunnah';
import IshaFirst4FarzGreen from '../containers/PrayerGreen/PrayerGuide/Isha/First4Farz/IshaFirst4Farz';
import Isha2SunnahGreen from '../containers/PrayerGreen/PrayerGuide/Isha/SecondSunnah/Isha2Sunnah';
import Isha2NafilGreen from '../containers/PrayerGreen/PrayerGuide/Isha/SecondNafil/Isha2Nafil';
import IshaWitrGreen from '../containers/PrayerGreen/PrayerGuide/Isha/Witr/IshaWitr';
import IshaLast2NafilGreen from '../containers/PrayerGreen/PrayerGuide/Isha/LastNafil/IshaLast2Nafil';

//Prayer Section New
import AblutionNew from '../containers/Prayer/PrayerAblutionNew/AblutionNew';
import AblutionWaduStepNew from '../containers/Prayer/PrayerAblutionNew/AblutionWaduStepNew';
import IntoWudhuNew from '../containers/Prayer/PrayerAblutionNew/IntoWudhuNew';
import NullifiesNew from '../containers/Prayer/PrayerAblutionNew/NullifiesNew';
import WearingSockWudhu from '../containers/Prayer/PrayerAblutionNew/WearingSockWudhu';
import TayammumScreen from '../containers/Prayer/PrayerAblutionNew/TayammumScreen';

import AblutionNewWhite from '../containers/PrayerWhite/PrayerAblutionNew/AblutionNew';
import AblutionWaduStepNewWhite from '../containers/PrayerWhite/PrayerAblutionNew/AblutionWaduStepNew';
import IntoWudhuNewWhite from '../containers/PrayerWhite/PrayerAblutionNew/IntoWudhuNew';
import NullifiesNewWhite from '../containers/PrayerWhite/PrayerAblutionNew/NullifiesNew';
import WearingSockWudhuWhite from '../containers/PrayerWhite/PrayerAblutionNew/WearingSockWudhu';
import TayammumScreenWhite from '../containers/PrayerWhite/PrayerAblutionNew/TayammumScreen';

import AblutionNewGreen from '../containers/PrayerGreen/PrayerAblutionNew/AblutionNew';
import AblutionWaduStepNewGreen from '../containers/PrayerGreen/PrayerAblutionNew/AblutionWaduStepNew';
import IntoWudhuNewGreen from '../containers/PrayerGreen/PrayerAblutionNew/IntoWudhuNew';
import NullifiesNewGreen from '../containers/PrayerGreen/PrayerAblutionNew/NullifiesNew';
import WearingSockWudhuGreen from '../containers/PrayerGreen/PrayerAblutionNew/WearingSockWudhu';
import TayammumScreenGreen from '../containers/PrayerGreen/PrayerAblutionNew/TayammumScreen';

//Greetings New Section
import GreetingsNew from '../containers/Greetings/GreetingsNew';
import GreetingCardListNew from '../containers/Greetings/GreetingCardListNew';
import GreetingCardShare from '../containers/Greetings/GreetingCardShare';



//Shahadah Section
import ShahadahNew from '../containers/Shahadah/ShahadahNew';

//IslamicStory
import IslamicStoriesScreen from '../containers/IslamicStories/maincomponent/IslamicStoriesScreen';
import SubCategories from '../containers/IslamicStories/screens/SubCategories';
import AllSubCategories from '../containers/IslamicStories/screens/AllSubCategories';
import StoryDetailScreen from '../containers/IslamicStories/screens/StoryDetailScreen';
import ReadStoryDetail from '../containers/IslamicStories/screens/ReadStoryDetail';
import PlayStory from '../containers/IslamicStories/screens/PlayStory';



//Reciters
import RecitersList from '../containers/Reciters/RecitersList';
import ReciterDetail from '../containers/Reciters/ReciterDetail';



//Calendar
import CalendarScreen from '../containers/Calendar/CalendarScreen';

//Wall
import Wallofremember from '../containers/WallOfRemembrance/Wallofremember';
import WallDetail from '../containers/WallOfRemembrance/WallDetail';
import RemembranceForm from '../containers/WallOfRemembrance/RemembranceForm';

// One route per screen; the component follows the active theme.
const Themed_Quran = themedScreen({ blue: Quran, green: QuranGreen, white: QuranWhite });
const Themed_QuranMainDashboard = themedScreen({ blue: QuranMainDashboard, green: QuranMainDashboardGreen, white: QuranMainDashboardWhite });
const Themed_DashBoard = themedScreen({ blue: DashBoard, green: DashBoardGreen, white: DashBoardWhite });
const Themed_PageList = themedScreen({ blue: PageList, green: PageListGreen, white: PageListWhite });
const Themed_SurahFullView = themedScreen({ blue: SurahFullView, green: SurahFullViewGreen, white: SurahFullViewWhite });
const Themed_Setting = themedScreen({ blue: Setting, green: SettingGreen, white: SettingWhite });
const Themed_FullView = themedScreen({ blue: FullView, green: FullViewGreen, white: FullViewWhite });
const Themed_Favorite = themedScreen({ blue: Favorite, green: FavoriteGreen, white: FavoriteWhite });
const Themed_Bookmark = themedScreen({ blue: Bookmark, green: BookmarkGreen, white: BookmarkWhite });
const Themed_TranslatePage = themedScreen({ blue: TranslatePage, green: TranslatePageGreen, white: TranslatePageWhite });
const Themed_SurahDetailPage = themedScreen({ blue: SurahDetailPage, green: SurahDetailPageGreen, white: SurahDetailPageWhite });
const Themed_AddTafseer = themedScreen({ blue: AddTafseer, green: AddTafseerGreen, white: AddTafseerWhite });
const Themed_SurahBySurah = themedScreen({ blue: SurahBySurah, green: SurahBySurahGreen, white: SurahBySurahWhite });
const Themed_TranslationSettingsScreen = themedScreen({ blue: TranslationSettingsScreen, green: TranslationSettingsScreenGreen, white: TranslationSettingsScreenWhite });
const Themed_TranslationSettingFont = themedScreen({ blue: TranslationSettingFont, green: TranslationSettingFontGreen, white: TranslationSettingFontWhite });
const Themed_TafsirBySurah = themedScreen({ blue: TafsirBySurah, green: TafsirBySurahGreen, white: TafsirBySurahWhite });
const Themed_TafsirSettingsScreen = themedScreen({ blue: TafsirSettingsScreen, green: TafsirSettingsScreenGreen, white: TafsirSettingsScreenWhite });
const Themed_TafsirSettingFont = themedScreen({ blue: TafsirSettingFont, green: TafsirSettingFontGreen, white: TafsirSettingFontWhite });
const Themed_TranslatorDetail = themedScreen({ blue: TranslatorDetail, green: TranslatorDetailGreen, white: TranslatorDetailWhite });
const Themed_PrayerMosque = themedScreen({ blue: PrayerMosque, green: PrayerMosqueGreen, white: PrayerMosqueWhite });
const Themed_PrayerGuide = themedScreen({ blue: PrayerGuide, green: PrayerGuideGreen, white: PrayerGuideWhite });
const Themed_FajrSunnah = themedScreen({ blue: FajrSunnah, green: FajrSunnahGreen, white: FajrSunnahWhite });
const Themed_FajrFarz = themedScreen({ blue: FajrFarz, green: FajrFarzGreen, white: FajrFarzWhite });
const Themed_DhuhrFirst4Sunnah = themedScreen({ blue: DhuhrFirst4Sunnah, green: DhuhrFirst4SunnahGreen, white: DhuhrFirst4SunnahWhite });
const Themed_DhuhrFirst4Farz = themedScreen({ blue: DhuhrFirst4Farz, green: DhuhrFirst4FarzGreen, white: DhuhrFirst4FarzWhite });
const Themed_Dhuhr2Sunnah = themedScreen({ blue: Dhuhr2Sunnah, green: Dhuhr2SunnahGreen, white: Dhuhr2SunnahWhite });
const Themed_Dhuhr2Nafil = themedScreen({ blue: Dhuhr2Nafil, green: Dhuhr2NafilGreen, white: Dhuhr2NafilWhite });
const Themed_AsrFirst4Sunnah = themedScreen({ blue: AsrFirst4Sunnah, green: AsrFirst4SunnahGreen, white: AsrFirst4SunnahWhite });
const Themed_AsrFirst4Farz = themedScreen({ blue: AsrFirst4Farz, green: AsrFirst4FarzGreen, white: AsrFirst4FarzWhite });
const Themed_MaghribFarz = themedScreen({ blue: MaghribFarz, green: MaghribFarzGreen, white: MaghribFarzWhite });
const Themed_Maghrib2Sunnah = themedScreen({ blue: Maghrib2Sunnah, green: Maghrib2SunnahGreen, white: Maghrib2SunnahWhite });
const Themed_Maghrib2Nafil = themedScreen({ blue: Maghrib2Nafil, green: Maghrib2NafilGreen, white: Maghrib2NafilWhite });
const Themed_IshaFirst4Sunnah = themedScreen({ blue: IshaFirst4Sunnah, green: IshaFirst4SunnahGreen, white: IshaFirst4SunnahWhite });
const Themed_IshaFirst4Farz = themedScreen({ blue: IshaFirst4Farz, green: IshaFirst4FarzGreen, white: IshaFirst4FarzWhite });
const Themed_Isha2Sunnah = themedScreen({ blue: Isha2Sunnah, green: Isha2SunnahGreen, white: Isha2SunnahWhite });
const Themed_Isha2Nafil = themedScreen({ blue: Isha2Nafil, green: Isha2NafilGreen, white: Isha2NafilWhite });
const Themed_IshaWitr = themedScreen({ blue: IshaWitr, green: IshaWitrGreen, white: IshaWitrWhite });
const Themed_IshaLast2Nafil = themedScreen({ blue: IshaLast2Nafil, green: IshaLast2NafilGreen, white: IshaLast2NafilWhite });
const Themed_AblutionNew = themedScreen({ blue: AblutionNew, green: AblutionNewGreen, white: AblutionNewWhite });
const Themed_AblutionWaduStepNew = themedScreen({ blue: AblutionWaduStepNew, green: AblutionWaduStepNewGreen, white: AblutionWaduStepNewWhite });
const Themed_IntoWudhuNew = themedScreen({ blue: IntoWudhuNew, green: IntoWudhuNewGreen, white: IntoWudhuNewWhite });
const Themed_NullifiesNew = themedScreen({ blue: NullifiesNew, green: NullifiesNewGreen, white: NullifiesNewWhite });
const Themed_WearingSockWudhu = themedScreen({ blue: WearingSockWudhu, green: WearingSockWudhuGreen, white: WearingSockWudhuWhite });
const Themed_TayammumScreen = themedScreen({ blue: TayammumScreen, green: TayammumScreenGreen, white: TayammumScreenWhite });


const Stack = createNativeStackNavigator();

  const AppNavigator = ({ onboarded = false }) => {
    const { Colors ,theme} = useTheme();
    const {favourites} = useStore();
    const {favouriteshadith} = useStorehadith();
    const {favouritestasbih} = useStoreTasbih();
    
    return (
       <Stack.Navigator initialRouteName={onboarded ? "GuestNew" : 'Onboarding'}screenOptions={{
          headerBackTitleVisible: false,
          }}>
          <Stack.Screen name="GuestNew" component={GuestDrawerNew} options={{animation:'slide_from_right',headerShown: false}}/>
          <Stack.Screen name="HomeNew" component={HomeNew} options={{animation:'slide_from_right',headerTitle:"Wasil Islamic App",headerTitleAlign:"center",headerTintColor: Colors.white, headerTitleStyle: {color: Colors.wasilnewthemecolorthird,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'headerfont',fontWeight:"bold"}, headerStyle: {
          backgroundColor: Colors.cardDark
          },}}/>
          <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: false,animation:"slide_from_right",headerTintColor: Colors.black,}}/>
           <Stack.Screen name="ThemeSetting" component={ThemeSetting} options={headerOptions(Colors, "Choose Theme")}/>
          <Stack.Screen name="AboutUs" component={AboutUs} options={headerOptions(Colors, "About Us")}/>
          <Stack.Screen name="RateFeedback" component={RateFeedback} options={headerOptions(Colors, "Rate & Feedback")}/> 
          <Stack.Screen name="ContactUs" component={ContactUs} options={headerOptions(Colors, "Contact Us")}/> 
          <Stack.Screen name="FAQs" component={FAQs} options={headerOptions(Colors, "FAQs")}/> 
          <Stack.Screen name="Privacypolicy" component={Privacypolicy} options={headerOptions(Colors, "Privacy Policy")}/> 
          <Stack.Screen name="FounderMsg" component={FounderMsg} options={headerOptions(Colors, "Founder Message")}/>
          <Stack.Screen name="HijriDates" component={HijriDates} options={headerOptions(Colors, "Hijri Dates Adjustment")}/>
          <Stack.Screen name="Quran" component={Themed_Quran} options={{headerShown: false,animation:"slide_from_right"}}/>

          <Stack.Screen name="QuranMainDashboard" component={Themed_QuranMainDashboard} options={({ route }) => ({ title: "Quran",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
         }})}/>
          <Stack.Screen name="DashBoard" component={Themed_DashBoard} options={({ route }) => ({ title: "Quran",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
         }})}/>
          <Stack.Screen name="PageList" component={Themed_PageList} options={{headerShown: false,animation:"slide_from_right"}}/>
          <Stack.Screen name="SurahFullView" component={Themed_SurahFullView} options={{headerShown: false,animation:"slide_from_right"}}/>
          <Stack.Screen name="Setting" component={Themed_Setting} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
          <Stack.Screen name="FullView" component={Themed_FullView} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
          <Stack.Screen name="Favorite" component={Themed_Favorite} options={{headerShown: false}}/>
          <Stack.Screen name="Bookmark" component={Themed_Bookmark} options={{headerShown: false}}/>
          <Stack.Screen name="TranslatePage" component={Themed_TranslatePage} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
          <Stack.Screen name="SurahDetailPage" component={Themed_SurahDetailPage} options={{headerShown: false}}/>
          <Stack.Screen name="AddTafseer" component={Themed_AddTafseer} options={{headerShown: false}}/>
          <Stack.Screen name="SurahBySurah" component={Themed_SurahBySurah} options={{animation:'slide_from_right',headerTitle:"Translation By Surah",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
         },}}/>
          {theme === "blue" ? (
       <Stack.Screen name="TranslationSurah"
  component={TranslationSurah}
  options={({navigation}) => ({
    animation: 'slide_from_right',
    headerTitle: 'Translation',
    headerTitleAlign: 'center',
    headerTintColor: Colors.white,
    headerTitleStyle: {
      color: Colors.white,
      fontSize: 18,
      fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
    },
    headerStyle: {
      backgroundColor: Colors.cardDark,
    },

    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 6,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TranslationSettingsScreen')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            marginRight: 2,
          }}>
          <WasilNewBTTranslateSvg />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TranslationSettingFont')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
           
          }}>
          <WasilNewBTSettingSvg />
        </TouchableOpacity>
      </View>
    ),
        })}/>
          ):theme === "green" ? (
       <Stack.Screen name="TranslationSurah"
  component={TranslationSurahGreen}
  options={({navigation}) => ({
    animation: 'slide_from_right',
    headerTitle: 'Translation',
    headerTitleAlign: 'center',
    headerTintColor: Colors.white,
    headerTitleStyle: {
      color: Colors.white,
      fontSize: 18,
      fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
    },
    headerStyle: {
      backgroundColor: Colors.primary,
    },

    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 6,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TranslationSettingsScreen')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            marginRight: 2,
          }}>
          <WasilNewBTTranslateSvg />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TranslationSettingFont')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
           
          }}>
          <WasilNewBTSettingSvg />
        </TouchableOpacity>
      </View>
    ),
        })}/>
          ):(
         <Stack.Screen name="TranslationSurah" component={TranslationSurahWhite}  options={({navigation}) => ({
    animation: 'slide_from_right',
    headerTitle: 'Translation',
    headerTitleAlign: 'center',
    headerTintColor: Colors.black,
    headerTitleStyle: {
      color: Colors.black,
      fontSize: 18,
      fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
    },
    headerStyle: {
      backgroundColor: Colors.white,
    },

    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 6,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TranslationSettingsScreen')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            marginRight: 2,
          }}>
          <WasilNewTranslateWhiteSvg />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TranslationSettingFont')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
           
          }}>
          <QuranBottomSettingWhiteSVG />
        </TouchableOpacity>
      </View>
    ),
        })}/>
          )}
          <Stack.Screen name="TranslationSettingsScreen" component={Themed_TranslationSettingsScreen} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
          <Stack.Screen name="TranslationSettingFont" component={Themed_TranslationSettingFont} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
          <Stack.Screen name="TafsirBySurah" component={Themed_TafsirBySurah} options={{animation:'slide_from_right',headerTitle:"Tafsir By Surah",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
           backgroundColor: Colors.headerBg
        },}}/>
          {theme === "blue" ? (
        <Stack.Screen name="TafsirSurah" component={TafsirSurah}  
        options={({navigation}) => ({
    animation: 'slide_from_right',
    headerTitle: 'Tafsir',
    headerTitleAlign: 'center',
    headerTintColor: Colors.white,
    headerTitleStyle: {
      color: Colors.white,
      fontSize: 18,
      fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
    },
    headerStyle: {
      backgroundColor: Colors.cardDark,
    },

    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 6,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TafsirSettingsScreen')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            marginRight: 2,
          }}>
          <WasilNewBTTranslateSvg />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TafsirSettingFont')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
           
          }}>
          <WasilNewBTSettingSvg />
        </TouchableOpacity>
      </View>
    ),
        })}/>
          ):theme === "green" ? (
        <Stack.Screen name="TafsirSurah" component={TafsirSurahGreen}  
        options={({navigation}) => ({
    animation: 'slide_from_right',
    headerTitle: 'Tafsir',
    headerTitleAlign: 'center',
    headerTintColor: Colors.white,
    headerTitleStyle: {
      color: Colors.white,
      fontSize: 18,
      fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
    },
    headerStyle: {
      backgroundColor: Colors.primary,
    },

    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 6,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TafsirSettingsScreen')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            marginRight: 2,
          }}>
          <WasilNewBTTranslateSvg />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TafsirSettingFont')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
           
          }}>
          <WasilNewBTSettingSvg />
        </TouchableOpacity>
      </View>
    ),
        })}/>
          ):(
           <Stack.Screen name="TafsirSurah" component={TafsirSurahWhite}    options={({navigation}) => ({
    animation: 'slide_from_right',
    headerTitle: 'Tafsir',
    headerTitleAlign: 'center',
    headerTintColor: Colors.black,
    headerTitleStyle: {
      color: Colors.black,
      fontSize: 18,
      fontFamily: Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold',
    },
    headerStyle: {
      backgroundColor: Colors.white,
    },

    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 6,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TafsirSettingsScreen')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            marginRight: 2,
          }}>
          <WasilNewTranslateWhiteSvg />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TafsirSettingFont')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
           
          }}>
          <QuranBottomSettingWhiteSVG />
        </TouchableOpacity>
      </View>
    ),
        })}/>
          )}
          <Stack.Screen name="TafsirSettingsScreen" component={Themed_TafsirSettingsScreen} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
          <Stack.Screen name="TafsirSettingFont" component={Themed_TafsirSettingFont} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
           <Stack.Screen name="TranslatorDetail" component={Themed_TranslatorDetail} options={({ route }) => ({ title: "Listen Translation",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>

          
          <Stack.Screen name="ReelsNew" component={ReelsComponentNew} options={{headerShown: false,animation:"slide_from_right"}}/>
          <Stack.Screen name="DuasScreen" component={DuasScreen} options={({ navigation }) => ({
            ...headerOptions(Colors, "Duas"),
            headerRight: () => (
              <HeaderFavouritesButton
                filled={favourites.length > 0}
                onPress={() => navigation.navigate('DuaNewFavourites')}
                label="Favourite duas"
              />
            ),
          })}/>
          <Stack.Screen name="DuaCategoryDetail" component={DuaCategoryDetail} options={({ route }) => ({ title: route.params.name+" Duas",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
        }})}/>
          <Stack.Screen name="DuaDetailNew" component={DuaDetailNew} options={({ route }) => ({ title: route.params.name+" Duas",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
        }})}/>
          <Stack.Screen name="DuaNewFavourites" component={DuaNewFavourites} options={headerOptions(Colors, "Favourite Duas")}/>
          <Stack.Screen name="HadithsBooksDashboard" component={HadithsBooksDashboard} options={({ navigation }) => ({
            ...headerOptions(Colors, "Hadiths"),
            headerRight: () => (
              <HeaderFavouritesButton
                filled={favouriteshadith.length > 0}
                onPress={() => navigation.navigate('HadithsFavourites')}
                label="Favourite hadiths"
              />
            ),
          })}/>
          <Stack.Screen name="HadithBooksScreen" component={HadithBooksScreen} options={headerOptions(Colors, "Hadith Books")}/>
          <Stack.Screen name="HadithBooksDetail" component={HadithBooksDetail} options={({ route, navigation }) => ({
            ...headerOptions(Colors, route.params.name),
            headerRight: () => (
              <HeaderFavouritesButton
                filled={favouriteshadith.length > 0}
                onPress={() => navigation.navigate('HadithsFavourites')}
                label="Favourite hadiths"
              />
            ),
          })}/>
          <Stack.Screen name="HadithsDetail" component={HadithsDetail} options={({ route }) => ({ title: route.params.name.length >= 25 ? route.params.name.slice(0, 24)+"..." : route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
        }})}/>
          <Stack.Screen name="HadithsFavourites" component={HadithsFavourites} options={headerOptions(Colors, "Favourite Hadiths")}/>
          <Stack.Screen name="Tasbih" component={Tasbih} options={({navigation}) => ({
            ...headerOptions(Colors, "Tasbih"),
            headerRight: () => {
              const filled = favouritestasbih.length > 0;
              const Icon = theme === "white"
                ? (filled ? HeartfilledSVG : WasilNewTasbihHeartUnFilled)
                : (filled ? WasilNewHeartfilledBTSVG : WasilNewBTTasbihHeartUnFilled);
              return (
                <TouchableOpacity
                  style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => navigation.navigate('FavoritesScreen')}
                  accessibilityRole="button"
                  accessibilityLabel="Favourite tasbih">
                  <Icon />
                </TouchableOpacity>
              );
            },
          })}/>
          <Stack.Screen name="TasbihCounterScreen" component={TasbihCounterScreen} options={headerOptions(Colors, "Tasbih")}/>
          <Stack.Screen name="BackgroundPickerScreen" component={BackgroundPickerScreen} options={headerOptions(Colors, "Change Background")}/>
          <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={headerOptions(Colors, "Favourite Tasbih")}/>
          <Stack.Screen name="VideoDashboard" component={VideoDashboard} options={headerOptions(Colors, "Videos")}/>
          <Stack.Screen name="VideosNew" component={VideosNew} options={headerOptions(Colors, "Videos")}/>
          <Stack.Screen name="ChannelsDetailNew" component={ChannelsDetailNew} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>
          <Stack.Screen name="BySpeakersNew" component={BySpeakersNew} options={headerOptions(Colors, "Durs and Podcast")}/>
          <Stack.Screen name="SpeakersDetailNew" component={SpeakersDetailNew} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>
          <Stack.Screen name="SpeakersVideosPlayingNew" component={SpeakersVideosPlayingNew} options={headerOptions(Colors, "Videos")}/>
          <Stack.Screen name="RecitaionDetailNew" component={RecitaionDetailNew} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>
          <Stack.Screen name="VideoPlayingNew" component={VideoPlayingNew} options={headerOptions(Colors, "Videos")}/>
          <Stack.Screen name="QiblaCompassNew" component={QiblaCompassNew} options={headerOptions(Colors, "Qibla")}/>
          <Stack.Screen name="PrayerMosque" component={Themed_PrayerMosque} options={{animation:'slide_from_right',headerTitle:"Find a Mosque",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
        },}}/>
        <Stack.Screen name="PrayerGuide" component={Themed_PrayerGuide} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
        },}}/>
        <Stack.Screen name="FajrSunnah" component={Themed_FajrSunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="FajrFarz" component={Themed_FajrFarz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="DhuhrFirst4Sunnah" component={Themed_DhuhrFirst4Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="DhuhrFirst4Farz" component={Themed_DhuhrFirst4Farz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="Dhuhr2Sunnah" component={Themed_Dhuhr2Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="Dhuhr2Nafil" component={Themed_Dhuhr2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="AsrFirst4Sunnah" component={Themed_AsrFirst4Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="AsrFirst4Farz" component={Themed_AsrFirst4Farz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="MaghribFarz" component={Themed_MaghribFarz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="Maghrib2Sunnah" component={Themed_Maghrib2Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="Maghrib2Nafil" component={Themed_Maghrib2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="IshaFirst4Sunnah" component={Themed_IshaFirst4Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="IshaFirst4Farz" component={Themed_IshaFirst4Farz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="Isha2Sunnah" component={Themed_Isha2Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="Isha2Nafil" component={Themed_Isha2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="IshaWitr" component={Themed_IshaWitr} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="IshaLast2Nafil" component={Themed_IshaLast2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="AblutionNew" component={Themed_AblutionNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="AblutionWaduStepNew" component={Themed_AblutionWaduStepNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="IntoWudhuNew" component={Themed_IntoWudhuNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="NullifiesNew" component={Themed_NullifiesNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="WearingSockWudhu" component={Themed_WearingSockWudhu} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="TayammumScreen" component={Themed_TayammumScreen} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.headerText, headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: Colors.headerBg
      },}}/>
        <Stack.Screen name="GreetingsNew" component={GreetingsNew} options={headerOptions(Colors, "Greeting Cards")}/>
        <Stack.Screen name="GreetingCardListNew" component={GreetingCardListNew} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>
        <Stack.Screen name="GreetingCardShare" component={GreetingCardShare} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>
        <Stack.Screen name="ShahadahNew" component={ShahadahNew} options={headerOptions(Colors, "Shahadah")}/>
        <Stack.Screen name="IslamicStoriesScreen" component={IslamicStoriesScreen} options={headerOptions(Colors, "Islamic Stories")}/>
        <Stack.Screen name="SubCategories" component={SubCategories} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>
        <Stack.Screen name="AllSubCategories" component={AllSubCategories} options={headerOptions(Colors, "All Stories")}/>
        <Stack.Screen name="StoryDetailScreen" component={StoryDetailScreen} options={headerOptions(Colors, "Story")}/>
        <Stack.Screen name="ReadStory" component={ReadStoryDetail} options={headerOptions(Colors, "Read Story")}/>
        <Stack.Screen name="PlayStory" component={PlayStory} options={headerOptions(Colors, "Listen")}/>
        <Stack.Screen name="RecitersList" component={RecitersList} options={headerOptions(Colors, "Reciters")}/>
        <Stack.Screen name="ReciterDetail" component={ReciterDetail} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.headerText ,headerTitleStyle: {color: Colors.headerText,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: Colors.headerBg
      }})}/>
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={headerOptions(Colors, "Calendar")}/>
        <Stack.Screen name="Wallofremember" component={Wallofremember} options={headerOptions(Colors, "Wall of Remembrance")}/>
        
        <Stack.Screen name="WallofrememberDetail" component={WallDetail} options={headerOptions(Colors, "Wall of Remembrance")}/>

         <Stack.Screen name="RemembranceForm" component={RemembranceForm} options={headerOptions(Colors, "Add a Beloved Soul")}/>

</Stack.Navigator>
    );
  };
  
   

export default AppNavigator;