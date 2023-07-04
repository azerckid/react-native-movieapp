import * as SplashScreen from "expo-splash-screen";
import React, { useState, useEffect } from "react";
import { Text, Image, View, useColorScheme } from "react-native";

import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Asset, useAssets } from "expo-asset";

import { NavigationContainer } from "@react-navigation/native";

import { QueryClient, QueryClientProvider } from "react-query";

import Root from "./navigation/Root";

import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./styled";

const queryClient = new QueryClient();
const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const loadImages = (images) =>
  images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.loadAsync(image);
    }
  });

export default function App() {
  const [ready, setReady] = useState(false);
  // const [assets] = useAssets([require("./assets/splash_image.png")]);
  // const [loaded] = Font.useFonts(Ionicons.font);
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    async function prepare() {
      try {
        const fonts = await loadFonts([Ionicons.font]);
        const images = await loadImages([require("./assets/splash_image.png")]);
        await Promise.all([...fonts, ...images]);
      } catch (e) {
        console.warn(e);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setReady(true);
      }
    }
    prepare();
  }, []);

  if (!ready) {
    SplashScreen.preventAutoHideAsync();
  }
  if (ready) {
    SplashScreen.hideAsync();
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }
}
