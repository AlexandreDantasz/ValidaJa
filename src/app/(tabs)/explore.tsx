import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useItems } from '@/context/items-context';
import { useTheme } from '@/hooks/use-theme';
import { diasAteValidade } from '@/utils/validade';

interface EstatisticaCardProps {
  numero: number;
  rotulo: string;
  cor: ThemeColor;
  icone: ComponentProps<typeof MaterialIcons>['name'];
}

/** Card de estatística, lido pelo leitor de tela como uma frase só ("2 itens consumidos"). */
function EstatisticaCard({ numero, rotulo, cor, icone }: EstatisticaCardProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={styles.card}
      accessible
      accessibilityLabel={`${numero} ${numero === 1 ? 'item' : 'itens'}: ${rotulo}`}>
      <MaterialIcons name={icone} size={24} color={theme[cor]} />
      <ThemedText type="title" style={[styles.numero, { color: theme[cor] }]}>
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
    <ScreenContainer scroll tipo="aba">
      <ScreenHeader titulo="Estatísticas" subtitulo="Acompanhe quanto desperdício você está evitando." />

      <View style={styles.grid}>
        <EstatisticaCard
          numero={resumo.consumidos}
          rotulo="Consumidos"
          cor="success"
          icone="check-circle"
        />
        <EstatisticaCard
          numero={resumo.descartados}
          rotulo="Descartados"
          cor="danger"
          icone="delete"
        />
        <EstatisticaCard
          numero={resumo.vencidosAtivos}
          rotulo="Vencidos, ainda na lista"
          cor="warning"
          icone="warning"
        />
      </View>

      <ThemedView
        type="backgroundElement"
        style={styles.destaque}
        accessible
        accessibilityLabel={
          resumo.percentualEvitado === null
            ? 'Desperdício evitado: ainda sem dados. Marque itens como consumidos ou descartados para ver esse número.'
            : `${resumo.percentualEvitado}% dos itens finalizados foram consumidos antes de vencer.`
        }>
        <ThemedText type="subtitle">
          {resumo.percentualEvitado === null ? '—' : `${resumo.percentualEvitado}%`}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.destaqueTexto}>
          {resumo.percentualEvitado === null
            ? 'Marque itens como consumidos ou descartados para ver esse número.'
            : 'dos itens finalizados foram consumidos antes de vencer.'}
        </ThemedText>
      </ThemedView>

      <PrimaryButton
        label="Ver histórico"
        variante="secundaria"
        icone="history"
        accessibilityHint="Mostra os itens já consumidos ou descartados"
        onPress={() => router.push('/historico')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
