import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Opcao<T extends string> {
  value: T;
  label: string;
  /** Texto lido pelo leitor de tela, quando o rótulo visual é abreviado. */
  accessibilityLabel?: string;
}

interface OptionPillsProps<T extends string> {
  label: string;
  opcoes: Opcao<T>[];
  valor: T;
  aoSelecionar: (valor: T) => void;
}

/**
 * Menu de seleção única em formato de "pills" (categoria, local de
 * armazenamento, atalhos de data, filtros). Para o leitor de tela funciona
 * como um grupo de botões de opção (radio), anunciando qual está marcada;
 * visualmente a opção marcada tem cor, borda e ícone de check — nunca só cor.
 */
export function OptionPills<T extends string>({ label, opcoes, valor, aoSelecionar }: OptionPillsProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={styles.pillsRow} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {opcoes.map((opcao) => {
          const selecionada = opcao.value === valor;
          const corTexto = selecionada ? theme.onPrimary : theme.text;
          return (
            <Pressable
              key={opcao.value}
              onPress={() => aoSelecionar(opcao.value)}
              accessibilityRole="radio"
              accessibilityLabel={opcao.accessibilityLabel ?? opcao.label}
              accessibilityState={{ checked: selecionada, selected: selecionada }}
              style={({ pressed }) => [
                styles.pill,
                {
                  backgroundColor: selecionada
                    ? theme.primary
                    : pressed
                      ? theme.backgroundSelected
                      : theme.backgroundElement,
                  borderColor: selecionada ? theme.primary : theme.border,
                },
              ]}>
              {selecionada ? <MaterialIcons name="check" size={18} color={corTexto} /> : null}
              <ThemedText type={selecionada ? 'smallBold' : 'small'} style={{ color: corTexto }}>
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
    gap: Spacing.two,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    minHeight: MinTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    borderWidth: 1,
  },
});
