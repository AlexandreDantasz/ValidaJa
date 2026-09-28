import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

interface ScreenContainerProps extends ViewProps {
  scroll?: boolean;
  /**
   * `aba`: telas das abas (sem cabeçalho nativo — respeita a safe area do topo).
   * `pilha`: telas empilhadas, cujo cabeçalho nativo já trata o topo.
   */
  tipo?: 'aba' | 'pilha';
}

const EDGES: Record<'aba' | 'pilha', Edge[]> = {
  aba: ['top', 'left', 'right'],
  pilha: ['bottom', 'left', 'right'],
};

/**
 * Wrapper comum a todas as telas: respeita a safe area, centraliza o
 * conteúdo em telas largas (tablet/web) e limita a largura máxima de leitura,
 * para que o layout se adapte a diferentes tamanhos de tela.
 */
export function ScreenContainer({
  children,
  style,
  scroll = false,
  tipo = 'pilha',
  ...rest
}: ScreenContainerProps) {
  const Wrapper = scroll ? ScrollView : View;
  const contentProps = scroll
    ? { style: styles.scroll, contentContainerStyle: [styles.inner, style] }
    : { style: [styles.inner, style] };

  return (
    <ThemedView style={styles.outer}>
      <SafeAreaView style={styles.safeArea} edges={EDGES[tipo]}>
        <Wrapper {...contentProps} {...rest}>
          {children}
        </Wrapper>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    alignSelf: 'stretch',
  },
  inner: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.four,
  },
});
