import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UrgencyBadge } from '@/components/urgency-badge';
import { labelCategoria, labelLocal } from '@/constants/categorias';
import { Spacing } from '@/constants/theme';
import { useItems } from '@/context/items-context';
import { descricaoPrazo, diasAteValidade, formatarData, urgenciaPorDias } from '@/utils/validade';

export default function DetalhesItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarPorId, definirStatus } = useItems();
  const item = buscarPorId(id);

  if (!item) {
    return (
      <ScreenContainer>
        <ThemedText type="default">Item não encontrado.</ThemedText>
      </ScreenContainer>
    );
  }

  const dias = diasAteValidade(item.dataValidade);
  const urgencia = urgenciaPorDias(dias);

  function finalizar(status: 'consumido' | 'descartado') {
    definirStatus(item!.id, status);
    router.back();
  }

  return (
    <ScreenContainer>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {item.nome}
        </ThemedText>
        <UrgencyBadge urgencia={urgencia} texto={descricaoPrazo(dias)} />
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.card}>
        <InfoRow rotulo="Categoria" valor={labelCategoria(item.categoria)} />
        <InfoRow rotulo="Local" valor={labelLocal(item.local)} />
        <InfoRow rotulo="Quantidade" valor={String(item.quantidade)} />
        <InfoRow rotulo="Validade" valor={formatarData(item.dataValidade)} />
      </ThemedView>

      <ThemedView style={styles.acoes}>
        <PrimaryButton label="Editar" variante="secundaria" onPress={() => router.push(`/item/editar/${item.id}`)} />
        <PrimaryButton label="Marcar como consumido" onPress={() => finalizar('consumido')} />
        <PrimaryButton label="Descartar (venceu)" variante="perigo" onPress={() => finalizar('descartado')} />
      </ThemedView>
    </ScreenContainer>
  );
}

function InfoRow({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <ThemedView style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      <ThemedText type="smallBold">{valor}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acoes: {
    gap: Spacing.two,
  },
});
