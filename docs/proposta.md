# Proposta e Planejamento — ValidaJá

> Etapa 1 — Proposta e Planejamento da Aplicação Mobile

## Nome da aplicação

**ValidaJá**

## Problema que a aplicação pretende resolver

Desperdício doméstico de alimentos por perda de controle sobre a validade do que está guardado em casa. Pesquisas recentes mostram que esse é um problema real e generalizado no Brasil:

- **61% dos brasileiros** descartam, semanalmente, um ou dois alimentos ainda em bom estado; quase metade (**49%**) afirma fazer isso diariamente ([eCycle](https://www.ecycle.com.br/pesquisa-desperdicio-de-comida-no-brasil-eua-argentina/)).
- O consumo familiar brasileiro desperdiça, em média, **94 kg de alimentos por pessoa ao ano**, segundo estudo piloto da Embrapa ([eCycle](https://www.ecycle.com.br/pesquisa-desperdicio-de-comida-no-brasil-eua-argentina/)).
- O principal vilão apontado é a chamada **"cegueira da geladeira"**: as pessoas simplesmente esquecem o que compraram e não percebem os itens até que já tenham vencido ([eCycle](https://www.ecycle.com.br/pesquisa-desperdicio-de-comida-no-brasil-eua-argentina/)).

Ou seja, o problema não é falta de vontade de evitar desperdício — é falta de **visibilidade** sobre o que está guardado e quando cada item vence.

## Público-alvo

Pessoas que fazem compras de supermercado e cozinham em casa, com destaque para:

- Estudantes e jovens que moram sozinhos ou dividem casa/apartamento (rotina corrida, pouco hábito de organizar despensa);
- Famílias que quiserem reduzir o desperdício de alimentos e economizar no orçamento doméstico.

## Objetivo principal

Ajudar o usuário a **acompanhar a validade dos alimentos armazenados** (geladeira, freezer e despensa) e **reduzir o desperdício doméstico**, por meio de cadastro simples de itens e lembretes antes do vencimento.

## Descrição das principais funcionalidades

1. **Cadastro de itens**: nome, categoria, quantidade, data de validade e local de armazenamento (geladeira, freezer ou despensa).
2. **Lista de itens por urgência**: itens organizados e sinalizados por proximidade do vencimento (ex.: verde = válido, amarelo = vence em breve, vermelho = vencido).
3. **Lembretes locais**: notificação alguns dias antes do vencimento de cada item.
4. **Baixa de item**: marcar um item como consumido ou descartado, o que alimenta o histórico.
5. **Estatísticas**: painel simples mostrando quantos itens foram consumidos a tempo vs. descartados por vencimento, como indicador de desperdício evitado.

## Telas previstas

| # | Tela | Descrição |
|---|------|-----------|
| 1 | **Início (Home)** | Lista dos itens cadastrados, ordenados por proximidade da validade, com indicação visual de urgência. |
| 2 | **Novo item / Editar item** | Formulário de cadastro (nome, categoria, quantidade, validade, local de armazenamento). |
| 3 | **Detalhes do item** | Informações completas do item e ações rápidas: marcar como consumido ou descartado. |
| 4 | **Estatísticas** | Resumo do desperdício evitado (itens consumidos a tempo vs. vencidos). |
| 5 | **Configurações** | Preferências de notificação (ex.: com quantos dias de antecedência avisar). |

## Fluxo básico de navegação

```
Início (lista de itens)
 ├─▶ [+ Novo item] ──▶ Novo item / Editar item ──▶ volta para Início
 ├─▶ [toque em um item] ──▶ Detalhes do item
 │                             ├─▶ Editar ──▶ Novo item / Editar item
 │                             └─▶ Marcar consumido/descartado ──▶ volta para Início
 └─▶ [aba inferior] ──▶ Estatísticas
                    └──▶ Configurações
```

Navegação por abas na base (Início / Estatísticas), com as telas de cadastro e detalhes abertas em pilha (stack) sobre a aba ativa.

## Tecnologia escolhida para o desenvolvimento mobile

**React Native + Expo (com Expo Router e TypeScript).**

Justificativa:

- **Multiplataforma com uma única base de código**: o app deve rodar em Android e iOS sem duplicar esforço de desenvolvimento, o que é essencial para um projeto individual desenvolvido ao longo de um semestre.
- **Ciclo de desenvolvimento rápido**: o Expo Go permite testar mudanças em segundos em um dispositivo físico, sem precisar recompilar o app nativo a cada alteração — importante para iterar rapidamente entre as etapas da disciplina.
- **Sem necessidade de configurar ambiente nativo desde o início**: não é preciso Android Studio/Xcode configurados para começar a desenvolver, o que reduz a barreira de entrada nas primeiras etapas do projeto.
- **Notificações locais nativas prontas de fábrica** (`expo-notifications`): funcionalidade central do app (lembrete antes do vencimento) sem exigir infraestrutura de push própria.
- **Armazenamento local nativo** (`expo-sqlite`): permite persistência de dados no dispositivo sem depender de servidor, adequado ao escopo inicial do projeto.
- **Ecossistema maduro e documentação extensa**, o que facilita a evolução progressiva do projeto ao longo da disciplina.

## Tecnologia escolhida para o backend

Na etapa inicial (MVP), **não haverá backend dedicado**: os dados ficam armazenados localmente no próprio dispositivo. Essa decisão é intencional — o escopo do MVP não exige sincronização entre dispositivos nem múltiplos usuários, e evitar infraestrutura de servidor nesta fase reduz complexidade desnecessária.

Evolução prevista para etapas futuras (caso necessário): backend leve em **Node.js + Express**, com banco de dados **PostgreSQL**, para permitir sincronização em nuvem e uso em mais de um dispositivo.

## Necessidade de comunicação com APIs externas

Não é obrigatória no MVP. Como evolução futura opcional, o app poderá integrar com a **Open Food Facts API** (API pública e gratuita de dados de produtos) para preencher automaticamente nome/categoria de um item a partir da leitura de um código de barras.

## Forma prevista de armazenamento de dados

Armazenamento **local no dispositivo**, via **`expo-sqlite`**, permitindo que o app funcione totalmente **offline**. Os lembretes são agendados localmente com **`expo-notifications`**.

## Estrutura inicial de diretórios do projeto

```
.
├── app.json                # configuração do projeto Expo
├── package.json
├── tsconfig.json
├── assets/                 # ícones, imagens e fontes
├── docs/
│   └── proposta.md         # este documento
└── src/
    ├── app/                 # telas e rotas (expo-router, roteamento por arquivo)
    │   ├── _layout.tsx      # layout raiz (abas)
    │   ├── index.tsx        # tela inicial
    │   └── explore.tsx      # segunda aba
    ├── components/          # componentes de UI reutilizáveis
    ├── constants/           # constantes (tema, cores, espaçamento)
    └── hooks/                # hooks reutilizáveis (ex.: tema, color scheme)
```

Esta é a estrutura gerada pelo `create-expo-app` (scaffold inicial do projeto), que serve de ponto de partida. As pastas abaixo são planejadas para as próximas etapas e ainda **não** existem no repositório nesta fase, para não antecipar código sem uso:

- `src/types/` — modelos de dados (ex.: `Item`);
- `src/storage/` — acesso ao armazenamento local (SQLite);
- `src/services/` — regras de negócio (cálculo de urgência de validade, agendamento de notificações).
