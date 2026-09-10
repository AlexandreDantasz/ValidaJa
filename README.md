# ValidaJá

Aplicativo mobile para controlar a validade dos alimentos guardados em casa (geladeira, freezer e despensa) e reduzir o desperdício doméstico, avisando o usuário antes que os itens vençam.

Projeto desenvolvido de forma progressiva para a disciplina de desenvolvimento mobile. Cada etapa é documentada separadamente em `docs/`:

- [`docs/proposta.md`](docs/proposta.md) — Etapa 1: problema, público-alvo, funcionalidades, telas planejadas, fluxo de navegação e arquitetura.
- [`docs/etapa-02.md`](docs/etapa-02.md) — Etapa 2: implementação do protótipo de interface (telas, componentes, entrada de dados, responsividade).

## Tecnologias

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 57)
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegação
- TypeScript

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org/) e o app [Expo Go](https://expo.dev/go) no celular (ou um emulador Android/iOS configurado).

```bash
npm install
npm start
```

Depois, escaneie o QR code exibido no terminal com o Expo Go (Android) ou a câmera (iOS), ou pressione `a`/`i`/`w` para abrir no emulador Android, simulador iOS ou navegador, respectivamente.

Nesta etapa a aplicação **não tem persistência de dados**: os itens ficam em memória (estado do React) e são reiniciados para a lista de exemplo sempre que o app é recarregado.

## Estrutura do projeto

```
src/
├── app/                    # telas e rotas (expo-router, roteamento por arquivo)
│   ├── _layout.tsx          # Stack raiz + provider de estado global
│   ├── (tabs)/               # abas: Início e Estatísticas
│   ├── item/novo.tsx         # cadastro de item
│   ├── item/[id].tsx         # detalhes do item
│   ├── item/editar/[id].tsx  # edição de item
│   └── configuracoes.tsx     # preferências de notificação (não persistidas)
├── components/              # componentes de UI reutilizáveis
├── constants/                # tema, categorias, cores de urgência
├── context/                  # estado global em memória (itens)
├── hooks/                     # hooks reutilizáveis
├── types/                     # tipos e modelos de dados
└── utils/                     # cálculo de urgência de validade, formatação de datas
```

## Telas implementadas

1. **Início** — lista dos itens cadastrados, ordenados por proximidade da validade.
2. **Novo item** — formulário de cadastro.
3. **Detalhes do item** — informações completas e ações (editar, marcar consumido/descartado).
4. **Editar item** — mesmo formulário do cadastro, pré-preenchido.
5. **Estatísticas** — resumo de itens consumidos a tempo vs. descartados por vencimento.
6. **Configurações** — preferências de notificação (apenas visual nesta etapa).
