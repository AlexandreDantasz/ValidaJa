import { router } from 'expo-router';

import { ItemForm } from '@/components/item-form';
import { ScreenContainer } from '@/components/screen-container';
import { useItems } from '@/context/items-context';

export default function NovoItemScreen() {
  const { adicionarItem } = useItems();

  return (
    <ScreenContainer scroll>
      <ItemForm
        textoBotao="Salvar item"
        aoSalvar={(dados) => {
          adicionarItem(dados);
          router.back();
        }}
      />
    </ScreenContainer>
  );
}
