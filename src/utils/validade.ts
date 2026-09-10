export type Urgencia = 'vencido' | 'urgente' | 'atencao' | 'ok';

const DIA_EM_MS = 1000 * 60 * 60 * 24;

function inicioDoDia(data: Date): Date {
  const copia = new Date(data);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

export function diasAteValidade(dataValidadeISO: string, hoje: Date = new Date()): number {
  const validade = inicioDoDia(new Date(dataValidadeISO));
  const base = inicioDoDia(hoje);
  return Math.round((validade.getTime() - base.getTime()) / DIA_EM_MS);
}

export function urgenciaPorDias(dias: number): Urgencia {
  if (dias < 0) return 'vencido';
  if (dias <= 2) return 'urgente';
  if (dias <= 5) return 'atencao';
  return 'ok';
}

export function formatarData(dataISO: string): string {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function adicionarDias(dias: number, base: Date = new Date()): string {
  const data = inicioDoDia(base);
  data.setDate(data.getDate() + dias);
  return data.toISOString();
}

export function descricaoPrazo(dias: number): string {
  if (dias < 0) return `Venceu há ${Math.abs(dias)} dia${Math.abs(dias) === 1 ? '' : 's'}`;
  if (dias === 0) return 'Vence hoje';
  if (dias === 1) return 'Vence amanhã';
  return `Vence em ${dias} dias`;
}
