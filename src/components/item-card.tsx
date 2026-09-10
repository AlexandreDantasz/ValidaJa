import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UrgencyBadge } from '@/components/urgency-badge';
import { labelCategoria, labelLocal } from '@/constants/categorias';
import { Spacing } from '@/constants/theme';
import type { Item } from '@/types/item';
import { descricaoPrazo, diasAteValidade, urgenciaPorDias } from '@/utils/validade';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

/** Card de item reutilizado na lista de Início. */
export function ItemCard({ item, onPress }: ItemCardProps) {
  const dias = diasAteValidade(item.dataValidade);
  const urgencia = urgenciaPorDias(dias);

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <ThemedView type="backgroundElement" style={[styles.card, { opacity: pressed ? 0.8 : 1 }]}>
          <ThemedView style={styles.info}>
            <ThemedText type="default">{item.nome}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {labelCategoria(item.categoria)} · {labelLocal(item.local)} · {item.quantidade}{' '}
              {item.quantidade === 1 ? 'unidade' : 'unidades'}
            </ThemedText>
          </ThemedView>
          <UrgencyBadge urgencia={urgencia} texto={descricaoPrazo(dias)} />
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  info: {
    gap: Spacing.half,
    flexShrink: 1,
  },
});
