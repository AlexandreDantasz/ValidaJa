import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variante = 'primaria' | 'secundaria' | 'perigo';

interface PrimaryButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variante?: Variante;
  disabled?: boolean;
  icone?: ComponentProps<typeof MaterialIcons>['name'];
  /** Explica ao leitor de tela o resultado do toque, quando o rótulo não basta. */
  accessibilityHint?: string;
}

const COR_VARIANTE: Record<Variante, ThemeColor> = {
  primaria: 'primary',
  secundaria: 'primary',
  perigo: 'danger',
};

/**
 * Botão reutilizável com variantes visuais, usado em todas as telas do app.
 * Tem altura mínima de 48dp (Lei de Fitts) e estados visuais distintos para
 * pressionado e desabilitado.
 */
export function PrimaryButton({
  label,
  onPress,
  variante = 'primaria',
  disabled,
  icone,
  accessibilityHint,
}: PrimaryButtonProps) {
  const theme = useTheme();
  const cor = theme[COR_VARIANTE[variante]];
  const preenchido = variante === 'primaria';
  const corTexto = preenchido ? theme.onPrimary : cor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: preenchido ? cor : pressed ? theme.backgroundSelected : 'transparent',
          borderColor: cor,
          opacity: disabled ? 0.45 : preenchido && pressed ? 0.8 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}>
      {icone ? <MaterialIcons name={icone} size={20} color={corTexto} /> : null}
      <ThemedText type="smallBold" style={[styles.label, { color: corTexto }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MinTouchTarget + Spacing.one,
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
  },
});
