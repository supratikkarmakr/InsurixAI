import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Poppins_300Light': Poppins_300Light,
          'Poppins_400Regular': Poppins_400Regular,
          'Poppins_500Medium': Poppins_500Medium,
          'Poppins_600SemiBold': Poppins_600SemiBold,
          'Poppins_700Bold': Poppins_700Bold,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Fallback to system fonts if Poppins fails to load
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}; 