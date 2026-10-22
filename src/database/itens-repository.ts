import type { SQLiteDatabase } from 'expo-sqlite';

import { popularBanco } from '@/database/seed';
import type { Categoria, Item, LocalArmazenamento, NovoItem, StatusItem } from '@/types/item';

/** Formato de uma linha da tabela `itens` (nomes de coluna em snake_case). */
interface ItemRow {
  id: number;
  nome: string;
  categoria: Categoria;
  quantidade: number;
  data_validade: string;
  local: LocalArmazenamento;
  status: StatusItem;
  criado_em: string;
  finalizado_em: string | null;
}

function paraItem(row: ItemRow): Item {
  return {
    id: String(row.id),
    nome: row.nome,
    categoria: row.categoria,
    quantidade: row.quantidade,
    dataValidade: row.data_validade,
    local: row.local,
    status: row.status,
    criadoEm: row.criado_em,
    finalizadoEm: row.finalizado_em ?? undefined,
  };
}

export async function listarItens(db: SQLiteDatabase): Promise<Item[]> {
  const rows = await db.getAllAsync<ItemRow>('SELECT * FROM itens ORDER BY data_validade, nome');
  return rows.map(paraItem);
}

export async function inserirItem(db: SQLiteDatabase, item: NovoItem): Promise<void> {
  await db.runAsync(
    `INSERT INTO itens (nome, categoria, quantidade, data_validade, local)
     VALUES (?, ?, ?, ?, ?)`,
    item.nome,
    item.categoria,
    item.quantidade,
    item.dataValidade,
    item.local,
  );
}

export async function atualizarItem(db: SQLiteDatabase, id: string, item: NovoItem): Promise<void> {
  await db.runAsync(
    `UPDATE itens
        SET nome = ?, categoria = ?, quantidade = ?, data_validade = ?, local = ?
      WHERE id = ?`,
    item.nome,
    item.categoria,
    item.quantidade,
    item.dataValidade,
    item.local,
    Number(id),
  );
}

export async function definirStatus(db: SQLiteDatabase, id: string, status: StatusItem): Promise<void> {
  const finalizadoEm = status === 'ativo' ? null : new Date().toISOString();
  await db.runAsync(
    'UPDATE itens SET status = ?, finalizado_em = ? WHERE id = ?',
    status,
    finalizadoEm,
    Number(id),
  );
}

/** Regrava todos os campos de um item como estavam antes (usado pelo "Desfazer"). */
export async function restaurarItem(db: SQLiteDatabase, item: Item): Promise<void> {
  await db.runAsync(
    `UPDATE itens
        SET nome = ?, categoria = ?, quantidade = ?, data_validade = ?, local = ?,
            status = ?, criado_em = ?, finalizado_em = ?
      WHERE id = ?`,
    item.nome,
    item.categoria,
    item.quantidade,
    item.dataValidade,
    item.local,
    item.status,
    item.criadoEm,
    item.finalizadoEm ?? null,
    Number(item.id),
  );
}

/** Apaga todos os itens e insere de novo os dados de exemplo. */
export async function restaurarDadosExemplo(db: SQLiteDatabase): Promise<void> {
  // Numa transação: se o seed falhar, os itens antigos não são perdidos.
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM itens');
    // Zera o AUTOINCREMENT para os ids voltarem a começar em 1.
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'itens'");
    await popularBanco(db);
  });
}
