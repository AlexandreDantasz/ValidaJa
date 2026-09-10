import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/empty-state';
import { ItemCard } from '@/components/item-card';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useItems } from '@/context/items-context';
import { useTheme } from '@/hooks/use-theme';
import { diasAteValidade } from '@/utils/validade';

export default function HomeScreen() {
  const { itens } = useItems();
  const theme = useTheme();

  const itensAtivos = useMemo(
    () =>
      itens
        .filter((item) => item.status === 'ativo')
        .sort((a, b) => diasAteValidade(a.dataValidade) - diasAteValidade(b.dataValidade)),
    [itens],
  );

  return (
    <ScreenContainer>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerText}>
          <ThemedText type="title" style={styles.title}>
            ValidaJá
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {itensAtivos.length} {itensAtivos.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
          </ThemedText>
        </ThemedView>

        <Pressable onPress={() => router.push('/configuracoes')} hitSlop={12}>
          <ThemedView type="backgroundElement" style={styles.iconButton}>
            <ThemedText type="default">⚙️</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>

      {itensAtivos.length === 0 ? (
        <EmptyState
          titulo="Nenhum item cadastrado"
          descricao="Cadastre alimentos com a data de validade e receba lembretes antes que eles vençam."
        />
      ) : (
        <FlatList
          data={itensAtivos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable onPress={() => router.push('/item/novo')}>
        <ThemedView style={[styles.addButton, { backgroundColor: theme.text }]}>
          <ThemedText type="smallBold" style={{ color: theme.background }}>
            + Novo item
          </ThemedText>
        </ThemedView>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    gap: Spacing.half,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  iconButton: {
    padding: Spacing.two,
    borderRadius: Spacing.three,
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  addButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
});
