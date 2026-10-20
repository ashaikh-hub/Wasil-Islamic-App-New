import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Colors } from "../../../theme";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "react-native-geolocation-service";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

const PrayerMosque = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // ✅ Request location permission for Android and iOS
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This app needs access to your location to find nearby mosques.",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation();
        } else {
          Alert.alert("Permission Denied", "Please allow location access in Settings.");
          loadStoredLocation();
        }
      } else if (Platform.OS === "ios") {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        if (result === RESULTS.GRANTED) {
          getUserLocation();
        } else if (result === RESULTS.BLOCKED) {
          Alert.alert(
            "Location Access Blocked",
            "Please enable location access in iPhone Settings → Privacy → Location Services."
          );
          loadStoredLocation();
        } else {
          Alert.alert("Permission Denied", "Please allow location access.");
          loadStoredLocation();
        }
      }
    } catch (err) {
      console.log("Permission error:", err);
      loadStoredLocation();
    }
  };

  // ✅ Get current location and save to AsyncStorage
  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        setLatitude(latitude);
        setLongitude(longitude);

        await AsyncStorage.setItem("ONLATI", latitude.toString());
        await AsyncStorage.setItem("ONLONGI", longitude.toString());
      },
      (error) => {
        console.log("Location Error:", error);
        Alert.alert(
          "Location Error",
          "Please make sure your location is enabled to find nearby mosques."
        );
        loadStoredLocation();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // ✅ Load stored fallback coordinates (e.g., Karachi)
  const loadStoredLocation = async () => {
    try {
      const storedLatitude = await AsyncStorage.getItem("ONLATI");
      const storedLongitude = await AsyncStorage.getItem("ONLONGI");

      if (storedLatitude && storedLongitude) {
        setLatitude(parseFloat(storedLatitude));
        setLongitude(parseFloat(storedLongitude));
      } else {
        // Default fallback — Karachi coordinates
        setLatitude(24.860735);
        setLongitude(67.001137);
      }
    } catch (error) {
      console.log("AsyncStorage error:", error);
      setLatitude(24.860735);
      setLongitude(67.001137);
    }
  };

  if (!latitude || !longitude) {
    return <View style={{ flex: 1, backgroundColor: Colors.white }} />;
  }

  return (
    <View style={styles.containerMain}>
      <WebView
        source={{
          uri: `https://www.google.com/maps/search/Mosque/@${latitude},${longitude},14z`,
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default PrayerMosque;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
