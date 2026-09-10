import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useItems } from '@/context/items-context';
import { diasAteValidade } from '@/utils/validade';

interface EstatisticaCardProps {
  numero: number;
  rotulo: string;
  cor: string;
}

function EstatisticaCard({ numero, rotulo, cor }: EstatisticaCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="title" style={[styles.numero, { color: cor }]}>
        {numero}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
    </ThemedView>
  );
}

export default function StatsScreen() {
  const { itens } = useItems();

  const resumo = useMemo(() => {
    const consumidos = itens.filter((item) => item.status === 'consumido').length;
    const descartados = itens.filter((item) => item.status === 'descartado').length;
    const vencidosAtivos = itens.filter(
      (item) => item.status === 'ativo' && diasAteValidade(item.dataValidade) < 0,
    ).length;
    const total = consumidos + descartados;
    const percentualEvitado = total > 0 ? Math.round((consumidos / total) * 100) : null;

    return { consumidos, descartados, vencidosAtivos, percentualEvitado };
  }, [itens]);

  return (
    <ScreenContainer scroll>
      <ThemedText type="title" style={styles.title}>
        Estatísticas
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Acompanhe quanto desperdício você está evitando.
      </ThemedText>

      <ThemedView style={styles.grid}>
        <EstatisticaCard numero={resumo.consumidos} rotulo="Consumidos a tempo" cor="#30A46C" />
        <EstatisticaCard numero={resumo.descartados} rotulo="Descartados por vencimento" cor="#E5484D" />
        <EstatisticaCard numero={resumo.vencidosAtivos} rotulo="Vencidos, ainda na lista" cor="#F5A623" />
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.destaque}>
        <ThemedText type="subtitle">
          {resumo.percentualEvitado === null ? '—' : `${resumo.percentualEvitado}%`}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.destaqueTexto}>
          {resumo.percentualEvitado === null
            ? 'Marque itens como consumidos ou descartados para ver esse número.'
            : 'dos itens finalizados foram consumidos antes de vencer.'}
        </ThemedText>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  card: {
    flexGrow: 1,
    flexBasis: 140,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  numero: {
    fontSize: 32,
    lineHeight: 36,
  },
  destaque: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.one,
    alignItems: 'center',
  },
  destaqueTexto: {
    textAlign: 'center',
  },
});
