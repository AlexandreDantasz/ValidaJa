import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Opcao<T extends string> {
  value: T;
  label: string;
}

interface OptionPillsProps<T extends string> {
  label: string;
  opcoes: Opcao<T>[];
  valor: T;
  aoSelecionar: (valor: T) => void;
}

/**
 * Menu de seleção em formato de "pills", reutilizado para escolher categoria
 * e local de armazenamento nos formulários.
 */
export function OptionPills<T extends string>({ label, opcoes, valor, aoSelecionar }: OptionPillsProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={styles.pillsRow}>
        {opcoes.map((opcao) => {
          const selecionada = opcao.value === valor;
          return (
            <Pressable
              key={opcao.value}
              onPress={() => aoSelecionar(opcao.value)}
              style={[
                styles.pill,
                {
                  backgroundColor: selecionada ? '#208AEF' : theme.backgroundElement,
                },
              ]}>
              <ThemedText type="small" style={{ color: selecionada ? '#ffffff' : theme.text }}>
                {opcao.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
});
