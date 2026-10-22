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
        aoSalvar={async (dados) => {
          try {
            await adicionarItem(dados);
          } catch {
            mostrarFeedback('Não foi possível salvar. Tente novamente.', { tipo: 'erro' });
            return;
          }
          router.back();
          mostrarFeedback(`"${dados.nome}" adicionado à lista`);
        }}
      />
    </ScreenContainer>
  );
}
