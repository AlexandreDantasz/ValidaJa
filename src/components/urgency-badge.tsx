import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { COR_URGENCIA, ICONE_URGENCIA, LABEL_URGENCIA } from '@/constants/urgencia';
import { useTheme } from '@/hooks/use-theme';
import type { Urgencia } from '@/utils/validade';

interface UrgencyBadgeProps {
  urgencia: Urgencia;
  texto?: string;
}

/**
 * Selo reutilizável indicando a urgência de validade de um item. Combina
 * cor, ícone e texto, para que a informação não dependa só da cor.
 */
export function UrgencyBadge({ urgencia, texto }: UrgencyBadgeProps) {
  const theme = useTheme();
  const cor = theme[COR_URGENCIA[urgencia]];
  const textoFinal = texto ?? LABEL_URGENCIA[urgencia];

  return (
    <View
      accessible
      accessibilityLabel={`Situação: ${textoFinal}`}
      style={[styles.badge, { backgroundColor: theme.background, borderColor: cor }]}>
      <MaterialIcons name={ICONE_URGENCIA[urgencia]} size={16} color={cor} />
      <ThemedText type="smallBold" style={{ color: cor }}>
        {textoFinal}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.four,
    borderWidth: 1.5,
  },
});
