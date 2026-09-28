import type { ComponentProps } from 'react';
import type MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { ThemeColor } from '@/constants/theme';
import type { Urgencia } from '@/utils/validade';

/** Cor do tema usada para cada nível de urgência (contraste AA nos dois temas). */
export const COR_URGENCIA: Record<Urgencia, ThemeColor> = {
  vencido: 'danger',
  urgente: 'warning',
  atencao: 'attention',
  ok: 'success',
};

/**
 * Ícone de cada nível de urgência — a urgência nunca é comunicada apenas
 * pela cor, o que atende pessoas com daltonismo.
 */
export const ICONE_URGENCIA: Record<Urgencia, ComponentProps<typeof MaterialIcons>['name']> = {
  vencido: 'error',
  urgente: 'warning',
  atencao: 'schedule',
  ok: 'check-circle',
};

export const LABEL_URGENCIA: Record<Urgencia, string> = {
  vencido: 'Vencido',
  urgente: 'Vence logo',
  atencao: 'Atenção',
  ok: 'Em dia',
};
