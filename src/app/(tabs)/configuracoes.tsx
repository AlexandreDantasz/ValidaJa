import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MIN_DIAS = 1;
const MAX_DIAS = 14;

function textoDias(dias: number) {
  return `${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

interface BotaoStepperProps {
  icone: 'remove' | 'add';
  disabled: boolean;
  onPress: () => void;
}

function BotaoStepper({ icone, disabled, onPress }: BotaoStepperProps) {
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      // O stepper inteiro é exposto ao leitor de tela como um único controle
      // ajustável; os botões servem apenas ao toque.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      accessibilityRole="button"
      accessibilityLabel={icone === 'add' ? 'Aumentar' : 'Diminuir'}
      style={({ pressed }) => [
        styles.stepperButton,
        {
          backgroundColor: pressed ? theme.border : theme.backgroundSelected,
          opacity: disabled ? 0.4 : 1,
        },
      ]}>
      <MaterialIcons name={icone} size={24} color={theme.text} />
    </Pressable>
  );
}

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [diasAntecedencia, setDiasAntecedencia] = useState(3);

  const diminuir = () => setDiasAntecedencia((dias) => Math.max(MIN_DIAS, dias - 1));
  const aumentar = () => setDiasAntecedencia((dias) => Math.min(MAX_DIAS, dias + 1));

  return (
    <ScreenContainer scroll tipo="aba">
      <ScreenHeader titulo="Ajustes" subtitulo="Preferências de lembretes de validade." />

      {/* A linha inteira alterna o switch: alvo de toque muito maior que o próprio switch. */}
      <Pressable
        onPress={() => setNotificacoesAtivas((ativo) => !ativo)}
        accessibilityRole="switch"
        accessibilityLabel="Lembretes de validade"
        accessibilityHint="Avisar antes de um item vencer"
        accessibilityState={{ checked: notificacoesAtivas }}
        style={({ pressed }) => [
          styles.card,
          styles.linha,
          { backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement },
        ]}>
        <View style={styles.linhaTexto}>
          <ThemedText type="default">Lembretes de validade</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {notificacoesAtivas ? 'Ativados — você será avisado antes de um item vencer' : 'Desativados'}
          </ThemedText>
        </View>
        {/* O toque é tratado pela linha inteira; o Switch é só o indicador visual. */}
        <View
          pointerEvents="none"
          aria-hidden
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          <Switch
            value={notificacoesAtivas}
            trackColor={{ true: theme.primary, false: theme.border }}
          />
        </View>
      </Pressable>

      <ThemedView
        type="backgroundElement"
        style={[styles.card, { opacity: notificacoesAtivas ? 1 : 0.5 }]}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Antecedência do aviso"
        accessibilityHint={
          notificacoesAtivas
            ? 'Deslize para cima ou para baixo para ajustar quantos dias antes do vencimento avisar'
            : 'Indisponível: ative os lembretes para ajustar'
        }
        accessibilityState={{ disabled: !notificacoesAtivas }}
        accessibilityValue={{
          min: MIN_DIAS,
          max: MAX_DIAS,
          now: diasAntecedencia,
          text: `${textoDias(diasAntecedencia)} antes`,
        }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(evento) => {
          if (!notificacoesAtivas) return;
          if (evento.nativeEvent.actionName === 'increment') aumentar();
          if (evento.nativeEvent.actionName === 'decrement') diminuir();
        }}>
        <View style={styles.linhaTexto}>
          <ThemedText type="default">Antecedência do aviso</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Quantos dias antes do vencimento avisar
          </ThemedText>
        </View>

        <View style={styles.stepper}>
          <BotaoStepper
            icone="remove"
            disabled={!notificacoesAtivas || diasAntecedencia <= MIN_DIAS}
            onPress={diminuir}
          />
          <ThemedText type="subtitle" style={styles.stepperValor}>
            {diasAntecedencia}
          </ThemedText>
          <BotaoStepper
            icone="add"
            disabled={!notificacoesAtivas || diasAntecedencia >= MAX_DIAS}
            onPress={aumentar}
          />
        </View>
        <ThemedText type="small" themeColor="textSecondary" style={styles.centro}>
          {textoDias(diasAntecedencia)} antes do vencimento
        </ThemedText>
      </ThemedView>

      <View style={styles.aviso}>
        <MaterialIcons name="info-outline" size={18} color={theme.textSecondary} />
        <ThemedText type="small" themeColor="textSecondary" style={styles.avisoTexto}>
          Estas preferências ainda não são salvas entre sessões — a persistência de dados entra em
          uma etapa futura do projeto.
        </ThemedText>
      </View>
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
    minHeight: MinTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: MinTouchTarget + Spacing.two,
    height: MinTouchTarget + Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValor: {
    minWidth: 48,
    textAlign: 'center',
  },
  centro: {
    textAlign: 'center',
  },
  aviso: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  avisoTexto: {
    flexShrink: 1,
  },
});
