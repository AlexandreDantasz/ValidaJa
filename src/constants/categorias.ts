import type { Categoria, LocalArmazenamento } from '@/types/item';

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'mercearia', label: 'Mercearia' },
  { value: 'congelados', label: 'Congelados' },
  { value: 'outros', label: 'Outros' },
];

export const LOCAIS: { value: LocalArmazenamento; label: string }[] = [
  { value: 'geladeira', label: 'Geladeira' },
  { value: 'freezer', label: 'Freezer' },
  { value: 'despensa', label: 'Despensa' },
];

export function labelCategoria(categoria: Categoria): string {
  return CATEGORIAS.find((c) => c.value === categoria)?.label ?? categoria;
}

export function labelLocal(local: LocalArmazenamento): string {
  return LOCAIS.find((l) => l.value === local)?.label ?? local;
}
