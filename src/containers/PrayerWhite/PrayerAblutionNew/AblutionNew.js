import React,{ useState, useEffect }  from 'react';
import {  StatusBar, StyleSheet,View,TouchableOpacity,ScrollView,Image,LogBox,Text,Dimensions,Platform} from 'react-native';
import { Colors} from '../../../theme';
LogBox.ignoreAllLogs();

const wudhubackimage = {uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1766837805/prayertimes/ITW.png',};
const wudhubackimage1 = {uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1766840010/prayertimes/WSBSG.png',};
const wudhubackimage2 = {uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1766840145/prayertimes/WNYW.png',};
const wudhubackimage3 = {uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1766840144/prayertimes/HTPT.png',};
const wudhubackimage4 = {uri: 'https://res.cloudinary.com/daof5pne5/image/upload/v1766840146/prayertimes/MWSS.png',};
const { width } = Dimensions.get('window');

const AblutionNew = ({ navigation }) => { 

  return (
    <View style={styles.containerMain}>
       <StatusBar backgroundColor={Colors.black}/>
       <ScrollView>
        <TouchableOpacity onPress={() => {navigation.navigate('IntoWudhuNew')}}>
        <View style={styles.headerWrapper}>
        <Image source={wudhubackimage} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerText}>
            Introduction to Wudu
          </Text>
        </View>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {navigation.navigate('AblutionWaduStepNew')}}>
        <View style={styles.headerWrapper}>
        <Image source={wudhubackimage1} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerText1}>
            Wudhu - Step by Step Guide
          </Text>
        </View>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {navigation.navigate('NullifiesNew')}}>
        <View style={styles.headerWrapper}>
        <Image source={wudhubackimage2} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerText2}>
            What Nullifies Your Wudu?
          </Text>
        </View>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {navigation.navigate('TayammumScreen')}}>
        <View style={styles.headerWrapper}>
        <Image source={wudhubackimage3} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerText3}>
            How to perform Tayammum?
          </Text>
        </View>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {navigation.navigate('WearingSockWudhu')}}>
        <View style={styles.headerWrapper}>
        <Image source={wudhubackimage4} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerText4}>
            Making Wudu While Wearing{'\n'}Socks or Shoes?
          </Text>
        </View>
        </View>
        </TouchableOpacity>
        <View style={{height:10}}></View>
        </ScrollView>
      
    </View>
  );
};

export default AblutionNew;

const styles = StyleSheet.create({
  containerMain: {
    height:"100%",
    backgroundColor:Colors.white
  },
  advImageContainer: {
    width: "94%",
    height: 70,  
    flexDirection:'row',
    marginTop:10,
    borderRadius:8,
    borderWidth:1,
    borderColor:Colors.bordercolor,
  },
  slidercontainer: {
    width:width*0.95,
    height: 150,
    alignSelf:"center"
  },
   slidercontainer1: {
    width:width*0.95,
    height: 120,
    alignSelf:"center"
  },
  headerWrapper: {width: width*0.95, height: 150, alignSelf:"center" , marginTop:15},
  headerImage: { width: '100%', height: '100%',borderRadius:15 },
  headerOverlay: { position: 'absolute', bottom: 10,alignSelf:"center"},
  headerText: {fontSize: 20,right:Platform.OS === 'ios' ? 85 : 65,bottom:Platform.OS === 'ios' ? 15 : 25,color: Colors.white,fontWeight: '500',fontFamily:Platform.OS === 'ios' ? "Asul-Bold" : "AsulBold"},
  headerText1: {fontSize: 20, right:Platform.OS === 'ios' ? 53 : 35,bottom:Platform.OS === 'ios' ? 15 : 25,color: Colors.white,fontWeight: '500',fontFamily:Platform.OS === 'ios' ? "Asul-Bold" : "AsulBold"},
  headerText2: {fontSize: 20, right:Platform.OS === 'ios' ? 60 : 42,bottom:Platform.OS === 'ios' ? 15 : 25,color: Colors.white,fontWeight: '500',fontFamily:Platform.OS === 'ios' ? "Asul-Bold" : "AsulBold"},
  headerText3: {fontSize: 20, right:Platform.OS === 'ios' ? 47 : 35,bottom:Platform.OS === 'ios' ? 15 : 25,color: Colors.white,fontWeight: '500',fontFamily:Platform.OS === 'ios' ? "Asul-Bold" : "AsulBold"},
  headerText4: {fontSize: 20,bottom:Platform.OS === 'ios' ? 15 : 20,right:Platform.OS === 'ios' ? 47 : 25,color: Colors.white,fontWeight: '500',fontFamily:Platform.OS === 'ios' ? "Asul-Bold" : "AsulBold"},

});
