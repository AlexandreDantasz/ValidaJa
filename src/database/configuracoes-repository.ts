import type { SQLiteDatabase } from 'expo-sqlite';

export interface Configuracoes {
  notificacoesAtivas: boolean;
  diasAntecedencia: number;
}

export const CONFIGURACOES_PADRAO: Configuracoes = {
  notificacoesAtivas: true,
  diasAntecedencia: 3,
};

/**
 * As preferências ficam numa tabela chave/valor (`configuracoes`), com o valor
 * serializado em JSON. Assim uma preferência nova não exige migração de schema;
 * chaves ausentes caem no valor padrão.
 */
export async function lerConfiguracoes(db: SQLiteDatabase): Promise<Configuracoes> {
  const rows = await db.getAllAsync<{ chave: string; valor: string }>(
    'SELECT chave, valor FROM configuracoes',
  );
  const salvas = Object.fromEntries(rows.map((row) => [row.chave, JSON.parse(row.valor)]));
  return { ...CONFIGURACOES_PADRAO, ...salvas };
}

export async function salvarConfiguracao<K extends keyof Configuracoes>(
  db: SQLiteDatabase,
  chave: K,
  valor: Configuracoes[K],
): Promise<void> {
  // UPSERT: insere a chave ou, se já existir, só troca o valor.
  await db.runAsync(
    `INSERT INTO configuracoes (chave, valor) VALUES (?, ?)
     ON CONFLICT (chave) DO UPDATE SET valor = excluded.valor`,
    chave,
    JSON.stringify(valor),
  );
}
