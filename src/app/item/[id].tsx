import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UrgencyBadge } from '@/components/urgency-badge';
import { labelCategoria, labelLocal } from '@/constants/categorias';
import { Spacing } from '@/constants/theme';
import { useFeedback } from '@/context/feedback-context';
import { useItems } from '@/context/items-context';
import { useTheme } from '@/hooks/use-theme';
import { confirmar } from '@/utils/confirmar';
import { descricaoPrazo, diasAteValidade, formatarData, urgenciaPorDias } from '@/utils/validade';

export default function DetalhesItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarPorId, definirStatus, restaurarEstado } = useItems();
  const { mostrarFeedback } = useFeedback();
  const theme = useTheme();
  const item = buscarPorId(id);

  if (!item) {
    return (
      <ScreenContainer>
        <EmptyState
          titulo="Item não encontrado"
          descricao="Este item pode ter sido removido. Volte para a lista e tente novamente."
          icone="search-off"
        />
      </ScreenContainer>
    );
  }

  const itemAtual = item;
  const dias = diasAteValidade(itemAtual.dataValidade);
  const urgencia = urgenciaPorDias(dias);

  function consumir() {
    definirStatus(itemAtual.id, 'consumido');
    router.back();
    mostrarFeedback(`"${itemAtual.nome}" marcado como consumido`, {
      acao: { rotulo: 'Desfazer', aoPressionar: () => restaurarEstado(itemAtual) },
    });
  }

  async function descartar() {
    const confirmado = await confirmar({
      titulo: 'Descartar item?',
      mensagem: `"${itemAtual.nome}" sai da lista e passa a contar como desperdício nas estatísticas.`,
      rotuloConfirmar: 'Descartar',
      destrutivo: true,
    });
    if (!confirmado) return;

    definirStatus(itemAtual.id, 'descartado');
    router.back();
    mostrarFeedback(`"${itemAtual.nome}" descartado`, {
      tipo: 'info',
      acao: { rotulo: 'Desfazer', aoPressionar: () => restaurarEstado(itemAtual) },
    });
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title} accessibilityRole="header">
          {itemAtual.nome}
        </ThemedText>
        <UrgencyBadge urgencia={urgencia} texto={descricaoPrazo(dias)} />
      </View>

      <ThemedView type="backgroundElement" style={styles.card}>
        <InfoRow rotulo="Categoria" valor={labelCategoria(itemAtual.categoria)} />
        <InfoRow rotulo="Local" valor={labelLocal(itemAtual.local)} />
        <InfoRow rotulo="Quantidade" valor={String(itemAtual.quantidade)} />
        <InfoRow rotulo="Validade" valor={formatarData(itemAtual.dataValidade)} />
      </ThemedView>

      {/* Ações na base da tela (zona do polegar). A ação mais comum fica por
          último, mais perto da mão; a destrutiva fica separada das demais e
          pede confirmação. */}
      <View style={styles.espaco} />

      <View style={styles.acoes}>
        <PrimaryButton
          label="Descartar"
          variante="perigo"
          icone="delete-outline"
          accessibilityHint="Pede confirmação e remove o item da lista, contando como desperdício"
          onPress={descartar}
        />
        <View style={[styles.divisor, { backgroundColor: theme.backgroundSelected }]} />
        <PrimaryButton
          label="Editar"
          variante="secundaria"
          icone="edit"
          accessibilityHint="Abre o formulário de edição"
          onPress={() => router.push(`/item/editar/${itemAtual.id}`)}
        />
        <PrimaryButton
          label="Marcar como consumido"
          icone="check"
          accessibilityHint="Remove o item da lista e conta como consumido a tempo"
          onPress={consumir}
        />
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.infoRow} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      <ThemedText type="smallBold">{valor}</ThemedText>
    </View>
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
    gap: Spacing.three,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  espaco: {
    flexGrow: 1,
  },
  acoes: {
    gap: Spacing.three,
  },
  divisor: {
    height: 1,
  },
});
