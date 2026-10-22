import type { SQLiteDatabase } from 'expo-sqlite';

import type { Categoria, LocalArmazenamento, StatusItem } from '@/types/item';
import { adicionarDias } from '@/utils/validade';

interface ItemSeed {
  nome: string;
  categoria: Categoria;
  quantidade: number;
  /** Validade relativa ao dia em que o seed roda (negativo = já vencido). */
  validadeEmDias: number;
  local: LocalArmazenamento;
  status: StatusItem;
  /** Para itens consumidos/descartados: há quantos dias foram finalizados. */
  finalizadoHaDias?: number;
}

/**
 * Dados de exemplo inseridos na primeira abertura do app. As datas são relativas
 * ao dia da instalação para que a lista sempre mostre todas as faixas de urgência
 * (vencido, urgente, atenção, em dia) e as estatísticas não comecem zeradas.
 */
const ITENS_SEED: ItemSeed[] = [
  // Ativos
  { nome: 'Leite integral', categoria: 'laticinios', quantidade: 1, validadeEmDias: 1, local: 'geladeira', status: 'ativo' },
  { nome: 'Peito de frango', categoria: 'carnes', quantidade: 2, validadeEmDias: 4, local: 'freezer', status: 'ativo' },
  { nome: 'Alface', categoria: 'hortifruti', quantidade: 1, validadeEmDias: -1, local: 'geladeira', status: 'ativo' },
  { nome: 'Arroz', categoria: 'mercearia', quantidade: 1, validadeEmDias: 120, local: 'despensa', status: 'ativo' },
  { nome: 'Queijo muçarela', categoria: 'laticinios', quantidade: 0.5, validadeEmDias: 0, local: 'geladeira', status: 'ativo' },
  { nome: 'Pão de forma', categoria: 'mercearia', quantidade: 1, validadeEmDias: 3, local: 'despensa', status: 'ativo' },
  { nome: 'Banana', categoria: 'hortifruti', quantidade: 6, validadeEmDias: 2, local: 'despensa', status: 'ativo' },
  { nome: 'Lasanha congelada', categoria: 'congelados', quantidade: 1, validadeEmDias: 45, local: 'freezer', status: 'ativo' },
  { nome: 'Carne moída', categoria: 'carnes', quantidade: 1, validadeEmDias: 10, local: 'freezer', status: 'ativo' },
  { nome: 'Molho de tomate', categoria: 'mercearia', quantidade: 2, validadeEmDias: 200, local: 'despensa', status: 'ativo' },
  // Histórico
  { nome: 'Iogurte natural', categoria: 'laticinios', quantidade: 2, validadeEmDias: 2, local: 'geladeira', status: 'consumido', finalizadoHaDias: 1 },
  { nome: 'Ovos', categoria: 'outros', quantidade: 12, validadeEmDias: 8, local: 'geladeira', status: 'consumido', finalizadoHaDias: 3 },
  { nome: 'Feijão', categoria: 'mercearia', quantidade: 1, validadeEmDias: 90, local: 'despensa', status: 'consumido', finalizadoHaDias: 5 },
  { nome: 'Tomate', categoria: 'hortifruti', quantidade: 3, validadeEmDias: -3, local: 'geladeira', status: 'descartado', finalizadoHaDias: 2 },
  { nome: 'Presunto', categoria: 'carnes', quantidade: 0.2, validadeEmDias: -5, local: 'geladeira', status: 'descartado', finalizadoHaDias: 4 },
];

/** Insere os itens de exemplo. Chamado pela migração inicial e por "Restaurar dados de exemplo". */
export async function popularBanco(db: SQLiteDatabase) {
  // Prepared statement: compilado uma vez e reaproveitado em todas as linhas,
  // com os valores passados como parâmetros (nunca concatenados no SQL).
  const insert = await db.prepareAsync(
    `INSERT INTO itens (nome, categoria, quantidade, data_validade, local, status, criado_em, finalizado_em)
     VALUES ($nome, $categoria, $quantidade, $dataValidade, $local, $status, $criadoEm, $finalizadoEm)`,
  );
  try {
    for (const item of ITENS_SEED) {
      await insert.executeAsync({
        $nome: item.nome,
        $categoria: item.categoria,
        $quantidade: item.quantidade,
        $dataValidade: adicionarDias(item.validadeEmDias),
        $local: item.local,
        $status: item.status,
        $criadoEm: adicionarDias(-7),
        $finalizadoEm: item.finalizadoHaDias === undefined ? null : adicionarDias(-item.finalizadoHaDias),
      });
    }
  } finally {
    await insert.finalizeAsync();
  }
}
