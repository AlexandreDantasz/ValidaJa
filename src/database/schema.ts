import type { SQLiteDatabase } from 'expo-sqlite';

import { popularBanco } from '@/database/seed';

export const NOME_BANCO = 'validaja.db';

/**
 * Cada posição é uma migração: a de índice 0 leva o banco da versão 0 (vazio)
 * para a 1, a de índice 1 da 1 para a 2, e assim por diante. A versão atual
 * fica gravada no próprio arquivo do banco (`PRAGMA user_version`), então uma
 * migração nunca roda duas vezes. Para mudar o schema, acrescente uma nova
 * posição no fim — nunca altere uma migração que já foi publicada.
 */
const MIGRACOES: ((db: SQLiteDatabase) => Promise<void>)[] = [
  // Versão 1: tabelas iniciais + dados de exemplo (seed).
  async (db) => {
    await db.execAsync(`
      CREATE TABLE itens (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        nome          TEXT    NOT NULL CHECK (length(trim(nome)) > 0),
        categoria     TEXT    NOT NULL CHECK (categoria IN
                        ('laticinios', 'carnes', 'hortifruti', 'mercearia', 'congelados', 'outros')),
        quantidade    REAL    NOT NULL CHECK (quantidade > 0),
        data_validade TEXT    NOT NULL,
        local         TEXT    NOT NULL CHECK (local IN ('geladeira', 'freezer', 'despensa')),
        status        TEXT    NOT NULL DEFAULT 'ativo'
                        CHECK (status IN ('ativo', 'consumido', 'descartado')),
        criado_em     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        finalizado_em TEXT,
        -- Item ativo não tem data de finalização; item consumido/descartado precisa ter.
        CHECK ((status = 'ativo') = (finalizado_em IS NULL))
      );

      -- A tela Início filtra por status e ordena por validade.
      CREATE INDEX idx_itens_status_validade ON itens (status, data_validade);

      CREATE TABLE configuracoes (
        chave TEXT PRIMARY KEY NOT NULL,
        valor TEXT NOT NULL
      );
    `);
    await popularBanco(db);
  },
];

/** Executado pelo `SQLiteProvider` antes de renderizar o app: aplica as migrações pendentes. */
export async function migrarBanco(db: SQLiteDatabase) {
  const resultado = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let versaoAtual = resultado?.user_version ?? 0;

  while (versaoAtual < MIGRACOES.length) {
    const migracao = MIGRACOES[versaoAtual];
    // Migração e troca de versão na mesma transação: ou aplica tudo, ou nada.
    // (withTransactionAsync em vez da versão "exclusive", que não existe na web.)
    await db.withTransactionAsync(async () => {
      await migracao(db);
      await db.execAsync(`PRAGMA user_version = ${versaoAtual + 1}`);
    });
    versaoAtual += 1;
  }
}
