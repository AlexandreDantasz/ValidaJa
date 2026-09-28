import { Alert, Platform } from 'react-native';

interface OpcoesConfirmacao {
  titulo: string;
  mensagem: string;
  rotuloConfirmar: string;
  destrutivo?: boolean;
}

/**
 * Pede confirmação antes de uma ação difícil de desfazer. Usa o `Alert`
 * nativo no Android/iOS (lido automaticamente pelos leitores de tela) e o
 * `window.confirm` na web, onde o `Alert` com botões não é suportado.
 */
export function confirmar({ titulo, mensagem, rotuloConfirmar, destrutivo }: OpcoesConfirmacao) {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }

  return new Promise<boolean>((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        {
          text: rotuloConfirmar,
          style: destrutivo ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
