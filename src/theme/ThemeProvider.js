import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ThemeContext from "./ThemeContext";

import Blue from "./blue";
import White from "./white";
import Green from "./green";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("white");
  const [loading, setLoading] = useState(true);
  const isBlue = theme === "blue";
  const isWhite = theme === "white";
  const isGreen = theme === "green";
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("APP_THEME");

      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (e) {
      console.log("Theme Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const changeTheme = async (newTheme) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem("APP_THEME", newTheme);
    } catch (e) {
      console.log("Theme Save Error:", e);
    }
  };

  const themes = {
  blue: Blue,
  white: White,
  green: Green,
};

const Colors = themes[theme] || White;

  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
       Colors,
       theme,
       isBlue,
       isWhite,
       isGreen,
       changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}