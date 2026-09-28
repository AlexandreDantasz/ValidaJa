import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface ScreenHeaderProps {
  titulo: string;
  subtitulo?: string;
}

/**
 * Título das telas de aba. Marcado como cabeçalho (`header`) para que
 * leitores de tela anunciem onde o usuário está e permitam navegar por
 * cabeçalhos.
 */
export function ScreenHeader({ titulo, subtitulo }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.titulo} accessibilityRole="header">
        {titulo}
      </ThemedText>
      {subtitulo ? (
        <ThemedText type="small" themeColor="textSecondary">
          {subtitulo}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.half,
  },
  titulo: {
    fontSize: 30,
    lineHeight: 36,
  },
});
