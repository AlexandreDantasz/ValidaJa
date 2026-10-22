# Etapa 4 — Persistência com banco de dados SQL

> Objetivo desta etapa: substituir o estado em memória por um **banco de dados SQL local** (SQLite), de modo que os itens, o histórico e as preferências sobrevivam ao fechamento do app, e entregar o banco já populado com uma **seed** de dados de exemplo.

## 1. Tecnologia escolhida

| Item | Escolha | Por quê |
|---|---|---|
| Banco | **SQLite** | Banco SQL relacional completo que roda dentro do app, sem servidor e sem internet. É o banco padrão de Android e iOS. |
| Biblioteca | **`expo-sqlite`** (`~57.0.4`) | Biblioteca oficial do Expo, compatível com o Expo Go (não exige build nativo), com API assíncrona e suporte a Android, iOS e web. |
| Arquivo | `validaja.db` | Fica na pasta de dados privada do app no aparelho (no navegador, no armazenamento OPFS). |

O ValidaJá controla os alimentos **da casa do usuário**, então os dados são pessoais e locais. Um banco embarcado atende o caso sem a complexidade de um back-end, de login e de conexão com a internet. O SQLite também é SQL de verdade: tabelas, restrições (`CHECK`, `NOT NULL`, `PRIMARY KEY`), índices, transações e consultas parametrizadas.

## 2. Modelo de dados

```
┌─────────────────────────────────────────┐      ┌──────────────────────────┐
│ itens                                   │      │ configuracoes            │
├─────────────────────────────────────────┤      ├──────────────────────────┤
│ id             INTEGER  PK AUTOINCREMENT│      │ chave  TEXT  PK          │
│ nome           TEXT     NOT NULL        │      │ valor  TEXT  NOT NULL    │
│ categoria      TEXT     NOT NULL  CHECK │      └──────────────────────────┘
│ quantidade     REAL     NOT NULL  CHECK │
│ data_validade  TEXT     NOT NULL        │
│ local          TEXT     NOT NULL  CHECK │
│ status         TEXT     NOT NULL  CHECK │  DEFAULT 'ativo'
│ criado_em      TEXT     NOT NULL        │  DEFAULT agora (UTC)
│ finalizado_em  TEXT     NULL            │
└─────────────────────────────────────────┘
  índice: idx_itens_status_validade (status, data_validade)
```

O schema está em `src/database/schema.ts`. As decisões principais:

- **Regras de negócio também no banco**, e não só no formulário. Os `CHECK` impedem nome vazio, quantidade ≤ 0, e categoria, local ou status fora da lista. Há também uma regra entre colunas: `CHECK ((status = 'ativo') = (finalizado_em IS NULL))`, ou seja, item ativo não tem data de finalização, e item consumido ou descartado precisa ter. Se um bug no app tentar gravar um dado inválido, o banco recusa.
- **Categoria, local e status com `CHECK`, e não em tabelas separadas.** São listas fixas, definidas no código (`src/types/item.ts`, `src/constants/categorias.ts`), com rótulos e ícones que só existem na interface. Tabelas `categorias`/`locais` com chave estrangeira duplicariam essa informação sem ganho, já que o usuário não cria categorias. Se um dia ele puder criar, aí sim vale normalizar (ver seção 9).
- **`quantidade` é `REAL`** porque o formulário aceita valores fracionados (ex.: 0,5 kg de queijo).
- **Datas como `TEXT` no formato ISO 8601** (`2026-10-22T03:00:00.000Z`). O SQLite não tem tipo de data próprio; em ISO a ordem alfabética coincide com a ordem cronológica, então `ORDER BY data_validade` funciona, e é o mesmo formato que o app já usava.
- **Exclusão lógica (status) em vez de `DELETE`.** Consumir e descartar só mudam o `status`. O item continua no banco para alimentar o Histórico e as Estatísticas, e o "Desfazer" consegue restaurá-lo.
- **Índice `(status, data_validade)`**: a consulta mais comum é "itens ativos ordenados por validade". O `EXPLAIN QUERY PLAN` confirma que o SQLite usa o índice: `SEARCH itens USING INDEX idx_itens_status_validade (status=?)`.
- **`configuracoes` como chave/valor** (valor em JSON). Uma preferência nova não exige mudar o schema; uma chave ausente usa o valor padrão.
- **Nomes de coluna em `snake_case`** (convenção de SQL) e propriedades em `camelCase` no TypeScript. A conversão fica num único lugar (`paraItem`, no repositório).

## 3. Arquitetura

```
Telas (src/app)                  ── chamam ──▶  useItems()  (src/context/items-context.tsx)
                                                    │
                                                    ▼
                                  Repositórios (src/database/*-repository.ts)  ── SQL ──▶  SQLite (validaja.db)
                                                    ▲
SQLiteProvider (src/app/_layout.tsx) ── onInit ──▶ migrarBanco + seed (src/database/schema.ts, seed.ts)
```

| Arquivo | Responsabilidade |
|---|---|
| `src/database/schema.ts` | Nome do banco, `CREATE TABLE`/`CREATE INDEX` e o controle de versões (migrações) |
| `src/database/seed.ts` | Dados de exemplo e a função `popularBanco` |
| `src/database/itens-repository.ts` | Todo o SQL da tabela `itens`: listar, inserir, atualizar, mudar status, restaurar, recriar a seed |
| `src/database/configuracoes-repository.ts` | Ler e salvar as preferências (tabela `configuracoes`) |
| `src/context/items-context.tsx` | Expõe os itens às telas. Não tem mais SQL nem dados fixos: chama o repositório |
| `src/app/_layout.tsx` | `<SQLiteProvider databaseName="validaja.db" onInit={migrarBanco}>` envolve o app |
| `metro.config.js` | Configuração exigida pelo `expo-sqlite` na web (ver seção 6) |

**Padrão Repositório.** As telas não escrevem SQL. Elas continuam chamando `useItems()` com a mesma interface da etapa 3 (`adicionarItem`, `definirStatus`, `restaurarEstado`…), e só o repositório sabe que existe um banco. Por isso a troca do armazenamento mexeu pouco nas telas.

**O banco é a fonte da verdade.** O contexto guarda uma cópia da lista em memória para as telas renderizarem sem esperar consultas. Toda alteração segue a sequência *grava no banco → relê a tabela → atualiza a cópia*. Assim, a tela nunca mostra algo que não foi salvo. Reler a tabela inteira é simples e, para o volume de uma despensa doméstica (dezenas ou centenas de itens), tem custo desprezível.

**Inicialização.** O `SQLiteProvider` abre o banco e só renderiza o app depois que o `onInit` (`migrarBanco`) termina. Em seguida, o `ItemsProvider` faz a primeira leitura e também só renderiza as telas quando ela termina. Durante esse intervalo, de poucos milissegundos, a splash screen continua visível. Isso evita que "Nenhum item cadastrado" pisque na tela, ou que um link direto para `/item/3` mostre "Item não encontrado" antes de os dados chegarem.

## 4. Migrações

O SQLite guarda um número de versão dentro do próprio arquivo do banco (`PRAGMA user_version`, que começa em 0). Em `schema.ts`, `MIGRACOES` é uma lista em que a posição *n* leva o banco da versão *n* para a *n+1*:

```ts
const MIGRACOES = [
  async (db) => { /* versão 1: CREATE TABLE itens, configuracoes + seed */ },
  // versão 2: ALTER TABLE ... (futuro)
];
```

A cada abertura, `migrarBanco` lê a versão e aplica **só as migrações que faltam**, cada uma numa **transação** junto com a troca do `user_version`. Ou a migração inteira é aplicada e a versão sobe, ou nada muda. Consequências:

- Na **primeira abertura** (versão 0), cria as tabelas e roda a seed.
- Nas **aberturas seguintes** (versão 1), não faz nada. A seed **não** é reinserida e os dados do usuário são preservados.
- Para evoluir o schema numa etapa futura, basta acrescentar uma posição na lista. Quem já tem o app instalado recebe só a alteração nova, sem perder dados.

## 5. Seed (dados de exemplo)

`src/database/seed.ts` insere **15 itens**: 10 ativos, 3 consumidos e 2 descartados. Eles cobrem todas as faixas de urgência e deixam as estatísticas com números desde o primeiro uso:

| Situação | Itens |
|---|---|
| Vencido | Alface (venceu ontem) |
| Vence hoje / urgente (≤ 2 dias) | Queijo muçarela (hoje), Leite integral (amanhã), Banana (2 dias) |
| Atenção (3–5 dias) | Pão de forma (3), Peito de frango (4) |
| Em dia | Carne moída (10), Lasanha congelada (45), Arroz (120), Molho de tomate (200) |
| Consumidos | Iogurte natural, Ovos, Feijão |
| Descartados | Tomate, Presunto |

- As **datas são relativas ao dia em que a seed roda** (`adicionarDias(...)`). Uma data fixa ("01/10/2026") faria todos os itens aparecerem vencidos poucas semanas depois. Com datas relativas, a demonstração sempre mostra a mesma variedade de situações.
- A inserção usa um **prepared statement** (`db.prepareAsync`): o `INSERT` é compilado uma vez e executado para cada linha, com os valores passados como parâmetros.
- Para voltar ao estado inicial a qualquer momento, use **Ajustes → Restaurar dados de exemplo**. O botão pede confirmação e, numa transação, apaga os itens, zera o contador de ids (`sqlite_sequence`) e roda a seed de novo. Se algo falhar no meio, a transação é desfeita e os dados antigos continuam lá.

## 6. Segurança e integridade

- **Consultas parametrizadas em todo o código.** Nenhum valor digitado pelo usuário é concatenado no SQL; tudo vai por `?` ou `$parametro`:

  ```ts
  await db.runAsync('UPDATE itens SET status = ?, finalizado_em = ? WHERE id = ?', status, finalizadoEm, Number(id));
  ```

  Isso impede **SQL injection**. Um item chamado `'); DROP TABLE itens; --` é salvo como texto comum. A única interpolação é o número da versão em `PRAGMA user_version = N`, que vem do código e não do usuário, porque `PRAGMA` não aceita parâmetros.
- **Transações** nas operações com vários passos (migração e restauração da seed).
- **Restrições no schema** (seção 2): a última barreira contra dados inválidos.
- **Tratamento de erro nas telas**: se uma gravação falhar, o app mostra o aviso "Não foi possível salvar. Tente novamente." e **não** fecha o formulário, para o usuário não perder o que digitou.
- **Web**: o `expo-sqlite` roda o SQLite compilado para WebAssembly e grava no OPFS do navegador. Para isso, o `metro.config.js` registra a extensão `.wasm` e envia os cabeçalhos `Cross-Origin-Opener-Policy`/`Cross-Origin-Embedder-Policy`. Pela mesma razão, o código usa `withTransactionAsync` (disponível em todas as plataformas) em vez de `withExclusiveTransactionAsync` (que não existe na web).

## 7. O que mudou para o usuário

| Antes (etapa 3) | Agora (etapa 4) |
|---|---|
| Itens voltavam para a lista de exemplo a cada recarga | Itens, histórico e status ficam salvos entre sessões |
| "Desfazer" só funcionava enquanto o app estava aberto | Continua igual para o usuário, mas agora regrava o item no banco |
| Ajustes (lembretes e antecedência) eram só visuais | São salvos na tabela `configuracoes` e carregados ao abrir a aba |
| Aviso "ainda não são salvas entre sessões" | Substituído pelo card **Dados do aplicativo**, com o botão **Restaurar dados de exemplo** |
| 6 itens de exemplo fixos no código | 15 itens na seed do banco |

Arquivos alterados: `src/context/items-context.tsx` (agora usa o banco), `src/app/_layout.tsx` (`SQLiteProvider`), `src/app/(tabs)/configuracoes.tsx` (persistência e restauração), as telas `item/novo`, `item/editar/[id]`, `item/[id]` e `historico` (aguardam a gravação antes de navegar e tratam erro) e `src/types/item.ts` (tipo `NovoItem`).

## 8. Execução e teste

```bash
npm install
npm start
```

Abra no Expo Go, no emulador (`a`/`i`) ou no navegador (`w`). Para checar se tudo compila:

```bash
npx tsc --noEmit
npx expo export -p web
```

### Roteiro de teste da persistência

1. **Seed**: na primeira abertura, a aba Início mostra 10 itens ("… precisam de atenção") e a aba Estatísticas já mostra 3 consumidos e 2 descartados.
2. **Inserir**: cadastre um item novo. **Feche o app por completo** (remova-o da lista de apps recentes) e abra de novo: o item continua lá.
3. **Atualizar**: edite um item, feche e reabra o app: a alteração foi mantida.
4. **Status**: marque um item como consumido e outro como descartado, reabra o app e confira o Histórico e as Estatísticas.
5. **Desfazer**: consuma um item e toque em **Desfazer**. Reabra o app: o item continua ativo.
6. **Preferências**: em Ajustes, desligue os lembretes ou mude a antecedência, reabra o app e confira os valores.
7. **Restaurar seed**: em Ajustes, toque em **Restaurar dados de exemplo** e confirme. A lista volta aos 15 itens originais.
8. **Validação no banco**: o formulário já impede nome vazio, mas o schema também recusaria (ver os `CHECK` em `schema.ts`).

> No **navegador**, cada origem (`localhost:8081`, por exemplo) tem o seu banco. Para começar do zero, limpe os dados do site nas DevTools (*Application → Storage → Clear site data*). No **celular**, desinstalar o app (ou limpar os dados do Expo Go) apaga o banco, e a seed roda de novo na próxima abertura.

### Verificação automatizada feita nesta etapa

O schema, a seed e os repositórios foram executados contra um SQLite real (o módulo `node:sqlite` do Node 22), por meio de um adaptador com a mesma API do `expo-sqlite`. Resultados:

- a migração cria a versão 1 com 15 itens, e rodar `migrarBanco` de novo **não** duplica a seed;
- inserir, consumir e desfazer devolvem o item idêntico ao original;
- os `CHECK` recusam nome vazio, categoria inválida, quantidade 0 e item consumido sem `finalizado_em`;
- o UPSERT de `configuracoes` sobrescreve o valor sem duplicar a chave;
- "Restaurar dados de exemplo" volta para 15 itens com ids de 1 a 15;
- a consulta de itens ativos usa o índice `idx_itens_status_validade`.

## 9. Limitações e próximos passos

- **Os lembretes ainda não disparam notificações.** A preferência é salva, mas o agendamento (`expo-notifications`) fica para uma etapa futura.
- **Sem sincronização ou backup**: os dados ficam só no aparelho. Uma evolução natural é sincronizar com um back-end, usando o `criado_em` e o `id` local como base.
- **Categorias fixas.** Se o usuário puder criar categorias, a migração 2 deve criar a tabela `categorias` e trocar o `CHECK` de `itens.categoria` por uma chave estrangeira.
- O suporte do `expo-sqlite` à web ainda é marcado como *alpha* pelo Expo. Android e iOS são as plataformas principais do app.
