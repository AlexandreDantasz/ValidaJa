import { useState } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';

import { DateQuickPicker } from '@/components/date-quick-picker';
import { FormField } from '@/components/form-field';
import { OptionPills } from '@/components/option-pills';
import { PrimaryButton } from '@/components/primary-button';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIAS, LOCAIS } from '@/constants/categorias';
import { Spacing } from '@/constants/theme';
import type { Categoria, Item, LocalArmazenamento } from '@/types/item';
import { adicionarDias } from '@/utils/validade';

type DadosFormulario = Omit<Item, 'id' | 'status' | 'criadoEm' | 'finalizadoEm'>;

interface ItemFormProps {
  itemInicial?: Item;
  textoBotao: string;
  aoSalvar: (dados: DadosFormulario) => void;
}

interface ErrosFormulario {
  nome?: string;
  quantidade?: string;
}

/**
 * Formulário reutilizado tanto para cadastrar quanto para editar um item —
 * único lugar com a lógica de entrada de dados do item. Erros de validação
 * aparecem junto ao campo com problema e são anunciados ao leitor de tela.
 */
export function ItemForm({ itemInicial, textoBotao, aoSalvar }: ItemFormProps) {
  const [nome, setNome] = useState(itemInicial?.nome ?? '');
  const [quantidade, setQuantidade] = useState(String(itemInicial?.quantidade ?? 1));
  const [categoria, setCategoria] = useState<Categoria>(itemInicial?.categoria ?? 'mercearia');
  const [local, setLocal] = useState<LocalArmazenamento>(itemInicial?.local ?? 'geladeira');
  const [dataValidade, setDataValidade] = useState(itemInicial?.dataValidade ?? adicionarDias(7));
  const [erros, setErros] = useState<ErrosFormulario>({});

  function handleSalvar() {
    const quantidadeNumerica = Number(quantidade.replace(',', '.'));
    const novosErros: ErrosFormulario = {};

    if (!nome.trim()) {
      novosErros.nome = 'Informe o nome do item, por exemplo "Leite integral".';
    }
    if (!quantidadeNumerica || quantidadeNumerica <= 0) {
      novosErros.quantidade = 'Informe uma quantidade maior que zero.';
    }

    setErros(novosErros);
    const mensagens = Object.values(novosErros);
    if (mensagens.length > 0) {
      AccessibilityInfo.announceForAccessibility(
        `Não foi possível salvar. ${mensagens.join(' ')}`,
      );
      return;
    }

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
        onChangeText={(texto) => {
          setNome(texto);
          if (erros.nome) setErros((atual) => ({ ...atual, nome: undefined }));
        }}
        erro={erros.nome}
        autoCapitalize="sentences"
        returnKeyType="next"
      />

      <FormField
        label="Quantidade"
        placeholder="1"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={(texto) => {
          setQuantidade(texto);
          if (erros.quantidade) setErros((atual) => ({ ...atual, quantidade: undefined }));
        }}
        erro={erros.quantidade}
      />

      <OptionPills label="Categoria" opcoes={CATEGORIAS} valor={categoria} aoSelecionar={setCategoria} />

      <OptionPills
        label="Local de armazenamento"
        opcoes={LOCAIS}
        valor={local}
        aoSelecionar={setLocal}
      />

      <DateQuickPicker label="Data de validade" valorISO={dataValidade} aoSelecionar={setDataValidade} />

      <PrimaryButton label={textoBotao} icone="check" onPress={handleSalvar} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
});
