import  React,{ useState } from 'react';
import {StatusBar,ScrollView, StyleSheet, View, TouchableOpacity, Text, LogBox,Image,Dimensions,Platform} from 'react-native';
const { width, height } = Dimensions.get('window');
import {Colors,Images} from '../../../../../theme'; 
import {WasilNewArrowUnopenSvg,WasilNewArrowOpenSvg} from '../../../../../assets/icons';


LogBox.ignoreAllLogs();

const ImagePrayerNiyat = () => (
  <Image
    source={Images.PrayerNiyat}
    style={{backgroundColor:Colors.transparent,borderRadius:10}}
  />
);

const ImagePrayerTakbeer = () => (
  <Image
    source={Images.PrayerTakbeer}
    style={{backgroundColor:Colors.transparent,borderRadius:10}}
  />
);
const ImagePrayerQayam = () => (
  <Image
    source={Images.PrayerQayam}
    style={{backgroundColor:Colors.transparent,borderRadius:10}}
  />
);
const ImagePrayerRuku = () => (
  <Image
    source={Images.PrayerRuku}
    style={{backgroundColor:Colors.transparent,borderRadius:10}}
  />
);
const ImagePrayerSajda = () => (
  <Image
    source={Images.PrayerSajda}
    style={{backgroundColor:Colors.transparent,borderRadius:10}}
  />
);

const FirstRakat = ({ navigation }) => { 
  const [showComponmentStepOne, setshowComponmentStepOne] = useState(true);
  const [showComponmentStepOneArrowU, setshowComponmentStepOneArrowU] = useState(false);
  const [showComponmentStepOneArrowD, setshowComponmentStepOneArrowD] = useState(true);
  const [showComponmentStepOnebgcolor, setshowComponmentStepOnebgcolor] = useState(Colors.transparent);

  const [showComponmentStepTwo, setshowComponmentStepTwo] = useState(true);
  const [showComponmentStepTwoArrowU, setshowComponmentStepTwoArrowU] = useState(false);
  const [showComponmentStepTwoArrowD, setshowComponmentStepTwoArrowD] = useState(true);
  const [showComponmentStepTwobgcolor, setshowComponmentStepTwobgcolor] = useState(Colors.transparent);

  const [showComponmentStepThree, setshowComponmentStepThree] = useState(true);
  const [showComponmentStepThreeArrowU, setshowComponmentStepThreeArrowU] = useState(false);
  const [showComponmentStepThreeArrowD, setshowComponmentStepThreeArrowD] = useState(true);
  const [showComponmentStepThreebgcolor, setshowComponmentStepThreebgcolor] = useState(Colors.transparent);

  const [showComponmentStepFour, setshowComponmentStepFour] = useState(true);
  const [showComponmentStepFourArrowU, setshowComponmentStepFourArrowU] = useState(false);
  const [showComponmentStepFourArrowD, setshowComponmentStepFourArrowD] = useState(true);
  const [showComponmentStepFourbgcolor, setshowComponmentStepFourbgcolor] = useState(Colors.transparent);

  const [showComponmentStepFive, setshowComponmentStepFive] = useState(true);
  const [showComponmentStepFiveArrowU, setshowComponmentStepFiveArrowU] = useState(false);
  const [showComponmentStepFiveArrowD, setshowComponmentStepFiveArrowD] = useState(true);
  const [showComponmentStepFivebgcolor, setshowComponmentStepFivebgcolor] = useState(Colors.transparent);

  const [showComponmentStepSix, setshowComponmentStepSix] = useState(true);
  const [showComponmentStepSixArrowU, setshowComponmentStepSixArrowU] = useState(false);
  const [showComponmentStepSixArrowD, setshowComponmentStepSixArrowD] = useState(true);
  const [showComponmentStepSixbgcolor, setshowComponmentStepSixbgcolor] = useState(Colors.transparent);

  const [showComponmentStepSeven, setshowComponmentStepSeven] = useState(true);
  const [showComponmentStepSevenArrowU, setshowComponmentStepSevenArrowU] = useState(false);
  const [showComponmentStepSevenArrowD, setshowComponmentStepSevenArrowD] = useState(true);
  const [showComponmentStepSevenbgcolor, setshowComponmentStepSevenbgcolor] = useState(Colors.transparent);

  const [showComponmentStepEight, setshowComponmentStepEight] = useState(true);
  const [showComponmentStepEightArrowU, setshowComponmentStepEightArrowU] = useState(false);
  const [showComponmentStepEightArrowD, setshowComponmentStepEightArrowD] = useState(true);
  const [showComponmentStepEightbgcolor, setshowComponmentStepEightbgcolor] = useState(Colors.transparent);

  const [showComponmentStepNine, setshowComponmentStepNine] = useState(true);
  const [showComponmentStepNineArrowU, setshowComponmentStepNineArrowU] = useState(false);
  const [showComponmentStepNineArrowD, setshowComponmentStepNineArrowD] = useState(true);
  const [showComponmentStepNinebgcolor, setshowComponmentStepNinebgcolor] = useState(Colors.transparent);

  const [showComponmentStepTen, setshowComponmentStepTen] = useState(true);
  const [showComponmentStepTenArrowU, setshowComponmentStepTenArrowU] = useState(false);
  const [showComponmentStepTenArrowD, setshowComponmentStepTenArrowD] = useState(true);
  const [showComponmentStepTenbgcolor, setshowComponmentStepTenbgcolor] = useState(Colors.transparent);

  const [showComponmentStepEleven, setshowComponmentStepEleven] = useState(true);
  const [showComponmentStepElevenArrowU, setshowComponmentStepElevenArrowU] = useState(false);
  const [showComponmentStepElevenArrowD, setshowComponmentStepElevenArrowD] = useState(true);
  const [showComponmentStepElevenbgcolor, setshowComponmentStepElevenbgcolor] = useState(Colors.transparent);

  const [showComponmentStepTwelve, setshowComponmentStepTwelve] = useState(true);
  const [showComponmentStepTwelveArrowU, setshowComponmentStepTwelveArrowU] = useState(false);
  const [showComponmentStepTwelveArrowD, setshowComponmentStepTwelveArrowD] = useState(true);
  const [showComponmentStepTwelvebgcolor, setshowComponmentStepTwelvebgcolor] = useState(Colors.transparent);

  return (
    <View style={styles.containerMain}>

       <StatusBar backgroundColor={Colors.black}/>

       <ScrollView>
              <View style={{top:10}}>

          
                  <View style={{flexDirection:"column"}}>
                 
                    <View style={styles.advImageContainerStepOne}>
                    <View style={{backgroundColor:showComponmentStepOnebgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                     
                    </View>
                    <View style={{backgroundColor:showComponmentStepOnebgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 01 - Intention (Niyyah)</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepOnebgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepOneArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepOne(true) || setshowComponmentStepOneArrowD(true) || setshowComponmentStepOneArrowU(false) ||setshowComponmentStepOnebgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepOneArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepOneArrowD(false) || setshowComponmentStepOneArrowU(true) || setshowComponmentStepOne(false) || setshowComponmentStepOnebgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepOne && (
                    <View style={styles.advImageContainerStepOne1}>
                   
                    <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                     <View style={{left:12,top:23}}>
                      <ImagePrayerNiyat/>
                     </View>
                 
                    </View>
                    <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                      
                      <Text style={{top:40,fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Make a sincere intention in your heart to perform the specific prayer (e.g., Fajr, Dhuhr, Asr, Maghrib, or Isha) solely for the sake of Allah.</Text>
                     
                    </View>                 
                   
                    </View>
                    )}

                    <View style={styles.advImageContainerStepTwo}>
                    <View style={{backgroundColor:showComponmentStepTwobgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                    
                    </View>
                    <View style={{backgroundColor:showComponmentStepTwobgcolor,flex:2}}>
                        <Text numberOfLines={2} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 02 - Takbir al-Ihram (Opening Takbir)</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepTwobgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepTwoArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepTwo(true) || setshowComponmentStepTwoArrowD(true) || setshowComponmentStepTwoArrowU(false) ||setshowComponmentStepTwobgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepTwoArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepTwoArrowD(false) || setshowComponmentStepTwoArrowU(true) || setshowComponmentStepTwo(false) || setshowComponmentStepTwobgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepTwo && (
                    <View style={styles.advImageContainerStepTwo1}>
                  
                  <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                    
                  
                     <View style={{left:12,top:23}}>
                      <ImagePrayerTakbeer/>
                      </View>
                
                    </View>
                      <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                      
                      <Text style={{top:40,fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Takbir al-Ihram (Opening Takbir): Raise your hands to your ears and say "Allahu Akbar" (Allah is the Greatest). This marks the beginning of the prayer.</Text>
                     
                      </View>  
                    </View>
                    )}

                    <View style={styles.advImageContainerStepThree}>
                    <View style={{backgroundColor:showComponmentStepThreebgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepThreebgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 03 - Qiyam (Standing)</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepThreebgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepThreeArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepThree(true) || setshowComponmentStepThreeArrowD(true) || setshowComponmentStepThreeArrowU(false) ||setshowComponmentStepThreebgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepThreeArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepThreeArrowD(false) || setshowComponmentStepThreeArrowU(true) || setshowComponmentStepThree(false) || setshowComponmentStepThreebgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepThree && (
                    <View style={styles.advImageContainerStepThree1}>
                   
                    
                       
                     <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                    
                 
                    <View style={{left:12,top:23,}}>
                     <ImagePrayerQayam/>
                    </View>
                
                 
                    </View>
                      <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                      
                      <Text style={{top:40,fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Qiyam (Standing):  Stand upright with your feet shoulder-width apart, facing the direction of the Qiblah (the Kaaba in Mecca).</Text>
                     
                      </View>  
                   
                    </View>
                    )}

                    <View style={styles.advImageContainerStepFour}>
                    <View style={{backgroundColor:showComponmentStepFourbgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepFourbgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 04 - First Rakat</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepFourbgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepFourArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepFour(true) || setshowComponmentStepFourArrowD(true) || setshowComponmentStepFourArrowU(false) ||setshowComponmentStepFourbgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepFourArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepFourArrowD(false) || setshowComponmentStepFourArrowU(true) || setshowComponmentStepFour(false) || setshowComponmentStepFourbgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepFour && (
                    <View style={styles.advImageContainerStepFour1}>
                      <View style={{flexDirection:"row"}}>
                     <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                    
                         <View style={{left:12,top:20}}>
                           <ImagePrayerQayam/>
                        
                       </View>
                     </View>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:15,alignSelf:"center",fontSize:25,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلاَ إِلَهَ غَيْرُكَ</Text>
                     </View>  
                      </View>
                      <View style={{flexDirection:"row",top:25}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:15,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Subhanaka Allahumma wa bihamdika wa tabarakasmuka, wa ta’ala jadduka wa la ilaha ghairuka</Text>
                           <View style={{backgroundColor:Colors.bordercolor,top:30,height: 0.6,marginLeft:15,marginRight:20}}/>
                     </View> 
                      
                      </View>
                      <View style={{flexDirection:"row",top:60}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                     <Text style={{top:5,alignSelf:"center",fontSize:25,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>أَعُوْذُ بِاللّٰهِ مِنَ الشَّيْطٰانِ الرَّجِيْمِ {"\n"} بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                     </Text>
                           <View style={{backgroundColor:Colors.bordercolor,top:20,height: 0.6,marginLeft:15,marginRight:20}}/>
                     </View> 
                      
                      </View>
                      <View style={{flexDirection:"row",top:80}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                     <Text style={{top:20,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Audu bi Allah i mina ashaitan i errajeem Bismillah i rrahman i erraheem</Text>
                           <View style={{backgroundColor:Colors.bordercolor,top:35,height: 0.6,marginLeft:15,marginRight:20}}/>
                     </View> 
                      
                      </View> 
                      <View style={{flexDirection:"row",top:120}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                     <Text style={{top:5,alignSelf:"center",fontSize:25,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ  ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ  مَٰلِكِ يَوۡمِ ٱلدِّينِ  إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ  ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ  صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ</Text>
                           <View style={{backgroundColor:Colors.bordercolor,top:25,height: 0.6,marginLeft:15,marginRight:20}}/>
                     </View> 
                      
                      </View> 

                      <View style={{flexDirection:"row",top:160}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                     <Text style={{right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Alhamdu lillaahi Rabbil ‘aalameen Ar-Rahmaanir-Raheem Maaliki Yawmid-Deen  Iyyaaka na’budu wa lyyaaka nasta’een Ihdinas-Siraatal-Mustaqeem Siraatal-lazeena an’amta ‘alaihim ghayril-maghdoobi ‘alaihim wa lad-daaalleen</Text>

                     </View> 
                      
                      </View> 
                    </View>
                    )}

                    <View style={styles.advImageContainerStepFive}>
                    <View style={{backgroundColor:showComponmentStepFivebgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepFivebgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 05 - Additional Quranic Recitation</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepFivebgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepFiveArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepFive(true) || setshowComponmentStepFiveArrowD(true) || setshowComponmentStepFiveArrowU(false) ||setshowComponmentStepFivebgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepFiveArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepFiveArrowD(false) || setshowComponmentStepFiveArrowU(true) || setshowComponmentStepFive(false) || setshowComponmentStepFivebgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepFive && (
                   <View style={styles.advImageContainerStepFive1}>
                   <View style={{flexDirection:"row"}}>
                  <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                  
                      <View style={{left:12,top:20}}>
                        <ImagePrayerQayam/>
                     
                    </View>
                  </View>
                  <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                        <Text style={{top:30,alignSelf:"center",fontSize:25,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ{"\n"} قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ
                        </Text>
                  </View>  
                   </View>
                   <View style={{flexDirection:"row",top:25}}>
                  <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                        <Text style={{top:15,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Bismillah i rrahman i erraheem Qul a’oozu birabbin naas</Text>
                        <View style={{backgroundColor:Colors.bordercolor,top:30,height: 0.6,marginLeft:15,marginRight:20}}/>
                  </View> 
                   
                   </View>
                   <View style={{flexDirection:"row",top:60}}>
                  <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                  <Text style={{top:5,alignSelf:"center",fontSize:25,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>مَلِكِ ٱلنَّاسِ إِلَٰهِ ٱلنَّاسِ
                  </Text>
                        <View style={{backgroundColor:Colors.bordercolor,top:16,height: 0.7,marginLeft:15,marginRight:20}}/>
                  </View> 
                   
                   </View>
                   <View style={{flexDirection:"row",top:80}}>
                  <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                  <Text style={{top:20,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Malikin naas Ilaahin naas
                  </Text>
                        <View style={{backgroundColor:Colors.bordercolor,top:40,height: 0.6,marginLeft:15,marginRight:20}}/>
                  </View> 
                   
                   </View> 
                   <View style={{flexDirection:"row",top:120}}>
                  <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                  <Text style={{top:5,alignSelf:"center",fontSize:25,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ ٱلَّذِي يُوَسۡوِسُ فِي صُدُورِ ٱلنَّاسِ مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ</Text>
                        <View style={{backgroundColor:Colors.bordercolor,top:25,height: 0.6,marginLeft:15,marginRight:20}}/>
                  </View> 
                   
                   </View> 

                   <View style={{flexDirection:"row",top:160}}>
                  <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                  <Text style={{right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Min sharril waswaasil khannaas Allazee yuwaswisu fee sudoorin naas Minal jinnati wannaas</Text>

                  </View> 
                   
                   </View> 
                 </View>
                    )}

                    <View style={styles.advImageContainerStepSix}>
                    <View style={{backgroundColor:showComponmentStepSixbgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepSixbgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 06 - Ruku (Bowing):</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepSixbgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepSixArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepSix(true) || setshowComponmentStepSixArrowD(true) || setshowComponmentStepSixArrowU(false) ||setshowComponmentStepSixbgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepSixArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepSixArrowD(false) || setshowComponmentStepSixArrowU(true) || setshowComponmentStepSix(false) || setshowComponmentStepSixbgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepSix && (
                    <View style={styles.advImageContainerStepSix1}>
                        <View style={{backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                        <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>While in prostration, recite the below for three times.</Text>
                        </View>  
                      <View style={{flexDirection:"row",top:5}}>
                        
                     <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                      
                         <View style={{left:12,top:23}}>
                           <ImagePrayerRuku/>
                        
                       </View>
                     </View>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:15,alignSelf:"center",textAlign:"center",fontSize:35,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>سُبْحَانَ رَبِّيَ الْعَظِيم</Text>
                     </View>  
                      </View>
                      <View style={{flexDirection:"row",top:45}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Subhana rabbiyal-azim</Text>
                     </View> 
                      
                      </View>
                    </View>
                    )}

                    <View style={styles.advImageContainerStepSeven}>
                    <View style={{backgroundColor:showComponmentStepSevenbgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepSevenbgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 07 - Rising from Ruku</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepSevenbgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepSevenArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepSeven(true) || setshowComponmentStepSevenArrowD(true) || setshowComponmentStepSevenArrowU(false) ||setshowComponmentStepSevenbgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepSevenArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepSevenArrowD(false) || setshowComponmentStepSevenArrowU(true) || setshowComponmentStepSeven(false) || setshowComponmentStepSevenbgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepSeven && (
                    <View style={styles.advImageContainerStepSeven1}>
                        <View style={{backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                        <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Stand back up straight and say the followings.</Text>
                        </View>  
                      <View style={{flexDirection:"row",top:8}}>
                        
                     <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                     
                         <View style={{left:12,top:23}}>
                           <ImagePrayerNiyat/>
                      
                       </View>
                     </View>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:40,alignSelf:"center",textAlign:"center",fontSize:25,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>سَمِعَ اللهُ لِمَنْ حَمِدَه، رَبَّنَا لَكَ الْحَمْدُ</Text>
                     </View>  
                      </View>
                      <View style={{flexDirection:"row",top:40}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Sami allahu liman hamidah, Rabanna lakalḥamd</Text>
                     </View> 
                      
                      </View>
                    </View>
                    )}

                    <View style={styles.advImageContainerStepEight}>
                    <View style={{backgroundColor:showComponmentStepEightbgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepEightbgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 08 - Process for Sujood: </Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepEightbgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepEightArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepEight(true) || setshowComponmentStepEightArrowD(true) || setshowComponmentStepEightArrowU(false) ||setshowComponmentStepEightbgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepEightArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepEightArrowD(false) || setshowComponmentStepEightArrowU(true) || setshowComponmentStepEight(false) || setshowComponmentStepEightbgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepEight && (
                    <View style={styles.advImageContainerStepEight1}>
                      <View style={{flexDirection:"row"}}>
                    
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                     <Text style={{top:10,right:3,alignSelf:"center",fontSize:15,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Go down to perform prostration.</Text>
                     </View>  
                      </View>
                      <View style={{flexDirection:"row",top:5}}>
                      <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                     <Text style={{top:10,right:3,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>After completing the above step; proceed for prostration by saying  "Allahu Akbar/ اللهُ أَكْبَر" by placing your forehead, nose, both palms, both knees, and toes firmly on the ground.</Text>
                     </View>
                      
                      </View>
                    </View>
                    )}

                    <View style={styles.advImageContainerStepNine}>
                    <View style={{backgroundColor:showComponmentStepNinebgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepNinebgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 09 - First Sujood (Prostration):</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepNinebgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepNineArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepNine(true) || setshowComponmentStepNineArrowD(true) || setshowComponmentStepNineArrowU(false) ||setshowComponmentStepNinebgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepNineArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepNineArrowD(false) || setshowComponmentStepNineArrowU(true) || setshowComponmentStepNine(false) || setshowComponmentStepNinebgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepNine && (
                    <View style={styles.advImageContainerStepNine1}>
                        <View style={{backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                        <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>While in prostration, recite the below for three times.</Text>
                        </View>  
                      <View style={{flexDirection:"row",top:5}}>
                        
                     <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                       
                         <View style={{left:12,top:23}}>
                           <ImagePrayerSajda/>
                      
                       </View>
                     </View>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:20,alignSelf:"center",textAlign:"center",fontSize:35,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>سُبْحَانَ رَبِّيَ {'\n'}الْأَعْلَى</Text>
                     </View>  
                      </View>
                      <View style={{flexDirection:"row",top:45}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Subhaana Rabbi Al-A’laa</Text>
                     </View> 
                      
                      </View>
                    </View>
                    )}

                    <View style={styles.advImageContainerStepTen}>
                    <View style={{backgroundColor:showComponmentStepTenbgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepTenbgcolor,flex:2}}>
                        <Text numberOfLines={2} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 10 - Rise up from sujood and sit for a moment: </Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepTenbgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepTenArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepTen(true) || setshowComponmentStepTenArrowD(true) || setshowComponmentStepTenArrowU(false) ||setshowComponmentStepTenbgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepTenArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepTenArrowD(false) || setshowComponmentStepTenArrowU(true) || setshowComponmentStepTen(false) || setshowComponmentStepTenbgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepTen && (
                    <View style={styles.advImageContainerStepTen1}>
                    
                    
                      <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                     <Text style={{top:15,right:3,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Say  "Allahu Akbar/ اللهُ أَكْبَر"  as you rise from sujood and then sit on your left leg. Your left foot will rest on the floor while your right foot is upright. Place your hands on your knees.</Text>
                     </View>
                      
                      
                    </View>
                    )}

                    <View style={styles.advImageContainerStepEleven}>
                    <View style={{backgroundColor:showComponmentStepElevenbgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepElevenbgcolor,flex:2}}>
                        <Text numberOfLines={1} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 11 - Second Sujood (Prostration):</Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepElevenbgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepElevenArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepEleven(true) || setshowComponmentStepElevenArrowD(true) || setshowComponmentStepElevenArrowU(false) ||setshowComponmentStepElevenbgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepElevenArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepElevenArrowD(false) || setshowComponmentStepElevenArrowU(true) || setshowComponmentStepEleven(false) || setshowComponmentStepElevenbgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepEleven && (
                    <View style={styles.advImageContainerStepEleven1}>
                        <View style={{backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                        <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>While in Second prostration, again recite for three times.</Text>
                        </View>  
                      <View style={{flexDirection:"row",top:5}}>
                        
                     <View style={{flex:0.8,backgroundColor:Colors.transparent,borderBottomLeftRadius:10}}>
                      
                         <View style={{left:12,top:23}}>
                           <ImagePrayerSajda/>
                     
                       </View>
                     </View>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                     <Text style={{top:20,alignSelf:"center",textAlign:"center",fontSize:35,width:"90%",color:Colors.wasilnewthemecolorthird,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>سُبْحَانَ رَبِّيَ {'\n'}الْأَعْلَى</Text>
                     </View>  
                      </View>
                      <View style={{flexDirection:"row",top:45}}>
                     <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomRightRadius:10}}>
                           <Text style={{top:10,right:5,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: Subhaana Rabbi Al-A’laa</Text>
                     </View> 
                      
                      </View>
                    </View>
                    )}

                    <View style={styles.advImageContainerStepTwelve}>
                    <View style={{backgroundColor:showComponmentStepTwelvebgcolor,flex:0.1,alignItems:"center",justifyContent:"center",borderTopLeftRadius:8,borderBottomLeftRadius:8}}>
                      
                    </View>
                    <View style={{backgroundColor:showComponmentStepTwelvebgcolor,flex:2}}>
                        <Text numberOfLines={2} style={{alignSelf:"flex-start",top:23,color:Colors.wasilnewthemecolorsecond,fontSize:15,fontWeight:"600",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Step 12 - Rise up from sujood and return to the standing position: </Text>
                    </View>
                    <View style={{backgroundColor:showComponmentStepTwelvebgcolor,flex:0.3,alignItems:"center",justifyContent:"center",borderTopRightRadius:8,borderBottomRightRadius:8}}>
                    {showComponmentStepTwelveArrowU && (
                    <TouchableOpacity onPress={()=>  setshowComponmentStepTwelve(true) || setshowComponmentStepTwelveArrowD(true) || setshowComponmentStepTwelveArrowU(false) ||setshowComponmentStepTwelvebgcolor(Colors.transparent)}>
                        <WasilNewArrowUnopenSvg/>
                    </TouchableOpacity>
                    )}
                    {showComponmentStepTwelveArrowD && (
                    <TouchableOpacity onPress={()=> setshowComponmentStepTwelveArrowD(false) || setshowComponmentStepTwelveArrowU(true) || setshowComponmentStepTwelve(false) || setshowComponmentStepTwelvebgcolor(Colors.white)}>
                        <WasilNewArrowOpenSvg/>
                    </TouchableOpacity>
                    )}
                    </View>
                    </View>
                   
                    {showComponmentStepTwelve && (
                    <View style={styles.advImageContainerStepTwelve1}>
                    
                    
                      <View style={{flex:1,backgroundColor:Colors.transparent,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                     <Text style={{top:20,right:3,alignSelf:"center",fontSize:12,width:"90%",color:Colors.secondary,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Say  "Allahu Akbar/ اللهُ أَكْبَر"  as you rise from sujood and then return to the standing position.</Text>
                     </View>
                      
                  
                    </View>
                    )}

                  </View>
              </View>             
            <View style={{height:20}}></View>
       </ScrollView>
    </View>
  );
};

export default FirstRakat;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor:Colors.white
  },
  advImageContainerStepOne: {
    width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepOne1: {
    width: "94.5%",
    height: 180,  
    flexDirection:'row',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    flex:1
  },
  advImageContainerStepTwo: {
    width: "94.5%",
    height: 90,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepTwo1: {
    width: "94.5%",
    height: 180,  
    flexDirection:'row',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    flex:1
  },
  advImageContainerStepThree: {
     width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepThree1: {
 width: "94.5%",
    height: 180,  
    flexDirection:'row',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    flex:1
  },
  advImageContainerStepFour: {
   width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepFour1: {
    width: "94.5%",
    height: 800,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepFive: {
    width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepFive1: {
    width: "94.5%",
    height: 550,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepSix: {
    width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepSix1: {
    width: "94.5%",
    height: 250,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepSeven: {
    width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepSeven1: {
    width: "94.5%",
    height: 250,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepEight: {
    width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepEight1: {
    width: "94.5%",
    height: 130,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepNine: {
    width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepNine1: {
    width: "94.5%",
    height: 250,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepTen: {
    width: "94.5%",
    height: 90,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepTen1: {
    width: "94.5%",
    height: 100,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepEleven: {
    width: "94.5%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    flex:1
  },
  advImageContainerStepEleven1: {
    width: "94.5%",
    height: 250,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent,
    flex:1
  },
  advImageContainerStepTwelve: {
    width: "94.5%",
    height: 90,  
    flexDirection:'row',
    marginTop:10,
    alignSelf:"center",
    borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
  },
  advImageContainerStepTwelve1: {
    width: "94.5%",
    height: 80,  
    flexDirection:'column',
    alignSelf:"center",
    borderTopColor:Colors.transparent,
     borderRadius:10,
    borderWidth:1.6,
    borderColor:Colors.bordercolor,
    bottom:15,
    backgroundColor:Colors.transparent
  },
  submit: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor:Colors.bordercolor,
    height:40,
    width:"85%",
    alignSelf:"center",
    top:10
  },
  submit1: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor:Colors.bordercolor,
    height:40,
    width:"85%",
    alignSelf:"center",
    bottom:10
  },
  submitText: {
    fontSize:15,
    top:9,
    color: Colors.wasilnewthemecolorthird,
    fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway',
    alignSelf:'center',
    fontWeight:"400"
  },
  advImageContainer1: {  
    top:10,
    flexDirection:'column',
    backgroundColor:"#000",
  },
});
