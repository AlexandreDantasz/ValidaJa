import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type NomeIcone = ComponentProps<typeof MaterialIcons>['name'];

function iconeDaAba(nome: NomeIcone) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <MaterialIcons name={nome} size={size} color={color} />;
  };
}

/**
 * Navegação principal por abas na base da tela — zona de alcance do polegar
 * (Lei de Fitts) — entre as três áreas do app: Início, Estatísticas e
 * Ajustes. A aba ativa é indicada pela cor do ícone e do rótulo e anunciada
 * como "selecionada" pelo leitor de tela; cada aba tem um rótulo acessível
 * próprio.
 */
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 12, fontWeight: 600 },
        tabBarStyle: { backgroundColor: theme.background, borderTopColor: theme.border },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarAccessibilityLabel: 'Início, lista de itens',
          tabBarIcon: iconeDaAba('kitchen'),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Estatísticas',
          tabBarAccessibilityLabel: 'Estatísticas de desperdício',
          tabBarIcon: iconeDaAba('insights'),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Ajustes',
          tabBarAccessibilityLabel: 'Ajustes de notificação',
          tabBarIcon: iconeDaAba('settings'),
        }}
      />
    </Tabs>
  );
}
