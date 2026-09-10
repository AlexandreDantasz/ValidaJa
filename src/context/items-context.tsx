import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Item, StatusItem } from '@/types/item';
import { adicionarDias } from '@/utils/validade';

const ITENS_INICIAIS: Item[] = [
  {
    id: '1',
    nome: 'Leite integral',
    categoria: 'laticinios',
    quantidade: 1,
    dataValidade: adicionarDias(1),
    local: 'geladeira',
    status: 'ativo',
    criadoEm: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Peito de frango',
    categoria: 'carnes',
    quantidade: 2,
    dataValidade: adicionarDias(4),
    local: 'freezer',
    status: 'ativo',
    criadoEm: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Alface',
    categoria: 'hortifruti',
    quantidade: 1,
    dataValidade: adicionarDias(-1),
    local: 'geladeira',
    status: 'ativo',
    criadoEm: new Date().toISOString(),
  },
  {
    id: '4',
    nome: 'Arroz',
    categoria: 'mercearia',
    quantidade: 1,
    dataValidade: adicionarDias(120),
    local: 'despensa',
    status: 'ativo',
    criadoEm: new Date().toISOString(),
  },
];

type NovoItem = Omit<Item, 'id' | 'status' | 'criadoEm'>;

interface ItemsContextValue {
  itens: Item[];
  adicionarItem: (item: NovoItem) => void;
  atualizarItem: (id: string, item: NovoItem) => void;
  definirStatus: (id: string, status: StatusItem) => void;
  buscarPorId: (id: string) => Item | undefined;
}

const ItemsContext = createContext<ItemsContextValue | null>(null);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Item[]>(ITENS_INICIAIS);

  const adicionarItem = useCallback((novoItem: NovoItem) => {
    setItens((atual) => [
      ...atual,
      { ...novoItem, id: String(Date.now()), status: 'ativo', criadoEm: new Date().toISOString() },
    ]);
  }, []);

  const atualizarItem = useCallback((id: string, dadosItem: NovoItem) => {
    setItens((atual) => atual.map((item) => (item.id === id ? { ...item, ...dadosItem } : item)));
  }, []);

  const definirStatus = useCallback((id: string, status: StatusItem) => {
    setItens((atual) => atual.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const buscarPorId = useCallback((id: string) => itens.find((item) => item.id === id), [itens]);

  const value = useMemo(
    () => ({ itens, adicionarItem, atualizarItem, definirStatus, buscarPorId }),
    [itens, adicionarItem, atualizarItem, definirStatus, buscarPorId],
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems deve ser usado dentro de um ItemsProvider');
  }
  return context;
}
