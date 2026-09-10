import type { Urgencia } from '@/utils/validade';

export const CORES_URGENCIA: Record<Urgencia, string> = {
  vencido: '#E5484D',
  urgente: '#F5A623',
  atencao: '#E9C700',
  ok: '#30A46C',
};

export const LABEL_URGENCIA: Record<Urgencia, string> = {
  vencido: 'Vencido',
  urgente: 'Vence logo',
  atencao: 'Atenção',
  ok: 'Em dia',
};
