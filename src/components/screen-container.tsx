import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

interface ScreenContainerProps extends ViewProps {
  scroll?: boolean;
}

/**
 * Wrapper comum a todas as telas: respeita a safe area, centraliza o
 * conteúdo em telas largas (tablet/web) e limita a largura máxima de leitura,
 * para que o layout se adapte a diferentes tamanhos de tela.
 */
export function ScreenContainer({ children, style, scroll = false, ...rest }: ScreenContainerProps) {
  const Wrapper = scroll ? ScrollView : View;
  const contentProps = scroll
    ? { contentContainerStyle: [styles.inner, style] }
    : { style: [styles.inner, style] };

  return (
    <ThemedView style={styles.outer}>
      <SafeAreaView style={styles.safeArea}>
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
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.four,
  },
});
