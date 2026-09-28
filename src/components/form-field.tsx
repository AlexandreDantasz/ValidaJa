import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useId, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  /** Mensagem de erro exibida abaixo do campo (e anunciada ao leitor de tela). */
  erro?: string;
}

/**
 * Campo de texto rotulado, reutilizado em todos os formulários do app.
 * O rótulo é associado ao campo para leitores de tela, a borda muda de cor
 * ao receber foco e, em caso de erro, o campo ganha borda vermelha, ícone e
 * mensagem explicativa.
 */
export function FormField({ label, erro, style, onFocus, onBlur, ...rest }: FormFieldProps) {
  const theme = useTheme();
  const idRotulo = useId();
  const [focado, setFocado] = useState(false);

  const corBorda = erro ? theme.danger : focado ? theme.primary : theme.border;

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" nativeID={idRotulo}>
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        accessibilityLabelledBy={idRotulo}
        accessibilityHint={erro}
        placeholderTextColor={theme.textSecondary}
        onFocus={(evento) => {
          setFocado(true);
          onFocus?.(evento);
        }}
        onBlur={(evento) => {
          setFocado(false);
          onBlur?.(evento);
        }}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.backgroundElement,
            borderColor: corBorda,
            borderWidth: erro || focado ? 2 : 1,
          },
          style,
        ]}
        {...rest}
      />
      {erro ? (
        <View style={styles.erro} accessibilityLiveRegion="polite">
          <MaterialIcons name="error" size={16} color={theme.danger} />
          <ThemedText type="small" style={{ color: theme.danger }}>
            {erro}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  input: {
    minHeight: MinTouchTarget + Spacing.one,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  erro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
