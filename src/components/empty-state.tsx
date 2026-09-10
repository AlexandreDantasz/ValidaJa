import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface EmptyStateProps {
  titulo: string;
  descricao: string;
}

/** Estado vazio reutilizável, usado sempre que uma lista não tem itens. */
export function EmptyState({ titulo, descricao }: EmptyStateProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="subtitle">{titulo}</ThemedText>
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
  descricao: {
    textAlign: 'center',
  },
});
