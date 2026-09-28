import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/empty-state';
import { ItemForm } from '@/components/item-form';
import { ScreenContainer } from '@/components/screen-container';
import { useFeedback } from '@/context/feedback-context';
import { useItems } from '@/context/items-context';

export default function EditarItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarPorId, atualizarItem } = useItems();
  const { mostrarFeedback } = useFeedback();
  const item = buscarPorId(id);

  if (!item) {
    return (
      <ScreenContainer>
        <EmptyState
          titulo="Item não encontrado"
          descricao="Este item pode ter sido removido. Volte para a lista e tente novamente."
          icone="search-off"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <ItemForm
        itemInicial={item}
        textoBotao="Salvar alterações"
        aoSalvar={(dados) => {
          atualizarItem(item.id, dados);
          router.back();
          mostrarFeedback('Alterações salvas');
        }}
      />
    </ScreenContainer>
  );
}
