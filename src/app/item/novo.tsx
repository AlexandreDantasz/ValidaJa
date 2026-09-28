import { router } from 'expo-router';

import { ItemForm } from '@/components/item-form';
import { ScreenContainer } from '@/components/screen-container';
import { useFeedback } from '@/context/feedback-context';
import { useItems } from '@/context/items-context';

export default function NovoItemScreen() {
  const { adicionarItem } = useItems();
  const { mostrarFeedback } = useFeedback();

  return (
    <ScreenContainer scroll>
      <ItemForm
        textoBotao="Salvar item"
        aoSalvar={(dados) => {
          adicionarItem(dados);
          router.back();
          mostrarFeedback(`"${dados.nome}" adicionado à lista`);
        }}
      />
    </ScreenContainer>
  );
}
