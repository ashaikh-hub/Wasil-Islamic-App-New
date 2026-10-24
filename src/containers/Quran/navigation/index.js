import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../../../theme';
import {View,TouchableOpacity,Platform} from 'react-native';
import {HeartfilledSVG,WasilNewTasbihHeartUnFilled,WasilNewTranslateSvg,QuranBottomSettingSVG} from '../../../assets/icons';
import useStore from '../../../store'
import useStorehadith from '../../../hadithstore';
import useStoreTasbih from '../../../tasbihstore';

//Home and Navigation Drawer
import GuestDrawerNew from '../../Drawer/guestdrawernew';
import HomeNew from '../../HomeNew/HomeNew';
import AboutUs from '../../Drawer/AboutUs';
import RateFeedback from '../../Drawer/RateFeedback';
import ContactUs from '../../Drawer/ContactUs';
import FAQs from '../../Drawer/FAQs';
import Privacypolicy from '../../Drawer/Privacypolicy';
import FounderMsg from '../../Drawer/FounderMsg';
import HijriDates from '../../Drawer/HijriDates';

//Onboarding
import Onboarding from '../../onboarding/Onboarding';


//Quran Section
import Quran from '../../Quran/Quran';
import QuranMainDashboard from '../screens/QuranMainDashboard';
import Favorite from '../screens/Favorite';
import Bookmark from '../screens/Bookmark';
import DashBoard from '../screens/DashBoard';
import Setting from '../screens/Setting';
import FullView from '../screens/Setting/FullView';
import TranslatePage from '../screens/TranslatePage';
import SurahFullView from '../screens/SurahFullView';
import SurahDetailPage from '../screens/SurahDetailPage';
import PageList from '../screens/PageList';
import AddTafseer from '../screens/AddTafseer';
import SurahBySurah from '../screens/TranslationBySurah/SurahBySurah';
import TranslationSurah from '../screens/TranslationBySurah/TranslationSurah';
import TranslationSettingsScreen from '../screens/TranslationBySurah/TranslationSettingsScreen';
import TranslationSettingFont from '../screens/TranslationBySurah/TranslationSettingFont';
import TafsirBySurah from '../screens/TafsirBySurah/TafsirBySurah';
import TafsirSurah from '../screens/TafsirBySurah/TafsirSurah';
import TafsirSettingsScreen from '../screens/TafsirBySurah/TafsirSettingsScreen';
import TafsirSettingFont from '../screens/TafsirBySurah/TafsirSettingFont';

//Reel Section
import ReelsComponentNew from '../../Reel/ReelsComponentNew';

//Hadith Section
import HadithsDetail from '../../Hadith/HadithsDetail';
import HadithsFavourites from '../../Hadith/HadithsFavourites';

//Hadith New Section
import HadithBooksScreen from '../../Hadith/HadithBooksScreen';
import HadithBooksDetail from '../../Hadith/HadithBooksDetail';

import DuasScreen from '../../DuaNew/DuasScreen';
import DuaCategoryDetail from '../../DuaNew/DuaCategoryDetail';
import DuaDetailNew from '../../DuaNew/DuaDetailNew';

//Tasbih
import Tasbih from '../../Tasbih/Tasbih';
import TasbihCounterScreen from '../../Tasbih/TasbihCounterScreen';
import BackgroundPickerScreen from '../../Tasbih/BackgroundPickerScreen';
import FavoritesScreen from '../../Tasbih/FavoritesScreen';

//Videos New Section
import VideosNew from '../../VideosNew/VideoDashboard';
import ChannelsDetailNew from '../../VideosNew/ChannelsDetailNew';
import BySpeakersNew from '../../VideosNew/BySpeakersNew';
import SpeakersDetailNew from '../../VideosNew/SpeakersDetailNew';
import SpeakersVideosPlayingNew from '../../VideosNew/SpeakersVideosPlayingNew';
import RecitaionDetailNew from '../../VideosNew/RecitaionDetailNew';
import VideoPlayingNew from '../../VideosNew/VideoPlayingNew';

//Qibla Section
import QiblaCompassNew from '../../Qibla/QiblaCompassNew';

//Prayer Section
import PrayerMosque from '../../Prayer/PrayerMosque/PrayerMosque';
import PrayerGuide from '../../Prayer/PrayerGuide/PrayerGuide';
import FajrSunnah from '../../Prayer/PrayerGuide/Fajr/Sunnah/FajrSunnah';
import FajrFarz from '../../Prayer/PrayerGuide/Fajr/Farz/FajrFarz';
import DhuhrFirst4Sunnah from '../../Prayer/PrayerGuide/Dhuhr/First4Sunnah/DhuhrFirst4Sunnah';
import DhuhrFirst4Farz from '../../Prayer/PrayerGuide/Dhuhr/First4Farz/DhuhrFirst4Farz';
import Dhuhr2Sunnah from '../../Prayer/PrayerGuide/Dhuhr/SecondSunnah/Dhuhr2Sunnah';
import Dhuhr2Nafil from '../../Prayer/PrayerGuide/Dhuhr/SecondNafil/Dhuhr2Nafil';
import AsrFirst4Sunnah from '../../Prayer/PrayerGuide/Asr/First4Sunnah/AsrFirst4Sunnah';
import AsrFirst4Farz from '../../Prayer/PrayerGuide/Asr/First4Farz/AsrFirst4Farz';
import MaghribFarz from '../../Prayer/PrayerGuide/Maghrib/FirstFarz/MaghribFarz';
import Maghrib2Sunnah from '../../Prayer/PrayerGuide/Maghrib/SecondSunnah/Maghrib2Sunnah';
import Maghrib2Nafil from '../../Prayer/PrayerGuide/Maghrib/SecondNafil/Maghrib2Nafil';
import IshaFirst4Sunnah from '../../Prayer/PrayerGuide/Isha/First4Sunnah/IshaFirst4Sunnah';
import IshaFirst4Farz from '../../Prayer/PrayerGuide/Isha/First4Farz/IshaFirst4Farz';
import Isha2Sunnah from '../../Prayer/PrayerGuide/Isha/SecondSunnah/Isha2Sunnah';
import Isha2Nafil from '../../Prayer/PrayerGuide/Isha/SecondNafil/Isha2Nafil';
import IshaWitr from '../../Prayer/PrayerGuide/Isha/Witr/IshaWitr';
import IshaLast2Nafil from '../../Prayer/PrayerGuide/Isha/LastNafil/IshaLast2Nafil';

//Prayer Section New
import AblutionNew from '../../Prayer/PrayerAblutionNew/AblutionNew';
import AblutionWaduStepNew from '../../Prayer/PrayerAblutionNew/AblutionWaduStepNew';
import IntoWudhuNew from '../../Prayer/PrayerAblutionNew/IntoWudhuNew';
import NullifiesNew from '../../Prayer/PrayerAblutionNew/NullifiesNew';
import WearingSockWudhu from '../../Prayer/PrayerAblutionNew/WearingSockWudhu';
import TayammumScreen from '../../Prayer/PrayerAblutionNew/TayammumScreen';

//Greetings New Section
import GreetingsNew from '../../Greetings/GreetingsNew';
import GreetingCardListNew from '../../Greetings/GreetingCardListNew';
import GreetingCardShare from '../../Greetings/GreetingCardShare';

//Shahadah Section
import ShahadahNew from '../../Shahadah/ShahadahNew';

//IslamicStory
import IslamicStoriesScreen from '../../IslamicStories/maincomponent/IslamicStoriesScreen';
import SubCategories from '../../IslamicStories/screens/SubCategories';
import AllSubCategories from '../../IslamicStories/screens/AllSubCategories';
import StoryDetailScreen from '../../IslamicStories/screens/StoryDetailScreen';
import ReadStoryDetail from '../../IslamicStories/screens/ReadStoryDetail';
import PlayStory from '../../IslamicStories/screens/PlayStory';

//Reciters
import RecitersList from '../../Reciters/RecitersList';
import ReciterDetail from '../../Reciters/ReciterDetail';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const {favourites} = useStore();
  const {favouriteshadith} = useStorehadith();
    const {favouritestasbih} = useStoreTasbih();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="QuranMainDashboard"
        screenOptions={{
          gestureEnabled: true,
        }}>
           <Stack.Screen name="QuranMainDashboard" component={QuranMainDashboard} options={({ route }) => ({ title: "Quran",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/> 
        <Stack.Screen name="DashBoard" component={DashBoard}options={({ route }) => ({ title: "Quran",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/> 
        <Stack.Screen name="Favorite" component={Favorite} options={{headerShown: false}}/>
        <Stack.Screen name="Bookmark" component={Bookmark}options={{headerShown: false}} />
        <Stack.Screen name="Setting" component={Setting} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
         <Stack.Screen name="FullView" component={FullView} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
        <Stack.Screen name="TranslatePage" component={TranslatePage}options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
        <Stack.Screen name="SurahDetailPage" component={SurahDetailPage} options={{headerShown: false}}/>
         <Stack.Screen name="PageList" component={PageList} options={{headerShown: false}}/>
        <Stack.Screen name="SurahFullView" component={SurahFullView}options={{headerShown: false}} />
        <Stack.Screen name="AddTafseer" component={AddTafseer} options={{headerShown: false}}/>
          <Stack.Screen name="SurahBySurah" component={SurahBySurah} options={{animation:'slide_from_right',headerTitle:"Translation By Surah",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
       },}}/>
       <Stack.Screen name="TranslationSurah" component={TranslationSurah}  options={({navigation}) => ({animation:'slide_from_right',headerTitle:"Translation",headerRight: () => (
          <View style={{height:50,width:50,flexDirection:"row"}}>
           <View>
          <TouchableOpacity style={{top:Platform.OS === 'ios' ? 10: 18,right:Platform.OS === 'ios' ? 20: 20 }} onPress={() => {
          navigation.navigate('TranslationSettingFont');
        }}>
          <WasilNewTranslateSvg/>
          </TouchableOpacity>
          </View>
          <View>
          <TouchableOpacity style={{top:Platform.OS === 'ios' ? 10: 18,right:Platform.OS === 'ios' ? 10: 10}} onPress={() => {
          navigation.navigate('TranslationSettingsScreen');
        }}>
          <QuranBottomSettingSVG/>
          </TouchableOpacity>
          </View>
         
         
          </View>
        ),headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
        }})}/>

        <Stack.Screen name="TranslationSettingsScreen" component={TranslationSettingsScreen} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
        <Stack.Screen name="TranslationSettingFont" component={TranslationSettingFont} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
         <Stack.Screen name="TafsirBySurah" component={TafsirBySurah} options={{animation:'slide_from_right',headerTitle:"Tafsir By Surah",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
           backgroundColor: '#FFFFFF'
          },}}/>
           <Stack.Screen name="TafsirSurah" component={TafsirSurah}  options={({navigation}) => ({animation:'slide_from_right',headerTitle:"Tafsir",headerRight: () => (
          <View style={{height:50,width:50,flexDirection:"row"}}>
           <View>
          <TouchableOpacity style={{top:Platform.OS === 'ios' ? 10: 18,right:Platform.OS === 'ios' ? 20: 20 }} onPress={() => {
          navigation.navigate('TafsirSettingFont');
        }}>
          <WasilNewTranslateSvg/>
          </TouchableOpacity>
          </View>
          <View>
          <TouchableOpacity style={{top:Platform.OS === 'ios' ? 10: 18,right:Platform.OS === 'ios' ? 10: 10}} onPress={() => {
          navigation.navigate('TafsirSettingsScreen');
        }}>
          <QuranBottomSettingSVG/>
          </TouchableOpacity>
          </View>
         
         
          </View>
        ),headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
        }})}/>
         <Stack.Screen name="TafsirSettingsScreen" component={TafsirSettingsScreen} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
         <Stack.Screen name="TafsirSettingFont" component={TafsirSettingFont} options={{ presentation: 'modal', headerShown: false,animation: 'slide_from_bottom',}}/>
        <Stack.Screen name="ReelsNew" component={ReelsComponentNew} options={{headerShown: false,animation:"slide_from_right"}}/>
        <Stack.Screen name="GuestNew" component={GuestDrawerNew} options={{animation:'slide_from_right',headerShown: false}}/>
        <Stack.Screen name="HomeNew" component={HomeNew} options={{animation:'slide_from_right',headerTitle:"Wasil",headerTitleAlign:"center",headerTintColor: '#FFFFFF', headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'headerfont',fontWeight:"bold"}, headerStyle: {
         backgroundColor: Colors.wasilnewthemecolorsecond
        },}}/>
       <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: false,animation:"slide_from_right",headerTintColor: Colors.black,}}/>
              <Stack.Screen name="AboutUs" component={AboutUs} options={{animation:'slide_from_right',headerTitle:"About Us",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
               backgroundColor: '#FFFFFF'
              },}}/>
              <Stack.Screen name="RateFeedback" component={RateFeedback} options={{animation:'slide_from_right',headerTitle:"Rate & Feedback",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
               backgroundColor: '#FFFFFF'
              },}}/>
              <Stack.Screen name="ContactUs" component={ContactUs} options={{animation:'slide_from_right',headerTitle:"Contact Us",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
               backgroundColor: '#FFFFFF'
              },}}/>
              <Stack.Screen name="FAQs" component={FAQs} options={{animation:'slide_from_right',headerTitle:"FAQs",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
               backgroundColor: '#FFFFFF'
              },}}/>
              <Stack.Screen name="Privacypolicy" component={Privacypolicy} options={{animation:'slide_from_right',headerTitle:"Privacy Policy",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
               backgroundColor: '#FFFFFF'
              },}}/>
              <Stack.Screen name="FounderMsg" component={FounderMsg} options={({ route }) => ({ title: "Founder Message",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
               backgroundColor: '#FFFFFF'
              }})}/>
              <Stack.Screen name="HijriDates" component={HijriDates} options={({ route }) => ({ title: "Hijri Dates Adjustment",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
               backgroundColor: '#FFFFFF'
              }})}/>
        <Stack.Screen name="Quran" component={Quran} options={{headerShown: false}}/>
   <Stack.Screen name="ReelsNew" component={ReelsComponentNew} options={{headerShown: false,animation:"slide_from_right"}}/>
       

        <Stack.Screen name="DuasScreen" component={DuasScreen} options={({navigation}) => ({ headerTitle: "Duas",headerRight: () => (
          <View style={{height:50,width:50}}>
               <View>
        {favourites.length > 0 ? (
      <TouchableOpacity style={{height:50,width:50,top:Platform.OS === 'ios' ? 13: 18,left:20}} onPress={() => {
        navigation.navigate('DuaFavourites');
      }}>
        <HeartfilledSVG/>
        </TouchableOpacity>
        
      ) : (
        <TouchableOpacity style={{height:50,width:50,top:Platform.OS === 'ios' ? 13: 18,left:20}} onPress={() => {
          navigation.navigate('DuaFavourites');
        }}>
          <WasilNewTasbihHeartUnFilled/>
          </TouchableOpacity>
      )}
    
              
  </View>
         
          </View>
        ),animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
        <Stack.Screen name="DuaCategoryDetail" component={DuaCategoryDetail} options={({ route }) => ({ title: "Duas Details",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
        <Stack.Screen name="DuaDetailNew" component={DuaDetailNew} options={({ route }) => ({ title: "Dua",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
     
       <Stack.Screen name="HadithBooksScreen" component={HadithBooksScreen} options={({navigation}) => ({ headerTitle: "Hadiths",headerRight: () => (
          <View style={{height:50,width:50}}>
             <View>
               {favouriteshadith.length > 0 ? (
      <TouchableOpacity style={{height:50,width:50,top:Platform.OS === 'ios' ? 13: 18,left:20}} onPress={() => {
        navigation.navigate('HadithsFavourites');
      }}>
        <HeartfilledSVG/>
        </TouchableOpacity>
        
      ) : (
        <TouchableOpacity style={{height:50,width:50,top:Platform.OS === 'ios' ? 13: 18,left:20}} onPress={() => {
          navigation.navigate('HadithsFavourites');
        }}>
          <WasilNewTasbihHeartUnFilled/>
          </TouchableOpacity>
      )}
    
              
  </View>
          </View>
        ),animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
        <Stack.Screen name="HadithBooksDetail" component={HadithBooksDetail} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
       <Stack.Screen name="HadithsDetail" component={HadithsDetail} options={({ route }) => ({ title: route.params.name.length >= 25 ? route.params.name.slice(0, 24)+"..." : route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
       <Stack.Screen name="HadithsFavourites" component={HadithsFavourites} options={({ route }) => ({ title: "Favourite Hadiths",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
       

       <Stack.Screen name="Tasbih" component={Tasbih} options={({navigation}) => ({ headerTitle: "Tasbih",headerRight: () => (
          <View style={{height:50,width:50}}>
             <View>
               {favouritestasbih.length > 0 ? (
      <TouchableOpacity style={{height:50,width:50,top:Platform.OS === 'ios' ? 13: 18,left:20}} onPress={() => {
        navigation.navigate('FavoritesScreen');
      }}>
        <HeartfilledSVG/>
        </TouchableOpacity>
        
      ) : (
        <TouchableOpacity style={{height:50,width:50,top:Platform.OS === 'ios' ? 13: 18,left:20}} onPress={() => {
          navigation.navigate('FavoritesScreen');
        }}>
          <WasilNewTasbihHeartUnFilled/>
          </TouchableOpacity>
      )}
    
              
  </View>
          </View>
        ),animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
       }})}/>
       <Stack.Screen name="TasbihCounterScreen" component={TasbihCounterScreen} options={{animation:'slide_from_right',headerTitle:"Tasbih",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="BackgroundPickerScreen" component={BackgroundPickerScreen} options={{animation:'slide_from_right',headerTitle:"Change Background",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{animation:'slide_from_right',headerTitle:"Favourite Tasbihs",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      
      
      <Stack.Screen name="VideosNew" component={VideosNew} options={({ route }) => ({ title:"Videos",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="ChannelsDetailNew" component={ChannelsDetailNew} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="BySpeakersNew" component={BySpeakersNew} options={({ route }) => ({ title: "Durs and Podcast",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="SpeakersDetailNew" component={SpeakersDetailNew} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="SpeakersVideosPlayingNew" component={SpeakersVideosPlayingNew} options={{animation:'slide_from_right',headerTitle:"Videos",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="RecitaionDetailNew" component={RecitaionDetailNew} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
       <Stack.Screen name="VideoPlayingNew" component={VideoPlayingNew} options={{animation:'slide_from_right',headerTitle:"Videos",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="QiblaCompassNew" component={QiblaCompassNew} options={{animation:'slide_from_right',headerTitle:"Qibla",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
          <Stack.Screen name="PrayerMosque" component={PrayerMosque} options={{animation:'slide_from_right',headerTitle:"Find a Mosque",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>  
      <Stack.Screen name="PrayerGuide" component={PrayerGuide} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
        <Stack.Screen name="FajrSunnah" component={FajrSunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
        <Stack.Screen name="FajrFarz" component={FajrFarz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="DhuhrFirst4Sunnah" component={DhuhrFirst4Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="DhuhrFirst4Farz" component={DhuhrFirst4Farz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="Dhuhr2Sunnah" component={Dhuhr2Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="Dhuhr2Nafil" component={Dhuhr2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="AsrFirst4Sunnah" component={AsrFirst4Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="AsrFirst4Farz" component={AsrFirst4Farz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
        <Stack.Screen name="MaghribFarz" component={MaghribFarz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="Maghrib2Sunnah" component={Maghrib2Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="Maghrib2Nafil" component={Maghrib2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
         <Stack.Screen name="IshaFirst4Sunnah" component={IshaFirst4Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="IshaFirst4Farz" component={IshaFirst4Farz} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="Isha2Sunnah" component={Isha2Sunnah} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="Isha2Nafil" component={Isha2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="IshaWitr" component={IshaWitr} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="IshaLast2Nafil" component={IshaLast2Nafil} options={{animation:'slide_from_right',headerTitle:"Prayer Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="AblutionNew" component={AblutionNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="AblutionWaduStepNew" component={AblutionWaduStepNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="IntoWudhuNew" component={IntoWudhuNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="NullifiesNew" component={NullifiesNew} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="WearingSockWudhu" component={WearingSockWudhu} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="TayammumScreen" component={TayammumScreen} options={{animation:'slide_from_right',headerTitle:"Wudhu Guide",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
       <Stack.Screen name="GreetingsNew" component={GreetingsNew} options={{animation:'slide_from_right',headerTitle:"Greeting Cards",headerTitleAlign:"center",headerTintColor: Colors.black, headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'}, headerStyle: {
        backgroundColor: '#FFFFFF'
      },}}/>
      <Stack.Screen name="GreetingCardListNew" component={GreetingCardListNew}  options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="GreetingCardShare" component={GreetingCardShare}  options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
       <Stack.Screen name="ShahadahNew" component={ShahadahNew} options={({ route }) => ({ title: "Shahadah",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
       
      <Stack.Screen name="IslamicStoriesScreen" component={IslamicStoriesScreen} options={({ route }) => ({ title: "Islamic Stories",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>   
      <Stack.Screen name="SubCategories" component={SubCategories} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="AllSubCategories" component={AllSubCategories} options={({ route }) => ({ title: "All Stories",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="StoryDetailScreen" component={StoryDetailScreen} options={({ route }) => ({ title: "StoryDetailScreen",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="ReadStory" component={ReadStoryDetail} options={({ route }) => ({ title: "Read Story",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      <Stack.Screen name="PlayStory" component={PlayStory} options={({ route }) => ({ title: "Listen Story",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
     
      <Stack.Screen name="RecitersList" component={RecitersList} options={({ route }) => ({ title: "Reciters",animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
       <Stack.Screen name="ReciterDetail" component={ReciterDetail} options={({ route }) => ({ title: route.params.name,animation:'slide_from_right',headerTitleAlign:"center",headerTintColor: Colors.black ,headerTitleStyle: {color: Colors.black,fontSize:18,fontFamily:Platform.OS === 'ios' ? 'Asul-Bold' : 'AsulBold'},headerStyle: {
        backgroundColor: '#FFFFFF'
      }})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
