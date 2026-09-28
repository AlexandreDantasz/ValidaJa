# ValidaJá

Aplicativo mobile para controlar a validade dos alimentos guardados em casa (geladeira, freezer e despensa) e reduzir o desperdício doméstico, avisando o usuário antes que os itens vençam.

Projeto desenvolvido de forma progressiva para a disciplina de desenvolvimento mobile. Cada etapa é documentada separadamente em `docs/`:

- [`docs/proposta.md`](docs/proposta.md) — Etapa 1: problema, público-alvo, funcionalidades, telas planejadas, fluxo de navegação e arquitetura.
- [`docs/etapa-02.md`](docs/etapa-02.md) — Etapa 2: implementação do protótipo de interface (telas, componentes, entrada de dados, responsividade).
- [`docs/etapa-03.md`](docs/etapa-03.md) — Etapa 3: navegação completa, UX (Lei de Fitts, feedback visual) e acessibilidade (leitores de tela, contraste, alvos de toque).

## Tecnologias

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 57)
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegação
- TypeScript
- [`@expo/vector-icons`](https://docs.expo.dev/guides/icons/) (Material Icons) para os ícones

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org/) e o app [Expo Go](https://expo.dev/go) no celular (ou um emulador Android/iOS configurado).

```bash
npm install
npm start
```

Depois, escaneie o QR code exibido no terminal com o Expo Go (Android) ou a câmera (iOS), ou pressione `a`/`i`/`w` para abrir no emulador Android, simulador iOS ou navegador, respectivamente.

Para testar a navegação, o feedback visual e a acessibilidade (TalkBack/VoiceOver), siga os roteiros da seção 7 de [`docs/etapa-03.md`](docs/etapa-03.md).

A aplicação ainda **não tem persistência de dados**: os itens ficam em memória (estado do React) e são reiniciados para a lista de exemplo sempre que o app é recarregado.

## Estrutura do projeto

```
src/
├── app/                      # telas e rotas (expo-router, roteamento por arquivo)
│   ├── _layout.tsx            # Stack raiz + providers (itens e feedback)
│   ├── (tabs)/                # abas inferiores
│   │   ├── _layout.tsx        # barra de abas: Início, Estatísticas, Ajustes
│   │   ├── index.tsx          # Início
│   │   ├── explore.tsx        # Estatísticas
│   │   └── configuracoes.tsx  # Ajustes (preferências de lembrete, não persistidas)
│   ├── item/novo.tsx          # cadastro de item (modal)
│   ├── item/[id].tsx          # detalhes do item
│   ├── item/editar/[id].tsx   # edição de item (modal)
│   └── historico.tsx          # itens consumidos/descartados
├── components/                # componentes de UI reutilizáveis (botões, cards, toast...)
├── constants/                 # tema (cores acessíveis, espaçamento, alvo mínimo), categorias, urgência
├── context/                   # estado global em memória (itens) e feedback visual (avisos)
├── hooks/                     # hooks reutilizáveis
├── types/                     # tipos e modelos de dados
└── utils/                     # validade/urgência, formatação de datas, confirmação
```

## Telas implementadas

Navegação por **abas inferiores** (Início, Estatísticas, Ajustes) com telas de tarefa empilhadas por cima.

1. **Início** (aba): itens ativos ordenados por proximidade da validade, com resumo de quantos precisam de atenção e botão **Novo item** na base da tela.
2. **Estatísticas** (aba): itens consumidos, descartados e vencidos, e percentual de desperdício evitado. Dá acesso ao Histórico.
3. **Ajustes** (aba): lembretes (liga/desliga) e antecedência do aviso. É apenas visual nesta etapa.
4. **Novo item** (modal): formulário de cadastro com validação por campo.
5. **Detalhes do item**: informações completas e as ações editar, marcar como consumido e descartar (com confirmação).
6. **Editar item** (modal): o mesmo formulário do cadastro, pré-preenchido.
7. **Histórico**: itens finalizados, com filtro e opção de restaurar.

Toda ação que altera dados mostra um aviso na base da tela, que também é anunciado pelo leitor de tela. Consumir, descartar e restaurar podem ser desfeitos pelo próprio aviso.
