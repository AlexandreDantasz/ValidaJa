import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>{emoji}</Text>;
}

/**
 * Navegação por abas entre Início e Estatísticas. Usa o navegador de abas
 * padrão do Expo Router (em vez do NativeTabs, ainda instável) para permitir
 * telas empilhadas (cadastro, detalhes, configurações) sobre a mesma navegação.
 */
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.background, borderTopColor: theme.backgroundElement },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Estatísticas',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 20,
  },
});
