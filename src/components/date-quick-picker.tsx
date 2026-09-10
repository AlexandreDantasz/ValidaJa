import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { adicionarDias, formatarData } from '@/utils/validade';

interface DateQuickPickerProps {
  label: string;
  valorISO: string;
  aoSelecionar: (dataISO: string) => void;
}

const ATALHOS = [
  { rotulo: 'Hoje', dias: 0 },
  { rotulo: '+3 dias', dias: 3 },
  { rotulo: '+7 dias', dias: 7 },
  { rotulo: '+30 dias', dias: 30 },
];

/**
 * Menu de atalhos para escolher a data de validade sem exigir um date
 * picker nativo — reutilizável em qualquer formulário que peça uma data.
 */
export function DateQuickPicker({ label, valorISO, aoSelecionar }: DateQuickPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={styles.pillsRow}>
        {ATALHOS.map((atalho) => {
          const dataAtalho = adicionarDias(atalho.dias);
          const selecionado = dataAtalho.slice(0, 10) === valorISO.slice(0, 10);
          return (
            <Pressable
              key={atalho.rotulo}
              onPress={() => aoSelecionar(dataAtalho)}
              style={[
                styles.pill,
                { backgroundColor: selecionado ? '#208AEF' : theme.backgroundElement },
              ]}>
              <ThemedText type="small" style={{ color: selecionado ? '#ffffff' : theme.text }}>
                {atalho.rotulo}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Data selecionada: {formatarData(valorISO)}
      </ThemedText>
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
