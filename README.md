# ValidaJá

Aplicativo mobile para controlar a validade dos alimentos guardados em casa (geladeira, freezer e despensa) e reduzir o desperdício doméstico, avisando o usuário antes que os itens vençam.

Projeto desenvolvido de forma progressiva para a disciplina de desenvolvimento mobile. Cada etapa é documentada separadamente em `docs/` e marcada no Git com uma tag (`etapa-01` … `etapa-04`). A versão atual é a [release da Etapa 4](https://github.com/AlexandreDantasz/ValidaJa/releases/tag/etapa-04).

- [`docs/proposta.md`](docs/proposta.md) — Etapa 1: problema, público-alvo, funcionalidades, telas planejadas, fluxo de navegação e arquitetura.
- [`docs/etapa-02.md`](docs/etapa-02.md) — Etapa 2: implementação do protótipo de interface (telas, componentes, entrada de dados, responsividade).
- [`docs/etapa-03.md`](docs/etapa-03.md) — Etapa 3: navegação completa, UX (Lei de Fitts, feedback visual) e acessibilidade (leitores de tela, contraste, alvos de toque).
- [`docs/etapa-04.md`](docs/etapa-04.md) — Etapa 4: persistência com banco de dados SQL (SQLite), migrações e seed de dados de exemplo.

## Tecnologias

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 57)
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegação
- TypeScript
- [`expo-sqlite`](https://docs.expo.dev/versions/latest/sdk/sqlite/) para o banco de dados SQL local (SQLite)
- [`@expo/vector-icons`](https://docs.expo.dev/guides/icons/) (Material Icons) para os ícones

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org/) e o app [Expo Go](https://expo.dev/go) no celular (ou um emulador Android/iOS configurado).

```bash
npm install
npm start
```

Depois, escaneie o QR code exibido no terminal com o Expo Go (Android) ou a câmera (iOS), ou pressione `a`/`i`/`w` para abrir no emulador Android, simulador iOS ou navegador, respectivamente.

Roteiros de teste:

- navegação, feedback visual e acessibilidade (TalkBack/VoiceOver): seção 7 de [`docs/etapa-03.md`](docs/etapa-03.md);
- persistência no banco de dados: seção 8 de [`docs/etapa-04.md`](docs/etapa-04.md).

Para checar se o projeto compila sem abrir o app:

```bash
npx tsc --noEmit
npx expo export -p web
```

## Banco de dados

Os dados ficam num **banco SQLite local** (`validaja.db`), gerenciado pelo [`expo-sqlite`](https://docs.expo.dev/versions/latest/sdk/sqlite/). O app funciona offline e não precisa de servidor.

| Tabela | Conteúdo |
|---|---|
| `itens` | Alimentos cadastrados: nome, categoria, quantidade, validade, local, status (`ativo`, `consumido`, `descartado`) e datas de criação e finalização. Tem restrições `CHECK` que recusam dados inválidos e um índice por status e validade. |
| `configuracoes` | Preferências do usuário (lembretes ligados e antecedência do aviso), em pares chave/valor. |

- **Seed:** na primeira abertura, o banco é criado e populado com **15 itens de exemplo** (10 ativos em todas as faixas de urgência, 3 consumidos e 2 descartados). As datas são relativas ao dia da instalação, então os exemplos nunca ficam todos vencidos.
- **Migrações:** o banco guarda a própria versão (`PRAGMA user_version`) e, a cada abertura, aplica só as alterações que faltam. A seed roda uma única vez e não apaga os dados do usuário.
- **Restaurar os dados de exemplo:** em **Ajustes → Restaurar dados de exemplo**. Para recomeçar do zero, desinstale o app ou limpe os dados do Expo Go; no navegador, use *DevTools → Application → Clear site data*.
- **Segurança:** todas as consultas são parametrizadas (proteção contra SQL injection), e as operações com vários passos rodam em transação.

Modelo de dados, decisões de projeto e testes realizados: [`docs/etapa-04.md`](docs/etapa-04.md).

## Estrutura do projeto

```
src/
├── app/                      # telas e rotas (expo-router, roteamento por arquivo)
│   ├── _layout.tsx            # Stack raiz + providers (banco SQLite, itens e feedback)
│   ├── (tabs)/                # abas inferiores
│   │   ├── _layout.tsx        # barra de abas: Início, Estatísticas, Ajustes
│   │   ├── index.tsx          # Início
│   │   ├── explore.tsx        # Estatísticas
│   │   └── configuracoes.tsx  # Ajustes (preferências de lembrete e restauração da seed)
│   ├── item/novo.tsx          # cadastro de item (modal)
│   ├── item/[id].tsx          # detalhes do item
│   ├── item/editar/[id].tsx   # edição de item (modal)
│   └── historico.tsx          # itens consumidos/descartados
├── components/                # componentes de UI reutilizáveis (botões, cards, toast...)
├── constants/                 # tema (cores acessíveis, espaçamento, alvo mínimo), categorias, urgência
├── context/                   # itens (lidos do banco) e feedback visual (avisos)
├── database/                  # SQLite: todo o SQL do app
│   ├── schema.ts              # tabelas, índice e migrações
│   ├── seed.ts                # dados de exemplo
│   ├── itens-repository.ts    # consultas da tabela itens
│   └── configuracoes-repository.ts  # preferências do usuário
├── hooks/                     # hooks reutilizáveis
├── types/                     # tipos e modelos de dados
└── utils/                     # validade/urgência, formatação de datas, confirmação
```

`metro.config.js`, na raiz, habilita o SQLite na versão web (arquivos `.wasm` e cabeçalhos COOP/COEP).

## Telas implementadas

Navegação por **abas inferiores** (Início, Estatísticas, Ajustes) com telas de tarefa empilhadas por cima.

1. **Início** (aba): itens ativos ordenados por proximidade da validade, com resumo de quantos precisam de atenção e botão **Novo item** na base da tela.
2. **Estatísticas** (aba): itens consumidos, descartados e vencidos, e percentual de desperdício evitado. Dá acesso ao Histórico.
3. **Ajustes** (aba): lembretes (liga/desliga) e antecedência do aviso, salvos no banco, e o botão para restaurar os dados de exemplo.
4. **Novo item** (modal): formulário de cadastro com validação por campo.
5. **Detalhes do item**: informações completas e as ações editar, marcar como consumido e descartar (com confirmação).
6. **Editar item** (modal): o mesmo formulário do cadastro, pré-preenchido.
7. **Histórico**: itens finalizados, com filtro e opção de restaurar.

Tudo o que o usuário cadastra, edita, consome, descarta ou restaura é salvo no banco e continua lá ao reabrir o app. Toda ação que altera dados mostra um aviso na base da tela, que também é anunciado pelo leitor de tela. Consumir, descartar e restaurar podem ser desfeitos pelo próprio aviso.
