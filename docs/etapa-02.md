# Etapa 2 — Implementação do Protótipo de Interface

> Objetivo desta etapa: transformar a proposta da Etapa 1 (`docs/proposta.md`) em uma primeira versão visual e navegável do ValidaJá. Sem persistência de dados nem comunicação com servidor — os itens vivem em memória (`src/context/items-context.tsx`) e são reiniciados a cada execução do app.

## Telas implementadas

| Tela | Rota | Descrição |
|------|------|-----------|
| **Início** | `/` (aba) | Lista os itens ativos, ordenados por proximidade da validade, com selo colorido de urgência. Ponto de entrada para cadastrar um item novo ou abrir os detalhes de um item. |
| **Novo item** | `/item/novo` | Formulário de cadastro (nome, quantidade, categoria, local de armazenamento, data de validade). |
| **Detalhes do item** | `/item/[id]` | Mostra todas as informações do item e permite editar, marcar como consumido ou descartar. |
| **Editar item** | `/item/editar/[id]` | Reaproveita o mesmo formulário do cadastro, pré-preenchido com os dados do item. |
| **Estatísticas** | `/explore` (aba) | Painel com contagem de itens consumidos a tempo, descartados por vencimento e vencidos ainda na lista, além do percentual de desperdício evitado. |
| **Configurações** | `/configuracoes` | Preferências de notificação (ativar lembretes e dias de antecedência). Apenas visual nesta etapa — nada é persistido. |

Total: 1 tela inicial + 5 telas adicionais, acima do mínimo de 4 exigido pelo enunciado.

## Fluxo de navegação implementado

```
(tabs) Início ──▶ [+ Novo item] ──▶ /item/novo ──▶ volta para Início
        │
        ├─▶ [toque em um item] ──▶ /item/[id] (Detalhes)
        │                             ├─▶ Editar ──▶ /item/editar/[id] ──▶ volta para Detalhes
        │                             └─▶ Marcar consumido/descartado ──▶ volta para Início
        │
        └─▶ [⚙️ no cabeçalho] ──▶ /configuracoes

(tabs) Estatísticas — acessível pela barra de abas inferior, a qualquer momento
```

`src/app/item/novo.tsx`, `item/[id].tsx`, `item/editar/[id].tsx` e `configuracoes.tsx` são empilhados (Stack) sobre o grupo de abas — `novo` e `editar` abrem como modal, `[id]` e `configuracoes` como push normal com botão de voltar.

## Principais componentes utilizados

- **`Stack`** (`src/app/_layout.tsx`) — navegador raiz, empilha as telas de cadastro/detalhes/edição/configurações sobre o grupo de abas.
- **`Tabs`** (`src/app/(tabs)/_layout.tsx`) — navegação por abas entre Início e Estatísticas.
- **`FlatList`** (tela Início) — lista performática dos itens cadastrados.
- **`TextInput`** (via `FormField`) — campos de nome e quantidade.
- **`Switch`** (tela Configurações) — liga/desliga lembretes.
- **`Pressable`** — base de todos os botões, cards e pills clicáveis do app.

## Componentes reutilizáveis (`src/components/`)

| Componente | Onde é usado | Responsabilidade |
|---|---|---|
| `ScreenContainer` | Todas as telas | Respeita a safe area, centraliza e limita a largura do conteúdo — base da responsividade do app. |
| `ItemCard` | Início | Card de item na lista, com selo de urgência. |
| `ItemForm` | Novo item e Editar item | Formulário completo (nome, quantidade, categoria, local, validade) — usado em cadastro **e** edição, evitando duplicar a lógica de entrada de dados. |
| `FormField` | `ItemForm` | Campo de texto rotulado, reutilizável em qualquer formulário futuro. |
| `OptionPills` | `ItemForm` | Menu de seleção em "pills" (usado tanto para categoria quanto para local de armazenamento). |
| `DateQuickPicker` | `ItemForm` | Atalhos de data (Hoje, +3, +7, +30 dias) para preencher a validade sem exigir um date picker nativo. |
| `PrimaryButton` | Início, Detalhes, `ItemForm` | Botão com 3 variantes (primária, secundária, perigo), usado em toda ação principal do app. |
| `UrgencyBadge` | `ItemCard`, Detalhes | Selo colorido (vencido/urgente/atenção/em dia) — cor e texto calculados a partir da data de validade. |
| `EmptyState` | Início | Estado vazio genérico, reutilizável em qualquer lista sem itens. |
| `ThemedText` / `ThemedView` | Todo o app | Já existiam no scaffold inicial; adaptam cor de texto/fundo ao tema claro/escuro. |

## Elementos de entrada de dados

No formulário de item (`ItemForm`, usado em Novo item e Editar item):

- **Campo de texto** — nome do item (`FormField`).
- **Campo numérico** — quantidade (`FormField` com `keyboardType="numeric"`).
- **Menu de seleção (pills)** — categoria (6 opções) e local de armazenamento (3 opções), via `OptionPills`.
- **Atalhos de data** — validade, via `DateQuickPicker` (Hoje / +3 / +7 / +30 dias).
- **Validação simples**: nome obrigatório e quantidade maior que zero, com mensagem de erro inline antes de salvar.

Na tela de Configurações:

- **Switch** — ativar/desativar lembretes.
- **Stepper (botões − / +)** — dias de antecedência do aviso (1 a 14 dias).

## Estratégias de adaptação a diferentes tamanhos de tela

- `ScreenContainer` centraliza o conteúdo e aplica `maxWidth: MaxContentWidth` (800px) — em telas largas (tablet, web) o conteúdo não se estica de ponta a ponta; em telas estreitas (celular), ocupa 100% da largura disponível.
- Espaçamentos e paddings usam a escala definida em `src/constants/theme.ts` (`Spacing`), nunca valores fixos soltos pelo código, mantendo consistência visual em qualquer densidade de tela.
- A grade de estatísticas (`explore.tsx`) usa `flexWrap` com `flexBasis` mínimo por card, então os cards quebram para a linha de baixo automaticamente em telas estreitas, em vez de espremer o conteúdo.
- Os "pills" de categoria/local (`OptionPills`) também usam `flexWrap`, evitando overflow horizontal em telas pequenas.
- `SafeAreaView` (dentro de `ScreenContainer`) respeita notch/ilha dinâmica e a barra de gestos em qualquer aparelho.
- Testado via `npx expo export -p web`, que gera todas as rotas corretamente (ver seção seguinte).

## Instruções para execução da aplicação

Pré-requisitos: [Node.js](https://nodejs.org/) instalado e o app [Expo Go](https://expo.dev/go) no celular (ou um emulador Android/iOS configurado).

```bash
npm install
npm start
```

Em seguida:
- Escaneie o QR code com o Expo Go (Android) ou a câmera do iPhone (iOS); ou
- Pressione `a` (emulador Android), `i` (simulador iOS) ou `w` (navegador) no terminal onde o Metro está rodando.

Para gerar um build estático de produção do lado web (útil para checar rapidamente se todas as rotas compilam):

```bash
npx expo export -p web
```

## Principais decisões de interface tomadas nesta etapa

1. **Trocar `NativeTabs` (API instável do Expo Router) por `Tabs` padrão.** O scaffold inicial usava `expo-router/unstable-native-tabs`. Para poder empilhar as telas de cadastro/detalhes/configurações sobre a navegação por abas de forma previsível (e por essa API ainda ser experimental), a navegação foi reorganizada em um `Stack` raiz (`src/app/_layout.tsx`) contendo um grupo `(tabs)` com o `Tabs` padrão do Expo Router dentro.
2. **Estado global em memória via Context (`ItemsProvider`), sem persistência.** Segue exatamente o que esta etapa pede — nenhuma gravação em disco ou servidor — mas já demonstra o fluxo real de dados (cadastrar, editar, mudar status) entre as telas, preparando o terreno para a troca por `expo-sqlite` em uma etapa futura sem precisar redesenhar as telas.
3. **Formulário único (`ItemForm`) para cadastro e edição.** Em vez de duas telas com formulários duplicados, ambas reaproveitam o mesmo componente, alternando apenas o valor inicial e o texto do botão — reduz duplicação e mantém a validação em um só lugar.
4. **Data de validade por atalhos em vez de date picker nativo.** Evita adicionar uma dependência nativa (`@react-native-community/datetimepicker`) só para esta fase visual, mantendo o app 100% funcional também no preview web, sem perder a praticidade de escolher uma data rapidamente.
5. **Cores de urgência (`UrgencyBadge`)** calculadas a partir da diferença de dias até o vencimento (`src/utils/validade.ts`), reaproveitadas no card da lista e na tela de detalhes — a mesma lógica de "quão urgente é este item" nunca é reescrita duas vezes.
6. **Remoção do conteúdo de tutorial do template padrão** (`Welcome to Expo`, seção "Explore" com links de documentação) e dos componentes que só serviam a ele (`hint-row`, `web-badge`, `external-link`, `collapsible`), já que passaram a ser substituídos pelas telas reais do ValidaJá.
