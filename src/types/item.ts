export type Categoria = 'laticinios' | 'carnes' | 'hortifruti' | 'mercearia' | 'congelados' | 'outros';

export type LocalArmazenamento = 'geladeira' | 'freezer' | 'despensa';

export type StatusItem = 'ativo' | 'consumido' | 'descartado';

export interface Item {
  id: string;
  nome: string;
  categoria: Categoria;
  quantidade: number;
  dataValidade: string;
  local: LocalArmazenamento;
  status: StatusItem;
  criadoEm: string;
}
