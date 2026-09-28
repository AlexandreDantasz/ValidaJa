import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UrgencyBadge } from '@/components/urgency-badge';
import { labelCategoria, labelLocal } from '@/constants/categorias';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Item } from '@/types/item';
import { descricaoPrazo, diasAteValidade, urgenciaPorDias } from '@/utils/validade';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

/**
 * Card de item reutilizado na lista de Início. O card inteiro é o alvo de
 * toque (alvo grande, Lei de Fitts) e é lido pelo leitor de tela como uma
 * única frase com todas as informações do item.
 */
export function ItemCard({ item, onPress }: ItemCardProps) {
  const theme = useTheme();
  const dias = diasAteValidade(item.dataValidade);
  const urgencia = urgenciaPorDias(dias);
  const unidades = `${item.quantidade} ${item.quantidade === 1 ? 'unidade' : 'unidades'}`;
  const prazo = descricaoPrazo(dias);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.nome}. ${prazo}. ${labelCategoria(item.categoria)}, ${labelLocal(item.local)}, ${unidades}.`}
      accessibilityHint="Abre os detalhes do item"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement },
      ]}>
      <View style={styles.info}>
        <ThemedText type="default">{item.nome}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {labelCategoria(item.categoria)} · {labelLocal(item.local)} · {unidades}
        </ThemedText>
        <UrgencyBadge urgencia={urgencia} texto={prazo} />
      </View>
      <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: MinTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  info: {
    gap: Spacing.one,
    flexShrink: 1,
  },
});
