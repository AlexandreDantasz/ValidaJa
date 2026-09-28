import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { OptionPills } from '@/components/option-pills';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { labelCategoria } from '@/constants/categorias';
import { Spacing } from '@/constants/theme';
import { useFeedback } from '@/context/feedback-context';
import { useItems } from '@/context/items-context';
import { useTheme } from '@/hooks/use-theme';
import type { Item } from '@/types/item';
import { formatarData } from '@/utils/validade';

type Filtro = 'todos' | 'consumido' | 'descartado';

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'consumido', label: 'Consumidos' },
  { value: 'descartado', label: 'Descartados' },
];

const MENSAGEM_VAZIO: Record<Filtro, string> = {
  todos: 'Quando você marcar um item como consumido ou descartado, ele aparece aqui.',
  consumido: 'Nenhum item foi marcado como consumido ainda.',
  descartado: 'Nenhum item foi descartado. Continue assim!',
};

function HistoricoCard({ item, aoRestaurar }: { item: Item; aoRestaurar: () => void }) {
  const theme = useTheme();
  const consumido = item.status === 'consumido';
  const cor = consumido ? theme.success : theme.danger;
  const statusTexto = consumido ? 'Consumido' : 'Descartado';
  const data = item.finalizadoEm ? ` em ${formatarData(item.finalizadoEm)}` : '';

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View
        style={styles.cardInfo}
        accessible
        accessibilityLabel={`${item.nome}, ${labelCategoria(item.categoria)}. ${statusTexto}${data}.`}>
        <ThemedText type="default">{item.nome}</ThemedText>
        <View style={styles.status}>
          <MaterialIcons name={consumido ? 'check-circle' : 'delete'} size={16} color={cor} />
          <ThemedText type="smallBold" style={{ color: cor }}>
            {statusTexto}
            {data}
          </ThemedText>
        </View>
      </View>
      <PrimaryButton
        label="Restaurar"
        variante="secundaria"
        icone="undo"
        accessibilityHint={`Devolve ${item.nome} para a lista de itens ativos`}
        onPress={aoRestaurar}
      />
    </ThemedView>
  );
}

/**
 * Histórico de itens finalizados (consumidos ou descartados), acessado pela
 * aba Estatísticas. Permite filtrar por situação e restaurar um item que
 * foi finalizado por engano.
 */
export default function HistoricoScreen() {
  const { itens, definirStatus, restaurarEstado } = useItems();
  const { mostrarFeedback } = useFeedback();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const finalizados = useMemo(
    () =>
      itens
        .filter((item) => item.status !== 'ativo')
        .filter((item) => filtro === 'todos' || item.status === filtro)
        .sort((a, b) => (b.finalizadoEm ?? '').localeCompare(a.finalizadoEm ?? '')),
    [itens, filtro],
  );

  function restaurar(item: Item) {
    definirStatus(item.id, 'ativo');
    mostrarFeedback(`"${item.nome}" voltou para a lista de itens`, {
      acao: { rotulo: 'Desfazer', aoPressionar: () => restaurarEstado(item) },
    });
  }

  return (
    <ScreenContainer>
      <OptionPills label="Mostrar" opcoes={FILTROS} valor={filtro} aoSelecionar={setFiltro} />

      {finalizados.length === 0 ? (
        <EmptyState titulo="Nada por aqui" descricao={MENSAGEM_VAZIO[filtro]} icone="history" />
      ) : (
        <FlatList
          data={finalizados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoricoCard item={item} aoRestaurar={() => restaurar(item)} />}
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
  },
  listaConteudo: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  cardInfo: {
    gap: Spacing.one,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
