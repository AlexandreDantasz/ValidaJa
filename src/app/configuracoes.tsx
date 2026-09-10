import { useState } from 'react';
import { Pressable, StyleSheet, Switch } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [diasAntecedencia, setDiasAntecedencia] = useState(3);

  return (
    <ScreenContainer>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedView style={styles.linha}>
          <ThemedView style={styles.linhaTexto}>
            <ThemedText type="default">Lembretes de validade</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Avisar antes de um item vencer
            </ThemedText>
          </ThemedView>
          <Switch value={notificacoesAtivas} onValueChange={setNotificacoesAtivas} />
        </ThemedView>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedView style={styles.linhaTexto}>
          <ThemedText type="default">Antecedência do aviso</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Quantos dias antes do vencimento avisar
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepper}>
          <Pressable
            disabled={diasAntecedencia <= 1}
            onPress={() => setDiasAntecedencia((dias) => Math.max(1, dias - 1))}
            style={[styles.stepperButton, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText type="subtitle">−</ThemedText>
          </Pressable>

          <ThemedText type="title" style={styles.stepperValor}>
            {diasAntecedencia}
          </ThemedText>

          <Pressable
            disabled={diasAntecedencia >= 14}
            onPress={() => setDiasAntecedencia((dias) => Math.min(14, dias + 1))}
            style={[styles.stepperButton, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText type="subtitle">+</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ThemedText type="small" themeColor="textSecondary">
        Estas preferências ainda não são salvas entre sessões — a persistência de dados entra em
        uma etapa futura do projeto.
      </ThemedText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  linhaTexto: {
    gap: Spacing.half,
    flexShrink: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValor: {
    minWidth: 40,
    textAlign: 'center',
  },
});
