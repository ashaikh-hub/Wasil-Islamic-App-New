import React,{ useState, useEffect ,useRef} from 'react';
import {  StatusBar, StyleSheet,View ,Text,LogBox, ScrollView,TouchableOpacity,Dimensions,Platform,BackHandler,Animated} from 'react-native';
import { Colors} from '../../../theme';
import {ImageStepOneSVG,ImageStepTwoSVG,ImageStepThreeSVG,ImageStepFourSVG,ImageStepFiveSVG,ImageStepSixSVG,ImageStepSevenSVG,ImageStepEightSVG,EclipseSVG,PrayerNamazPlayBTSVG,ClosePlayDrawerSVG} from '../../../assets/icons';
import Modal from 'react-native-modal';
import YoutubePlayer from 'react-native-youtube-iframe';
const { width,height} = Dimensions.get('window');
LogBox.ignoreAllLogs();


const AblutionWaduStepNew = ({ navigation }) => { 
  const scale = useRef(new Animated.Value(1)).current;
  const [showmemodal,setshowmemodal] = useState(false);
  const lastvideolink = '2xS70Zn-jRk';
  const _toggleModal = () => {
     setshowmemodal(true)
  };
  const closetoggleModal = () => {
    setshowmemodal(false)
 };
  useEffect(() => {
    if (!BackHandler.removeEventListener) {
      BackHandler.removeEventListener = () => {};
    }
  }, [])
   useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return (
    <View style={styles.containerMain}>
       <StatusBar backgroundColor={Colors.intermediate1}/>
        
       <ScrollView>
              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:0.8,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.secondary1,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer}>
                     <View style={{left:8,top:8}}>
                      <ImageStepOneSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>1</Text>
                </View>
                    </View>
                    </View>
                      <View style={{left:15}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:13,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Make your intention to perform wudhu</Text>
                      <Text numberOfLines={2} style={{top:10,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Begin Wudhu by saying</Text>
                      <Text numberOfLines={2} style={{left:20,top:15,fontSize:20,width:"95%",textAlign:"center",color:Colors.white,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
                      <Text numberOfLines={2} style={{top:20,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration: {'\n'}Bismillahir Rahmanir Raheem.</Text>

                      </View>
              </View>
          
              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer1}>
                     <View style={{left:8,top:8}}>
                      <ImageStepTwoSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>2</Text>
                </View>
                    </View>
                    </View>
                      <View style={{left:15,width:"62%"}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:width*0.034,color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Wash both hands up to the wrists</Text>
                      <Text numberOfLines={8}style={{top:10,fontSize:10,color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Begin by cleaning your hands thoroughly, starting from the fingertips and moving towards the wrists, ensuring they are free from any dirt. Start with your right hand, washing it from the fingertips to the wrist three times. Ensure that water reaches every part of the hand. Then, repeat the same process with your left hand.</Text>

                      </View>
              </View>

              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer2}>
                     <View style={{left:8,top:8}}>
                      <ImageStepThreeSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>3</Text>
                </View>
                    </View>
                    </View>
                    <View style={{left:15,width:"62%"}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:13,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Rinse your Mouth</Text>
                      <Text style={{top:10,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Take some water into your right hand and rinse your mouth three times. Do this thoroughly to clean your mouth properly.</Text>
                      <Text style={{top:20,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Repeat this process three times</Text>

                      </View>
              </View>

              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer3}>
                     <View style={{left:8,top:8}}>
                      <ImageStepFourSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>4</Text>
                </View>
                    </View>
                    </View>
                    <View style={{left:15,width:"62%"}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:13,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Rinse your Nose</Text>
                      <Text style={{top:10,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Using your right hand, take some water and sniff it into your nose. This involves inhaling the water gently into your nostrils and then expelling it out. Be cautious not to inhale too much water to avoid discomfort.</Text>
                      <Text style={{top:20,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Repeat this process three times</Text>

                      </View>
              </View>

              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer4}>
                     <View style={{left:8,top:8}}>
                      <ImageStepFiveSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>5</Text>
                </View>
                    </View>
                    </View>
                    <View style={{left:15,width:"62%"}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:13,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Wash your face from the hairline to the chin</Text>
                      <Text style={{top:10,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Wash your entire face thoroughly, from the hairline to the chin, ensuring every part is cleansed. Cover from ear to ear and from the forehead to the chin. If you have a beard, ensure to run wet hands through it while washing your face.</Text>
                      <Text style={{top:13,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Repeat this process three times</Text>

                      </View>
              </View>

              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer5}>
                     <View style={{left:8,top:8}}>
                      <ImageStepSixSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>6</Text>
                </View>
                    </View>
                    </View>
                      <View style={{left:15,width:"62%"}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:13,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Wash your both arms up to the elbow</Text>
                      <Text style={{top:10,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Begin by washing your right arm from the fingertips up to the elbow. Ensure thorough coverage, leaving no part dry. Then, repeat the same process for your left arm.</Text>
                      <Text style={{top:20,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Repeat this process three times</Text>

                      </View>
              </View>

              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer6}>
                     <View style={{left:8,top:8}}>
                      <ImageStepSevenSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>7</Text>
                </View>
                    </View>
                    </View>
                      <View style={{left:15,width:"62%"}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:13,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Wipe your head & ears with wet hands</Text>
                      <Text style={{top:15,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Wipe your head with wet hands, moving gently from your forehead to the back of your head, then from the back to the forehead. Afterward, gently wipe both the inside and outside of your ears with wet fingers.</Text>
                    
                      </View>
              </View>

              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer7}>
                     <View style={{left:8,top:8}}>
                      <ImageStepEightSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>8</Text>
                </View>
                    </View>
                    </View>
                      <View style={{left:15,width:"62%"}}>
                      <Text numberOfLines={2} style={{top:10,fontSize:13,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Wash Your both Feet</Text>
                      <Text style={{top:15,fontSize:10,width:"95%",color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Start by washing your right foot, beginning from the toes and working up to and including the ankle. Ensure that water reaches every part of the right foot, including between the toes and the back of the ankle. Then, repeat the same process for your left foot.</Text>
                    
                      </View>
              </View>

              
              <View style={{flexDirection:"row", 
                      borderRadius:10,
                      borderWidth:1,
                      backgroundColor:Colors.primary,
                      borderColor:Colors.bordercolor,marginTop:15,marginLeft:10,marginRight:10}}>
                      <View>
                    
                    <View style={styles.advImageContainer8}>
                     <View style={{left:8,top:8}}>
                      <ImageStepOneSVG/>
                      </View>
                      <View>
                  <View style={{bottom:115,left:15}}>
                <EclipseSVG/>
                </View>
                <Text style={{bottom:144,left:24,fontSize:20,fontWeight:"bold",color:Colors.white,fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>9</Text>
                </View>
                    </View>
                    </View>
                      <View style={{left:15,width:"62%"}}>
                      <Text style={{top:5,fontSize:20,textAlign:"center",color:Colors.white,fontWeight:"500",fontFamily: Platform.OS === 'ios' ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran',}}>أَشْهَدُ أَنْ لا إِلَـٰهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَـهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ</Text>
                      <Text style={{top:15,fontSize:10,color:Colors.white,fontWeight:"500",fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}}>Transliteration:Ashhadu alla ilaha illallah, wa ashhadu anna Muhammadan 'abduhu wa rasuluhu.</Text>
                     
                      </View>
                      
              </View>
        <View style={{height:20}}></View>
       </ScrollView>
       <View style = {{resizeMode:"contain",top:height*0.5,right:15,alignSelf:"flex-end",width:50,height:50,position:"absolute"}}>
       <TouchableOpacity onPress={_toggleModal}>
        <Animated.View
              style={{
                transform: [{ scale }],
              }}
            >
               <PrayerNamazPlayBTSVG/>
            </Animated.View>
     
       </TouchableOpacity>
       <Modal isVisible={showmemodal} animationType={'none'}>
                  <View
                    style={{
                      width: "100%",
                      height: 188,
                      alignSelf:"center",
                     
                      marginTop: 50,
                     
                      backgroundColor: 'white',
                    }}>
                  <View style = {{resizeMode:"contain",right:-35,zIndex:1,top:-12,alignSelf:"flex-end",width:50,height:70,position:"absolute"}}>
       <TouchableOpacity onPress={closetoggleModal}>
       <ClosePlayDrawerSVG/>
       </TouchableOpacity>
       </View>
                    
                    <View>
                    <View style={{flex:1}}>
                         <YoutubePlayer height={200} play={true} videoId={lastvideolink} />
                      </View>
                      
                    </View>
                  </View>
                </Modal>
       </View>
 
    </View>
  );
};

export default AblutionWaduStepNew;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor:Colors.intermediate1
  },
  slidercontainer: {
    backgroundColor: Colors.intermediate1,
    height: 120,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20
  },
  advImageContainer: {
   height: 150,
   flexDirection:'column',
 },
 advImageContainer1: {
   height: 155,
   flexDirection:'column',
 },
 advImageContainer2:{
   height: 150,
   flexDirection:'column',
 },
 advImageContainer3:{
   height: 150,
   flexDirection:'column',
 },
 advImageContainer4:{
  height: 170,
  flexDirection:'column',
},
advImageContainer5:{
  height: 150,
  flexDirection:'column',
},
advImageContainer6:{
  height: 150,
  flexDirection:'column',
},
advImageContainer7:{
  height: 150,
  flexDirection:'column',
},
advImageContainer8:{
  height: 170,
  flexDirection:'column',
},
 advImage: {
   flex:1,
   width: 180,
   height: 120,
   resizeMode: 'cover',
   borderTopLeftRadius:10,
   borderBottomLeftRadius:10,
 },
 submit: {
   backgroundColor: Colors.transparent,
   borderRadius: 15,
   borderWidth: 1.5,
   borderColor: Colors.wasilnewthemecolorsecond,
   height:25,
   width:70,
   top:10,
   left:5
 },
 submitText: {
   fontSize:12,
   flexDirection:"column",
   color: Colors.wasilnewthemecolorsecond,
   alignSelf:'center',
   fontWeight:"500",
   fontFamily:Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway',
   top:1
 },
});
