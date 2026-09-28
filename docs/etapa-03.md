# Etapa 3 — Navegação, UX e Acessibilidade

> Objetivo desta etapa: completar o fluxo de navegação do ValidaJá e aplicar princípios de experiência do usuário (Lei de Fitts, feedback, prevenção de erros) e de acessibilidade (leitores de tela, contraste, tamanho dos alvos de toque). Os dados continuam em memória (`src/context/items-context.tsx`); a persistência entra em etapa futura.

## 1. Estrutura de navegação implementada

A navegação combina dois mecanismos do Expo Router:

- **Stack (pilha) raiz** — `src/app/_layout.tsx`. Empilha as telas de tarefa (cadastrar, ver detalhes, editar, ver histórico) sobre as abas e oferece o "voltar" (botão do cabeçalho, botão físico/gesto do Android, gesto de deslizar do iOS, botão voltar do navegador).
- **Tabs (abas inferiores)** — `src/app/(tabs)/_layout.tsx`. Dá acesso direto às três áreas principais do app: **Início**, **Estatísticas** e **Ajustes**.

```
Stack (raiz)
├── (tabs) ─────────────── barra de abas inferior
│   ├── Início          /                   lista de itens ativos
│   ├── Estatísticas    /explore            resumo de desperdício
│   └── Ajustes         /configuracoes      preferências de lembrete
├── Novo item           /item/novo          modal
├── Detalhes do item    /item/[id]          push
├── Editar item         /item/editar/[id]   modal
└── Histórico           /historico          push
```

Fluxo completo:

```
Início ──[Novo item]──▶ Novo item (modal) ──[Salvar]──▶ Início + aviso "adicionado"
   │                          └──[Cancelar / voltar]──▶ Início
   │
   └──[toque no card]──▶ Detalhes
                           ├──[Editar]──▶ Editar (modal) ──[Salvar]──▶ Detalhes + aviso "salvo"
                           ├──[Marcar como consumido]──▶ Início + aviso com DESFAZER
                           └──[Descartar]──▶ confirmação ──▶ Início + aviso com DESFAZER

Estatísticas ──[Ver histórico]──▶ Histórico ──[Restaurar]──▶ aviso com DESFAZER
                                     └──[filtro Todos/Consumidos/Descartados]

Ajustes — lembretes (liga/desliga) e antecedência do aviso
```

A estrutura acompanha o propósito do app: a tarefa mais frequente (ver o que vai vencer e cadastrar itens) fica na primeira aba; a análise (estatísticas e histórico) e as preferências ficam em abas próprias; tarefas pontuais abrem sobre a aba atual e voltam para ela ao terminar.

## 2. Telas e mecanismos de acesso

| Tela | Arquivo | Como acessar | Como sair / voltar |
|---|---|---|---|
| **Início** | `src/app/(tabs)/index.tsx` | Tela inicial; aba **Início** | — |
| **Estatísticas** | `src/app/(tabs)/explore.tsx` | Aba **Estatísticas** | Outra aba |
| **Ajustes** | `src/app/(tabs)/configuracoes.tsx` | Aba **Ajustes** | Outra aba |
| **Novo item** | `src/app/item/novo.tsx` | Botão **Novo item** (base da tela Início) | **Salvar item**, **Cancelar** no cabeçalho, gesto/botão voltar |
| **Detalhes do item** | `src/app/item/[id].tsx` | Toque em qualquer card da lista de Início | Botão voltar do cabeçalho, gesto/botão voltar, ou ao consumir/descartar |
| **Editar item** | `src/app/item/editar/[id].tsx` | Botão **Editar** em Detalhes | **Salvar alterações**, **Cancelar**, gesto/botão voltar |
| **Histórico** | `src/app/historico.tsx` | Botão **Ver histórico** em Estatísticas | Botão voltar do cabeçalho, gesto/botão voltar |

Nesta etapa, **Configurações virou a aba "Ajustes"** (antes era um ícone de engrenagem no canto superior direito da tela Início) e foi criada a tela **Histórico**, que fecha o ciclo "dar baixa → consultar → desfazer".

## 3. Menus, abas e outros mecanismos de navegação

- **Barra de abas inferior** (`Tabs`): três abas com ícone (`@expo/vector-icons`/MaterialIcons) e rótulo de texto sempre visível. A aba ativa usa a cor primária no ícone e no rótulo e é anunciada como "selecionada" pelo leitor de tela. Cada aba tem um rótulo acessível mais descritivo (`tabBarAccessibilityLabel`, ex.: "Estatísticas de desperdício").
- **Pilha com cabeçalho nativo**: título da tela e botão voltar em todas as telas empilhadas. No iOS o botão mostra só a seta (`headerBackButtonDisplayMode: 'minimal'`), para não truncar títulos.
- **Modais para formulários** (Novo item e Editar item): indicam que a tela é uma tarefa temporária. Além do gesto/botão voltar, têm um botão **Cancelar** explícito no cabeçalho (`BotaoCancelar`, em `_layout.tsx`).
- **Botões de ação** que levam a outras telas: **Novo item**, **Editar** e **Ver histórico**.
- **Cards clicáveis** na lista de Início: o card inteiro abre os Detalhes e tem um ícone de seta (›) indicando que leva a outra tela.
- **Filtro em pills** no Histórico (Todos / Consumidos / Descartados), reaproveitando o componente `OptionPills`.

## 4. Mecanismos de feedback visual

| Mecanismo | Onde | Implementação |
|---|---|---|
| **Aviso temporário (snackbar/toast)** após cada ação: item adicionado, alterações salvas, consumido, descartado, restaurado | Todas as ações que alteram dados | `src/components/toast.tsx` + `src/context/feedback-context.tsx` (`useFeedback().mostrarFeedback`) |
| **Botão "Desfazer"** no aviso após consumir, descartar ou restaurar | Detalhes, Histórico | `restaurarEstado` em `items-context.tsx` volta o item exatamente ao estado anterior |
| **Estado pressionado** em todos os elementos tocáveis: fundo mais escuro nos cards, pills e botões contornados; leve redução de escala e opacidade nos botões | `PrimaryButton`, `ItemCard`, `OptionPills`, stepper, linha do switch, botões do cabeçalho | `Pressable` com `style={({ pressed }) => ...}` |
| **Estado desabilitado** com opacidade reduzida | Botões − / + do stepper nos limites (1 e 14) ou com lembretes desligados; card de antecedência inteiro com lembretes desligados | `disabled` + `accessibilityState` |
| **Estado selecionado** com cor de fundo, texto em negrito e ícone ✓ | `OptionPills` (categoria, local, data, filtro) | — |
| **Foco em campo de texto**: borda em cor primária e mais grossa | `FormField` | `onFocus`/`onBlur` |
| **Erro de validação junto ao campo**: borda vermelha, ícone e mensagem explicativa, que some quando o usuário corrige o campo | `ItemForm` / `FormField` | `erro` por campo |
| **Confirmação antes de ação destrutiva** (Descartar) | Detalhes | `src/utils/confirmar.ts` (`Alert` nativo; `window.confirm` na web) |
| **Resumo de situação** no topo da lista ("4 itens cadastrados · 1 precisa de atenção") | Início | `resumoDaLista` |
| **Selo de urgência** com cor + ícone + texto | Cards e Detalhes | `UrgencyBadge` |
| **Texto de estado** ("Ativados — você será avisado…" / "Desativados") | Ajustes | — |

## 5. Principais decisões de UX

1. **Lei de Fitts: ações principais na base da tela.** O tempo para atingir um alvo cresce com a distância e diminui com o tamanho do alvo. Por isso:
   - a navegação principal está numa **barra de abas inferior**, e não num menu no topo;
   - o botão **Novo item** tem largura total e fica fixo na base da tela Início, logo acima das abas — antes ele ficava depois da lista;
   - a engrenagem que ficava no **canto superior direito** (a região mais difícil de alcançar com o polegar) foi substituída pela aba **Ajustes**;
   - em Detalhes, as ações ficam na base e a mais frequente (**Marcar como consumido**, botão cheio) fica por último, mais perto da mão;
   - o aviso com **Desfazer** aparece na parte inferior, ao alcance do polegar.
2. **Alvos grandes.** Constante `MinTouchTarget = 48` em `src/constants/theme.ts`, aplicada a todos os elementos tocáveis: botões (52dp de altura), pills, campos de texto, stepper (56 × 56), botões do aviso e do cabeçalho. Cards e a linha do switch fazem da **área inteira** o alvo, e não só o texto ou o próprio switch.
3. **Prevenção e recuperação de erros.** A ação destrutiva (**Descartar**) fica separada das outras por um divisor, pede confirmação e ainda pode ser desfeita. Consumir e restaurar não pedem confirmação, para não atrapalhar o fluxo mais comum, mas também podem ser desfeitos pelo aviso.
4. **Rótulos claros.** "Descartar (venceu)" virou **Descartar**, porque o texto antigo sugeria que o item estava vencido mesmo quando não estava. Nas estatísticas, "Descartados por vencimento" virou **Descartados**, pelo mesmo motivo. Todos os botões principais combinam ícone e texto.
5. **Mensagens compreensíveis e acionáveis.** Os erros dizem o que fazer ("Informe o nome do item, por exemplo \"Leite integral\"."). Os estados vazios explicam como sair deles ("Toque em \"Novo item\" para cadastrar…"). A confirmação de descarte explica a consequência ("…passa a contar como desperdício nas estatísticas").
6. **Consistência.** Um mesmo componente para cada padrão (`PrimaryButton`, `OptionPills`, `FormField`, `EmptyState`, `ScreenHeader`), as mesmas cores semânticas em todo o app e um único mecanismo de feedback (`useFeedback`).

## 6. Medidas de acessibilidade

### Leitores de tela (TalkBack / VoiceOver)

- **Papéis (`accessibilityRole`)** em todos os elementos interativos: `button` (botões e cards), `tab` (abas, via `Tabs`), `radiogroup` e `radio` (`OptionPills`), `switch` (linha de lembretes), `adjustable` (antecedência do aviso), `header` (título de cada tela, via `ScreenHeader`), `alert` (aviso temporário).
- **Estados (`accessibilityState`)**: `checked`/`selected` nas pills, `checked` no switch, `disabled` nos botões e no stepper.
- **Rótulos (`accessibilityLabel`)** para o que não tem texto ou tem texto abreviado:
  - cada card de item é lido como **uma frase só**: "Leite integral. Vence amanhã. Laticínios, Geladeira, 1 unidade.";
  - os atalhos de data leem a data completa: "Daqui a 3 dias, 01/10/2026", em vez de "+3 dias";
  - os cards de estatística leem "2 itens: Consumidos", e o percentual é lido como frase;
  - as linhas de informação em Detalhes leem "Validade: 29/09/2026";
  - os ícones são decorativos e o texto vem sempre ao lado.
- **Dicas (`accessibilityHint`)** explicam o resultado de ações não óbvias: "Abre os detalhes do item", "Pede confirmação e remove o item da lista, contando como desperdício", "Fecha o formulário sem salvar".
- **Anúncios automáticos** (`AccessibilityInfo.announceForAccessibility`): todo aviso de feedback é falado, inclusive a existência da ação Desfazer, e os erros do formulário são anunciados ao tentar salvar. Regiões com `accessibilityLiveRegion="polite"` no Android: aviso, erro do campo e data selecionada.
- **Controle ajustável**: a antecedência do aviso responde aos gestos de incremento/decremento do leitor de tela (deslizar para cima/baixo no VoiceOver, teclas de volume no TalkBack) por meio de `accessibilityActions` e `accessibilityValue` ("3 dias antes").
- **Campos de formulário** associados ao rótulo (`accessibilityLabel` + `accessibilityLabelledBy`), com a mensagem de erro exposta como dica.

### Contraste e legibilidade

- Paleta revisada em `src/constants/theme.ts` com tokens semânticos (`primary`, `danger`, `warning`, `attention`, `success`, `border`…), definidos para o tema claro e o escuro. Razões calculadas pela fórmula da WCAG 2.1:

| Uso | Antes | Agora (claro / escuro) |
|---|---|---|
| Texto sobre botão primário | 3,53 ❌ | 5,69 / 8,00 ✅ |
| Selo "Atenção" | 1,46 ❌ | 5,04 / 10,75 ✅ |
| Selo "Vence logo" | 1,78 ❌ | 5,15 / 8,21 ✅ |
| Selo "Em dia" | 2,78 ❌ | 5,02 / 7,18 ✅ |
| Selo "Vencido" / erros | 3,44 ❌ | 5,04 / 6,79 ✅ |
| Borda de campos e pills (mínimo 3:1) | sem borda | 3,46 / 4,01 ✅ |

  Todas as cores de texto passam do nível **AA (4,5:1)** contra o fundo da tela e dos cards.
- **A cor nunca é o único indicador**: urgência = cor + ícone + texto; opção selecionada = cor + negrito + ✓; erro = cor + ícone + mensagem; aba ativa = cor + anúncio do leitor de tela.
- **Textos legíveis**: corpo com 16px, textos secundários com no mínimo 14px, rótulos da barra de abas com 12px em negrito e títulos de 30px. Os textos acompanham o tamanho de fonte do sistema, pois não há `allowFontScaling={false}`, e os layouts usam `flexWrap`/`flexShrink` para não cortar texto ampliado.
- **Tema claro e escuro** automáticos, com a mesma verificação de contraste nos dois.

### Tamanho dos alvos

- Mínimo de 48dp em todo elemento interativo (ver seção 5).

## 7. Execução e teste da navegação

### Executar

```bash
npm install
npm start
```

Escaneie o QR code com o Expo Go (Android) ou a câmera (iOS), ou pressione `a`, `i` ou `w` para abrir no emulador Android, no simulador iOS ou no navegador. Para checar se todas as rotas compilam:

```bash
npx expo export -p web
```

### Roteiro de teste da navegação e do feedback

1. **Início**: confira a lista ordenada por urgência e o resumo no topo ("… precisa de atenção").
2. Toque em **Novo item** e depois em **Salvar item** com o nome vazio: o campo fica com borda vermelha e mostra a mensagem de erro. Preencha o nome e ela some.
3. Escolha uma categoria e uma data e salve. O app volta para Início e mostra o aviso "… adicionado à lista".
4. Abra **Novo item** outra vez e toque em **Cancelar**: o formulário fecha sem salvar.
5. Toque em um card para abrir os **Detalhes**, depois em **Editar**, altere e salve. O app volta para Detalhes e mostra o aviso "Alterações salvas".
6. Em Detalhes, toque em **Marcar como consumido**. O app volta para Início e mostra o aviso com **DESFAZER**; toque nele e o item volta à lista.
7. Em Detalhes, toque em **Descartar**: aparece a confirmação. Cancele uma vez e depois confirme.
8. Abra a aba **Estatísticas**, toque em **Ver histórico**, use os filtros e toque em **Restaurar** em algum item.
9. Abra a aba **Ajustes**: toque na linha inteira de "Lembretes de validade" e veja o card de antecedência desabilitar. Reative e use − / +.
10. Teste o voltar pelo botão do cabeçalho, pelo botão ou gesto do Android e pelo gesto de borda do iOS.

### Roteiro de teste de acessibilidade

- **Android (TalkBack)**: *Configurações → Acessibilidade → TalkBack*. Deslize para a direita para percorrer os elementos e confira se cada card é lido como uma frase, se as pills anunciam "selecionado" e se o aviso é falado após salvar. Na antecedência do aviso, use o gesto de ajuste.
- **iOS (VoiceOver)**: *Ajustes → Acessibilidade → VoiceOver*. Use o rotor em "Cabeçalhos" para pular entre os títulos das telas. Na antecedência do aviso, deslize para cima ou para baixo.
- **Web**: ative o leitor de tela do sistema (Narrador/NVDA) ou inspecione os papéis e rótulos com as DevTools (painel *Accessibility*).
- **Fonte ampliada**: aumente o tamanho da fonte do sistema e verifique se os textos quebram linha sem ser cortados.
- **Tema escuro**: troque o tema do sistema e confira o contraste.
