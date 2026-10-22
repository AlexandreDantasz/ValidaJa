import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import * as repositorio from '@/database/itens-repository';
import type { Item, NovoItem, StatusItem } from '@/types/item';

interface ItemsContextValue {
  itens: Item[];
  adicionarItem: (item: NovoItem) => Promise<void>;
  atualizarItem: (id: string, item: NovoItem) => Promise<void>;
  definirStatus: (id: string, status: StatusItem) => Promise<void>;
  /** Volta um item exatamente ao estado salvo antes de uma ação (usado pelo "Desfazer"). */
  restaurarEstado: (itemAnterior: Item) => Promise<void>;
  /** Apaga todos os itens e recria os dados de exemplo (seed). */
  restaurarDadosExemplo: () => Promise<void>;
  buscarPorId: (id: string) => Item | undefined;
}

const ItemsContext = createContext<ItemsContextValue | null>(null);

/**
 * O banco SQLite é a fonte da verdade; `itens` é uma cópia em memória para as
 * telas renderizarem sem esperar consultas. Toda alteração grava no banco e
 * depois relê a tabela, de modo que a tela sempre mostra o que foi persistido.
 */
export function ItemsProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [itens, setItens] = useState<Item[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    setItens(await repositorio.listarItens(db));
  }, [db]);

  // Primeira leitura do banco.
  useEffect(() => {
    repositorio.listarItens(db).then((lista) => {
      setItens(lista);
      setCarregando(false);
    });
  }, [db]);

  const adicionarItem = useCallback(
    async (novoItem: NovoItem) => {
      await repositorio.inserirItem(db, novoItem);
      await recarregar();
    },
    [db, recarregar],
  );

  const atualizarItem = useCallback(
    async (id: string, dadosItem: NovoItem) => {
      await repositorio.atualizarItem(db, id, dadosItem);
      await recarregar();
    },
    [db, recarregar],
  );

  const definirStatus = useCallback(
    async (id: string, status: StatusItem) => {
      await repositorio.definirStatus(db, id, status);
      await recarregar();
    },
    [db, recarregar],
  );

  const restaurarEstado = useCallback(
    async (itemAnterior: Item) => {
      await repositorio.restaurarItem(db, itemAnterior);
      await recarregar();
    },
    [db, recarregar],
  );

  const restaurarDadosExemplo = useCallback(async () => {
    await repositorio.restaurarDadosExemplo(db);
    await recarregar();
  }, [db, recarregar]);

  const buscarPorId = useCallback((id: string) => itens.find((item) => item.id === id), [itens]);

  const value = useMemo(
    () => ({
      itens,
      adicionarItem,
      atualizarItem,
      definirStatus,
      restaurarEstado,
      restaurarDadosExemplo,
      buscarPorId,
    }),
    [
      itens,
      adicionarItem,
      atualizarItem,
      definirStatus,
      restaurarEstado,
      restaurarDadosExemplo,
      buscarPorId,
    ],
  );

  // Até a primeira leitura terminar não há o que mostrar: renderizar as telas
  // antes disso faria "Nenhum item" piscar, ou "Item não encontrado" num link direto.
  if (carregando) return null;

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems deve ser usado dentro de um ItemsProvider');
  }
  return context;
}
