import * as React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthScreen } from '@/components/auth-screen';
import { useAuthStore } from '@lifesync/hooks';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, checkSession, isLoading } = useAuthStore();

  React.useEffect(() => {
    checkSession().then(() => {
      SplashScreen.hideAsync().catch(() => {});
    });
  }, [checkSession]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {isAuthenticated ? <AppTabs /> : <AuthScreen />}
    </ThemeProvider>
  );
}
