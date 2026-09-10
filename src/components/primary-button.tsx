import { Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Variante = 'primaria' | 'secundaria' | 'perigo';

interface PrimaryButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variante?: Variante;
  disabled?: boolean;
}

const CORES_VARIANTE: Record<Variante, { fundo: string; texto: string; borda?: string }> = {
  primaria: { fundo: '#208AEF', texto: '#ffffff' },
  secundaria: { fundo: 'transparent', texto: '#208AEF', borda: '#208AEF' },
  perigo: { fundo: 'transparent', texto: '#E5484D', borda: '#E5484D' },
};

/** Botão reutilizável com variantes visuais, usado em todas as telas do app. */
export function PrimaryButton({ label, onPress, variante = 'primaria', disabled }: PrimaryButtonProps) {
  const cores = CORES_VARIANTE[variante];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: cores.fundo,
          borderColor: cores.borda ?? 'transparent',
          borderWidth: cores.borda ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}>
      <ThemedText type="smallBold" style={{ color: cores.texto }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
