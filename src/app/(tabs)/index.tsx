import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/empty-state';
import { ItemCard } from '@/components/item-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { ScreenHeader } from '@/components/screen-header';
import { Spacing } from '@/constants/theme';
import { useItems } from '@/context/items-context';
import { diasAteValidade, urgenciaPorDias } from '@/utils/validade';

function resumoDaLista(total: number, precisamAtencao: number): string {
  if (total === 0) return 'Nenhum item cadastrado';
  const itens = `${total} ${total === 1 ? 'item cadastrado' : 'itens cadastrados'}`;
  if (precisamAtencao === 0) return `${itens} · tudo em dia`;
  return `${itens} · ${precisamAtencao} ${precisamAtencao === 1 ? 'precisa' : 'precisam'} de atenção`;
}

export default function HomeScreen() {
  const { itens } = useItems();

  const itensAtivos = useMemo(
    () =>
      itens
        .filter((item) => item.status === 'ativo')
        .sort((a, b) => diasAteValidade(a.dataValidade) - diasAteValidade(b.dataValidade)),
    [itens],
  );

  const precisamAtencao = itensAtivos.filter((item) => {
    const urgencia = urgenciaPorDias(diasAteValidade(item.dataValidade));
    return urgencia === 'vencido' || urgencia === 'urgente';
  }).length;

  return (
    <ScreenContainer tipo="aba">
      <ScreenHeader titulo="ValidaJá" subtitulo={resumoDaLista(itensAtivos.length, precisamAtencao)} />

      {itensAtivos.length === 0 ? (
        <View style={styles.lista}>
          <EmptyState
            titulo="Nenhum item cadastrado"
            descricao='Toque em "Novo item" para cadastrar um alimento com a data de validade e receber lembretes antes que ele vença.'
          />
        </View>
      ) : (
        <FlatList
          data={itensAtivos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
          )}
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
          accessibilityLabel="Itens ordenados pela data de validade, do mais urgente ao menos urgente"
        />
      )}

      {/* Ação principal da tela fixa na base, com largura total: alvo grande
          e na zona de alcance do polegar (Lei de Fitts). */}
      <PrimaryButton
        label="Novo item"
        icone="add"
        accessibilityHint="Abre o formulário de cadastro de item"
        onPress={() => router.push('/item/novo')}
      />
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
});
