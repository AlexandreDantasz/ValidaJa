import { router, useLocalSearchParams } from 'expo-router';

import { ItemForm } from '@/components/item-form';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { useItems } from '@/context/items-context';

export default function EditarItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarPorId, atualizarItem } = useItems();
  const item = buscarPorId(id);

  if (!item) {
    return (
      <ScreenContainer>
        <ThemedText type="default">Item não encontrado.</ThemedText>
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
        }}
      />
    </ScreenContainer>
  );
}
