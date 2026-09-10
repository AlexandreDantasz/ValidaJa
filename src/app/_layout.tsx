import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ItemsProvider } from '@/context/items-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ItemsProvider>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="item/novo"
            options={{ title: 'Novo item', presentation: 'modal' }}
          />
          <Stack.Screen name="item/[id]" options={{ title: 'Detalhes do item' }} />
          <Stack.Screen
            name="item/editar/[id]"
            options={{ title: 'Editar item', presentation: 'modal' }}
          />
          <Stack.Screen name="configuracoes" options={{ title: 'Configurações' }} />
        </Stack>
      </ItemsProvider>
    </ThemeProvider>
  );
}
