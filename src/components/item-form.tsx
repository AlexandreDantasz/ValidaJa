import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { DateQuickPicker } from '@/components/date-quick-picker';
import { FormField } from '@/components/form-field';
import { OptionPills } from '@/components/option-pills';
import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIAS, LOCAIS } from '@/constants/categorias';
import { Spacing } from '@/constants/theme';
import type { Categoria, Item, LocalArmazenamento } from '@/types/item';
import { adicionarDias } from '@/utils/validade';

type DadosFormulario = Omit<Item, 'id' | 'status' | 'criadoEm'>;

interface ItemFormProps {
  itemInicial?: Item;
  textoBotao: string;
  aoSalvar: (dados: DadosFormulario) => void;
}

/**
 * Formulário reutilizado tanto para cadastrar quanto para editar um item —
 * único lugar com a lógica de entrada de dados do item.
 */
export function ItemForm({ itemInicial, textoBotao, aoSalvar }: ItemFormProps) {
  const [nome, setNome] = useState(itemInicial?.nome ?? '');
  const [quantidade, setQuantidade] = useState(String(itemInicial?.quantidade ?? 1));
  const [categoria, setCategoria] = useState<Categoria>(itemInicial?.categoria ?? 'mercearia');
  const [local, setLocal] = useState<LocalArmazenamento>(itemInicial?.local ?? 'geladeira');
  const [dataValidade, setDataValidade] = useState(itemInicial?.dataValidade ?? adicionarDias(7));
  const [erro, setErro] = useState('');

  function handleSalvar() {
    const quantidadeNumerica = Number(quantidade);

    if (!nome.trim()) {
      setErro('Informe o nome do item.');
      return;
    }
    if (!quantidadeNumerica || quantidadeNumerica <= 0) {
      setErro('Informe uma quantidade válida.');
      return;
    }

    setErro('');
    aoSalvar({
      nome: nome.trim(),
      quantidade: quantidadeNumerica,
      categoria,
      local,
      dataValidade,
    });
  }

  return (
    <ThemedView style={styles.container}>
      <FormField
        label="Nome do item"
        placeholder="Ex.: Leite integral"
        value={nome}
        onChangeText={setNome}
      />

      <FormField
        label="Quantidade"
        placeholder="1"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <OptionPills label="Categoria" opcoes={CATEGORIAS} valor={categoria} aoSelecionar={setCategoria} />

      <OptionPills
        label="Local de armazenamento"
        opcoes={LOCAIS}
        valor={local}
        aoSelecionar={setLocal}
      />

      <DateQuickPicker label="Data de validade" valorISO={dataValidade} aoSelecionar={setDataValidade} />

      {erro ? (
        <ThemedText type="small" style={styles.erro}>
          {erro}
        </ThemedText>
      ) : null}

      <PrimaryButton label={textoBotao} onPress={handleSalvar} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  erro: {
    color: '#E5484D',
  },
});
