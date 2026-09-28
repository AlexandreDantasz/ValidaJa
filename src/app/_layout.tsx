import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { FeedbackProvider } from '@/context/feedback-context';
import { ItemsProvider } from '@/context/items-context';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

/** Botão "Cancelar" dos formulários abertos como modal — saída explícita, além do gesto/botão voltar. */
function BotaoCancelar() {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Cancelar"
      accessibilityHint="Fecha o formulário sem salvar"
      style={({ pressed }) => [styles.botaoCabecalho, pressed && { opacity: 0.6 }]}>
      <ThemedText type="default" style={{ color: theme.primary }}>
        Cancelar
      </ThemedText>
    </Pressable>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ItemsProvider>
        <FeedbackProvider>
          <AnimatedSplashOverlay />
          <Stack
            screenOptions={{
              headerTintColor: theme.primary,
              headerTitleStyle: { color: theme.text },
              headerBackButtonDisplayMode: 'minimal',
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Início' }} />
            <Stack.Screen
              name="item/novo"
              options={{ title: 'Novo item', presentation: 'modal', headerLeft: BotaoCancelar }}
            />
            <Stack.Screen name="item/[id]" options={{ title: 'Detalhes do item' }} />
            <Stack.Screen
              name="item/editar/[id]"
              options={{ title: 'Editar item', presentation: 'modal', headerLeft: BotaoCancelar }}
            />
            <Stack.Screen name="historico" options={{ title: 'Histórico' }} />
          </Stack>
        </FeedbackProvider>
      </ItemsProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  botaoCabecalho: {
    minHeight: MinTouchTarget,
    minWidth: MinTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
  },
});
