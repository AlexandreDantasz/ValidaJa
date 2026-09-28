import { StyleSheet, View } from 'react-native';

import { OptionPills } from '@/components/option-pills';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { adicionarDias, formatarData } from '@/utils/validade';

interface DateQuickPickerProps {
  label: string;
  valorISO: string;
  aoSelecionar: (dataISO: string) => void;
}

const ATALHOS = [
  { rotulo: 'Hoje', descricao: 'Hoje', dias: 0 },
  { rotulo: '+3 dias', descricao: 'Daqui a 3 dias', dias: 3 },
  { rotulo: '+7 dias', descricao: 'Daqui a 7 dias', dias: 7 },
  { rotulo: '+30 dias', descricao: 'Daqui a 30 dias', dias: 30 },
];

/**
 * Menu de atalhos para escolher a data de validade sem exigir um date
 * picker nativo — reutilizável em qualquer formulário que peça uma data.
 */
export function DateQuickPicker({ label, valorISO, aoSelecionar }: DateQuickPickerProps) {
  const opcoes = ATALHOS.map((atalho) => {
    const data = adicionarDias(atalho.dias);
    return {
      value: data,
      label: atalho.rotulo,
      accessibilityLabel: `${atalho.descricao}, ${formatarData(data)}`,
    };
  });
  const selecionada = opcoes.find((opcao) => opcao.value.slice(0, 10) === valorISO.slice(0, 10));

  return (
    <View style={styles.container}>
      <OptionPills
        label={label}
        opcoes={opcoes}
        valor={selecionada?.value ?? ''}
        aoSelecionar={aoSelecionar}
      />
      <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
        Data selecionada: {formatarData(valorISO)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
