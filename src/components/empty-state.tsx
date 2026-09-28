import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface EmptyStateProps {
  titulo: string;
  descricao: string;
  icone?: ComponentProps<typeof MaterialIcons>['name'];
}

/** Estado vazio reutilizável, usado sempre que uma lista não tem itens. */
export function EmptyState({ titulo, descricao, icone = 'inventory-2' }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={styles.container}
      accessible
      accessibilityLabel={`${titulo}. ${descricao}`}>
      <MaterialIcons name={icone} size={40} color={theme.textSecondary} />
      <ThemedText type="default" style={styles.titulo}>
        {titulo}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.descricao}>
        {descricao}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 600,
    textAlign: 'center',
  },
  descricao: {
    textAlign: 'center',
  },
});
