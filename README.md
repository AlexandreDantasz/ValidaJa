# ValidaJá

Aplicativo mobile para controlar a validade dos alimentos guardados em casa (geladeira, freezer e despensa) e reduzir o desperdício doméstico, avisando o usuário antes que os itens vençam.

Projeto desenvolvido de forma progressiva para a disciplina de desenvolvimento mobile.

A proposta completa (problema, público-alvo, funcionalidades, telas, fluxo de navegação e arquitetura) está em [`docs/proposta.md`](docs/proposta.md).

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

## Estrutura do projeto

```
src/
├── app/          # telas e rotas (expo-router)
├── components/   # componentes de UI reutilizáveis
├── constants/    # tema, cores, espaçamento
└── hooks/        # hooks reutilizáveis
```

Este é o scaffold inicial gerado pelo `create-expo-app`. A implementação das telas do ValidaJá começa a partir da Etapa 2 — detalhes de cada etapa em `docs/`.
