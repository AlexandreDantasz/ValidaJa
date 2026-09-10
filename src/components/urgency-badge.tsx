import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { CORES_URGENCIA, LABEL_URGENCIA } from '@/constants/urgencia';
import type { Urgencia } from '@/utils/validade';

interface UrgencyBadgeProps {
  urgencia: Urgencia;
  texto?: string;
}

/** Selo colorido reutilizável indicando a urgência de validade de um item. */
export function UrgencyBadge({ urgencia, texto }: UrgencyBadgeProps) {
  const cor = CORES_URGENCIA[urgencia];

  return (
    <ThemedView style={[styles.badge, { backgroundColor: `${cor}26`, borderColor: cor }]}>
      <ThemedView style={[styles.dot, { backgroundColor: cor }]} />
      <ThemedText type="smallBold" style={{ color: cor }}>
        {texto ?? LABEL_URGENCIA[urgencia]}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.four,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
